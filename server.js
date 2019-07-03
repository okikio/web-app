require('dotenv').config();
const compress = require("fastify-compress");
const _static = require("fastify-static");
const noIcon = require("fastify-no-icon");
const helmet = require("fastify-helmet");
const assets = require('cloudinary').v2;
const cors = require("fastify-cors");
const fastify = require("fastify");
const axios = require("axios");
const path = require("path");

// List of routes
let { routes } = require("./config.min");
let { render } = require("./plugin.min");

let PORT = process.env.PORT || 3000;
let root = path.join(__dirname, 'public');
let dev = process.env.dev == "true";

let maxAge = (dev ? 0 : 1) * 1000 * 60 * 60 * 24 * 7;
let app = fastify({
    logger: dev && {
        prettyPrint: {
            translateTime: "hh:MM:ss TT",
        }
    },
    ignoreTrailingSlash: true,
    caseSensitive: false
});

if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
    console.warn('!! Cloudinary config is undefined !!');
    console.warn('export CLOUDINARY_URL or set dotenv file');
}

app.register(compress) // Compress/GZIP/Brotil Server
   .register(helmet) // Protect server
   .register(noIcon) // Remove the no favicon error
   .register(render) // Render Plugin

   // Apply CORS
   .register(cors, { cacheControl: true, maxAge: maxAge })

   // Server Static File
   .register(_static, { cacheControl: true, maxAge: maxAge, root: root });

// Load assets and cache assets
app.get("/assets/:asset", (req, res) => {
    var mime = {
        html: 'text/html',
        txt: 'text/plain',
        css: 'text/css',
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        js: 'application/javascript'
    };

    let asset = req.params.asset;
    let url = assets.url(asset, {
        quality: 30,
        transformation: [
            { aspect_ratio: "4:3", crop: "fill" },
            { width: "auto", dpr: "auto", crop: "scale" }
        ]
    });
    let indx = url.lastIndexOf(".");
    var type = mime[url.slice(indx + 1)] || 'text/plain';
    let media = /image/g.test(type);
    let key = `assets__${asset}__fastify`;
    res.header("cache-control", `public, max-age=${maxAge}`);
    if (key in app.cache) {
        let val = app.cache[key];
        if (val.type) { res.type(val.type).send(val.data); }
        else { res.send(val.data); }
    } else {
        if (/text|application/g.test(type)) url = url.replace("image", "raw");
        axios.get(url, media ? { responseType: 'arraybuffer' } : undefined)
            .then(val => {
                if (media) {
                    let buf = Buffer.from(val.data, 'base64');
                    app.cache[key] = {
                        type: val.headers['content-type'],
                        data: buf
                    };
                    return res.type(val.headers['content-type']).send(buf);
                }

                app.cache[key] = { data: val.data };
                return res.send(val.data);
            }).catch(err => {
                res.send(err.message);
                app.log.error(err);
            });
    }
});

// Routes and the pages to render
for (let i in routes)
    app.get(i, (req, res) => {
        res.header("cache-control", `public, max-age=${maxAge}`);
        res.render(routes[i], req.headers["x-barba"]);
    });

// Error handling
app.setNotFoundHandler((req, res) => {
    res
        .code(404)
        .type('text/plain')
        .send('A custom not found');
});

app.listen(PORT, err => {
    if (err) app.log.error(err);
    app.log.info("Server listening on port", PORT);
});
