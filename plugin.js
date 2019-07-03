const plugin = require('fastify-plugin');
const path = require("path");
const fs = require("fs");

// For faster more efficient page switching
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.render = plugin((app, opts, next) => {
    // Selector for the partial output
    let partialSel = opts.partial || '[data-barba="container"]';
    let root = opts.root || path.join(__dirname, 'public'); // Root for file

    // Simplify path to file
    app.decorate('cache', {});

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
            fs.createReadStream(file)
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
            fs.createReadStream(file)
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