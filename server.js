if (!('dev' in process.env)) require('dotenv').config();
const compress = require("fastify-compress");
const noIcon = require("fastify-no-icon");
const helmet = require("fastify-helmet");
const cors = require("fastify-cors");
const fastify = require("fastify");
const path = require("path");

// List of routes
let { routes } = require("./config.min");
let { _render, _static, _assets, _reload } = require("./plugin.min");

// Normalize a port into a number, string, or false.
let normalizePort = val => {
    let port = parseInt(val, 10);
    if (isNaN(port)) { return val; } // Named pipe
    if (port >= 0) { return port; } // Port number
    return false;
};

let HOST = '0.0.0.0';
let { env } = process;
let root = path.join(__dirname, 'public');
let PORT = normalizePort(process.env.PORT || 3000);
let dev = 'dev' in env && env.dev.toString() == "true";

let reloadTime = 29; // Set server reload time to 29 minutes
let maxAge = (dev ? 0 : 1) * 1000 * 60 * 60 * 24 * 7;
let app = fastify({
    logger: {
        prettyPrint: { translateTime: "hh:MM:ss TT", }
    },
    ignoreTrailingSlash: true,
    caseSensitive: false
});

app.register(compress) // Compress/GZIP/Brotil Server
   .register(helmet) // Protect server
   .register(noIcon) // Remove the no favicon error
   .register(_render) // Render Plugin
   .register(_assets, { maxAge }) // Assets Plugin
   .register(_reload, { reloadTime }) // Server Reload Plugin (for Heroku)

   // Apply CORS
   .register(cors, {
        methods: ['GET', 'PUT', 'POST'],
        cacheControl: true, maxAge,
        preflightContinue: true,
        preflight: true
    })

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

app.listen(PORT, HOST, err => {
    if (err) app.log.error(err);
    app.log.info("Server listening on port", PORT);
});
