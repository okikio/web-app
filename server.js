let { env } = process;
if (!('dev' in env)) require('dotenv').config();
let dev = 'dev' in env && env.dev.toString() === "true";
let heroku = 'heroku' in env && env.heroku.toString() === "true";

const compress = require("fastify-compress");
const noIcon = require("fastify-no-icon");
const helmet = require("fastify-helmet");
const cors = require("fastify-cors");
const fastify = require("fastify");
const logger = require('morgan');
const path = require("path");

// List of routes
let { routes } = require('./config.min');
let { _render, _static, _assets } = require('./plugin');
// Possibly faster: https://nanoexpress.js.org/middlewares.html

// Normalize a port into a number, string, or false.
let normalizePort = val => {
    let port = parseInt(val, 10);
    if (isNaN(port)) { return val; } // Named pipe
    if (port >= 0) { return port; } // Port number
    return false;
};

let HOST = heroku ? '0.0.0.0' : 'localhost';
let root = path.join(__dirname, 'public');
let PORT = normalizePort(process.env.PORT || 3000);
(async () => {
    let maxAge = (dev ? 0 : 1) * 1000 * 60 * 60 * 24 * 7;
    let app = fastify({
        logger: dev && {
            prettyPrint: {
                translateTime: "hh:MM:ss TT",
                ignore: "pid,hostname,reqId", // --ignore
            },
        },
        ignoreTrailingSlash: true,
        caseSensitive: false,
    });
    await app.register(require("fastify-express"));
    app.use(logger("dev")) // Simple HTTP Logging
        .register(compress) // Compress/GZIP/Brotil Server
        .register(helmet) // Protect server
        .register(noIcon) // Remove the no favicon error
        .register(_render, { partial: "#swup" }) // Render Plugin
        .register(_assets, { maxAge }) // Assets Plugin

        // Apply CORS
        .register(cors, {
            methods: ["GET", "PUT", "POST"],
            cacheControl: true,
            maxAge,
            preflightContinue: true,
            preflight: true,
        })

        // Server Static File
        .register(_static, { cacheControl: true, maxAge, root });

    // Routes and the pages to render
    for (let i in routes) {
        app.get(i, (req, res) => {
            res.header("cache-control", `public, max-age=${maxAge}`);
            res.render(routes[i]); // , req.headers["x-partial"]
        });
    }

    // Error handling
    app.setNotFoundHandler((req, res) => {
        res.code(404)
            .type(req.headers["content-type"] || "text/plain")
            .render("404"); // , req.headers["x-partial"]
    });

    app.setErrorHandler((err, req, res) => {
        let statusCode = err.statusCode >= 400 ? err.statusCode : 500;
        req.log.warn(err);
        res.code(statusCode)
            .type(req.headers["content-type"] || "text/plain")
            .send(statusCode >= 500 ? "Internal server error" : err.message);
    });

    app.listen(PORT, HOST, (err) => {
        if (err) app.log.error(err);
        app.log.info("Server listening on port", PORT);
    });
})();