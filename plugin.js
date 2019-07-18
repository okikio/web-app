if ('dev' in process.env) require('dotenv').config();
const { statSync, createReadStream } = require("fs");
const { PassThrough } = require("stream");
const plugin = require("fastify-plugin");
const { lookup } = require("mime-types");
const assets = require("cloudinary").v2;
const axios = require("axios");
const path = require("path");
const glob = require("glob");
const send = require("send");
const url = require("url");

const { cloud_name, imageURLConfig } = require('./config.min');
assets.config({ cloud_name, secure: true });

// For faster efficient page switching using partial output
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports._render = plugin((app, opts, next) => {
    // Selector for the partial output
    let partialSel = opts.partial || '[data-barba="container"]';
    let root = opts.root || path.join(__dirname, 'public'); // Root for file

    // Simplify path to file
    app.cache || app.decorate('cache', {});

    // Simplify path to file
    app.decorate('path', (filePath, _root, _ext = ".html") => {
        return `${_root ? _root + "/" : ""}${filePath.replace(_ext, "")}${_ext}`;
    });

    // Partial Render
    app.decorateReply('partial', function (filePath) {
        let file = app.path(filePath, root);
        let key = `${file}__partial__fastify`;
        let dom, data = "", res = this;

        if (key in app.cache) {
            res.type("text/html").send(app.cache[key]);
        } else {
            createReadStream(file)
                .on("data", val => { data += val; })
                .on("error", err => { res.log.error(err); })
                .on("close", () => {
                    dom = new JSDOM(data).window.document;
                    dom = dom.querySelector(partialSel);
                    data = dom.outerHTML;

                    app.cache[key] = data;
                    res.type("text/html").send(data);
                });
        }

        return res;
    });

    // HTML Render
    app.decorateReply('html',function (filePath) {
        let file = app.path(filePath, root);
        let key = `${file}__fastify`;
        let data = "", res = this;

        if (key in app.cache) {
            res.type("text/html").send(app.cache[key]);
        } else {
            createReadStream(file)
                .on("data", val => { data += val; })
                .on("error", err => { res.log.error(err); })
                .on("close", () => {
                    app.cache[key] = data;
                    res.type("text/html").send(data);
                });
        }

        return res;
    });

    // Render Engine
    app.decorateReply('render', function (filePath, partial) {
        let file = app.path(filePath);
        return (partial ? this.partial(file) : this.html(file));
    });

    next();
});

