require('dotenv').config();
const compress = require("fastify-compress");
const noIcon = require("fastify-no-icon");
const helmet = require("fastify-helmet");
const cors = require("fastify-cors");
const fastify = require("fastify");
const path = require("path");

// List of routes
let { routes } = require("./config.min");
let { _render, _static, _assets } = require("./plugin.min");

let PORT = process.env.PORT || 3000;
let root = path.join(__dirname, 'public');
let dev = process.env.dev == "true";

let maxAge = (dev ? 0 : 1) * 1000 * 60 * 60 * 24 * 7;
let app = fastify({
    logger: dev && {
        prettyPrint: { translateTime: "hh:MM:ss TT", }
    },
    ignoreTrailingSlash: true,
    caseSensitive: false
});

if (typeof (process.env.CLOUDINARY_URL) == 'undefined') {
    console.warn('!! Cloudinary config is undefined !!');
    console.warn('export CLOUDINARY_URL or set dotenv file');
}

app.register(compress) // Compress/GZIP/Brotil Server
   .register(helmet) // Protect server
   .register(noIcon) // Remove the no favicon error
   .register(_render) // Render Plugin
   .register(_assets) // Assets Plugin

   // Apply CORS
   .register(cors, { cacheControl: true, maxAge })

   // Server Static File
   .register(_static, { cacheControl: true, maxAge, root });

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
        .type(req.headers["content-type"] || 'text/plain')
        .send('A custom not found');
});

app.setErrorHandler((err, req, res) => {
    let statusCode = err.statusCode >= 400 ? err.statusCode : 500;
    req.log.warn(err);
    res
        .code(statusCode)
        .type(req.headers["content-type"] || 'text/plain')
        .send(statusCode >= 500 ? "Internal server error" : err.message);
});

app.listen(PORT, err => {
    if (err) app.log.error(err);
    app.log.info("Server listening on port", PORT);
});