// Based on fastify-static
module.exports._static = plugin((app, opts, next) => {
    if (opts.prefix == undefined) opts.prefix = '/';
    let prefix = opts.prefix[opts.prefix.length - 1] == '/' ? opts.prefix : (opts.prefix + '/');
    let schema = { schema: { hide: typeof opts.schemaHide != 'undefined' ? opts.schemaHide : true } };
    let _err = (msg, type = Error) => next(new type(msg));
    let root = opts.root, setHeaders = opts.setHeaders;
    let pathStat, sendOpts = {
        lastModified: opts.lastModified,
        acceptRanges: opts.acceptRanges,
        cacheControl: opts.cacheControl,
        extensions: opts.extensions,
        immutable: opts.immutable,
        dotfiles: opts.dotfiles,
        maxAge: opts.maxAge,
        index: opts.index,
        root: opts.root,
        etag: opts.etag
    };

    if (root == undefined)
        { return _err('"root" option is required'); }
    if (typeof root != 'string')
        { return _err('"root" option must be a string'); }
    if (!path.isAbsolute(root))
        { return _err('"root" option must be an absolute path'); }

    try {
        pathStat = statSync(root);
        if (!pathStat.isDirectory())
            { return _err('"root" option must point to a directory'); }

        if (setHeaders != undefined && typeof setHeaders != 'function')
            { return _err('The `setHeaders` option must be a function', TypeError); }

    } catch (e) {
        return e.code == 'ENOENT' ? app.log.warn(`"root" path "${root}" must exist`) : e;
    }

    // Simplify path to file
    app.cache || app.decorate('cache', {});

    // Pumps `send` to the reply/response Object
    app.decorate('sendReply', (req, reply, path) => {
        let stream, file, wrap, key = `static__${path}__fastify`;
        reply.header("cache-control", `public, max-age=${opts.maxAge}`);

        if (key in app.cache) {
            reply.type(lookup(path)).send(app.cache[key]);
        } else {
            stream = send(req.raw, path, sendOpts);
            stream.on('file', _file => { file = _file; });
            wrap = new PassThrough({
                flush(fn) {
                    if (reply.res.statusCode == 304) reply.send('');
                    this.finished = true; fn();
                }
            });

            Object.assign(wrap, {
                getHeader: reply.getHeader.bind(reply),
                setHeader: reply.header.bind(reply),
                socket: req.raw.socket,
                finished: false
            });

            Object.defineProperties(wrap, {
                "filename": { get: () => file },
                "statusCode": {
                    get: () => reply.res.statusCode,
                    set: code => { reply.code(code); }
                }
            });

            wrap.on('pipe', val => { reply.send(val); })
                .on('data', val => { app.cache[key] = Buffer.from(val).toString(); });

            if (setHeaders != undefined)
                { stream.on('headers', setHeaders); }

            if (opts.redirect == true) {
                stream.on('directory', () => {
                    let parsed = url.parse(req.raw.url);
                    reply.redirect(301, parsed.pathname + '/' + (parsed.search || ''));
                });
            }

            stream.on('error', err => {
                if (err) {
                    if (err.code == 'ENOENT') return reply.callNotFound();
                    reply.send(err);
                }
            });

            stream.pipe(wrap);
        }
    });

    if (opts.decorateReply !== false) {
        app.decorateReply('sendFile', function (filePath) {
            app.sendReply(this.request, this, filePath);
        });
    }

    if (opts.serve != false) {
        if (opts.wildcard == undefined || opts.wildcard == true) {
            app.get(prefix + '*', schema, (req, res) => {
                app.sendReply(req, res, '/' + req.params['*']);
            });

            if (opts.redirect && prefix != opts.prefix) {
                app.get(opts.prefix, schema, (req, res) => {
                    let parsed = url.parse(req.raw.url);
                    res.redirect(301, parsed.pathname + '/' + (parsed.search || ''));
                });
            }
        } else {
            let globPattern = typeof opts.wildcard == 'string' ? opts.wildcard : '**/*';
            glob(path.join(sendOpts.root, globPattern), { nodir: true }, (err, files) => {
                if (err) return next(err);

                let indexDirs = new Set(), route, pathname, file;
                let indexes = typeof opts.index == 'undefined' ? ['index.html'] : [].concat(opts.index || []);

                for (let _file of files) {
                    file = _file.replace(sendOpts.root.replace(/\\/g, '/'), '').replace(/^\//, '');
                    route = (prefix + file).replace(/\/\//g, '/');
                    app.get(route, schema, (req, res) => {
                        app.sendReply(req, res, '/' + file);
                    });

                    if (indexes.includes(path.posix.basename(route)))
                        { indexDirs.add(path.posix.dirname(route)); }
                }

                indexDirs.forEach(dirname => {
                    pathname = dirname + (dirname.endsWith('/') ? '' : '/');
                    file = '/' + pathname.replace(prefix, '');

                    app.get(pathname, schema, (req, res) => {
                        app.sendReply(req, res, file);
                    });

                    if (opts.redirect) {
                        app.get(pathname.replace(/\/$/, ''), schema, (req, res) => {
                            app.sendReply(req, res, file.replace(/\/$/, ''));
                        });
                    }
                });

                next();
            });

            return; // Stop
        }
    }

    next();
});

module.exports._assets = plugin((app, opts, next) => {
    let maxAge = opts.maxAge;

    // Load and cache assets
    app.get("/assets/:asset", (req, res) => {
        let URLObj = url.parse(req.raw.url, true);
        let asset = req.params.asset;
        let queryStr = URLObj.search;
        let query = URLObj.query;
        // https://3000-a3b2b5f7-b627-40f3-87c9-6330e4d9aefd.ws-us0.gitpod.io/assets/city.webp?w=100

        let height = query.h;
        let width = query.w || 'auto';
        asset = asset.replace(queryStr, '');
        let imgURLConfig = { ...imageURLConfig, width, height };
        let _url = assets.url(asset, imgURLConfig);

        var type = lookup(_url) || 'text/plain';
        let media = /image|video/g.test(type);
        let key = `assets__${URLObj.path}__fastify`;
        res.header("cache-control", `public, max-age=${maxAge}`);

        if (key in app.cache) {
            let val = app.cache[key];
            if (val.type) { res.type(val.type).send(val.data); }
            else { res.send(val.data); }
        } else {
            if (/text|application/g.test(type)) _url = _url.replace("image", "raw");
            axios.get(_url, media ? { responseType: 'arraybuffer' } : undefined)
                .then(val => {
                    if (media) {
                        let buf = Buffer.from(val.data, 'base64');
                        app.cache[key] = { type: type, data: buf };
                        return res.type(type).send(buf);
                    }

                    app.cache[key] = { data: val.data };
                    return res.send(val.data);
                }).catch(err => {
                    res.send(err.message);
                    app.log.error(err);
                });
        }
    });

    next();
});
