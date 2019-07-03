const noIcon = require("fastify-fastify-no-icon");
const compress = require("fastify-compress");
const helmet = require("fastify-helmet");
const static = require("fastify-static");
const fastify = require("fastify");
const path = require("path");

let PORT = process.env.PORT || 3000;
let dev = process.env.NODE_ENV == "developement";
let app = fastify({
    logger: { prettyPrint: !dev },
    ignoreTrailingSlash: true,
    caseSensitive: false
});

// Cache times
let day = (dev ? 0 : 1) * 1000 * 60 * 60 * 24;
let week = (dev ? 0 : 1) * 1000 * 60 * 60 * 24 * 7;

// Render function
let render = (file = "index", dur) => (req, res) => {

};

app.register(compress) // Compress/GZIP/Brotil Server
   .register(helmet) // Protect server
    .register(noIcon) // Remove the no favicon error

   // Server Static File
   .register(static, {
        root: path.join(__dirname, 'public'),
        cacheControl: true,
        maxAge: day
    });


app.decorateReply('view', function (template, args) {
  // Amazing view rendering engine.
})

app.get('/', (req, res) => {
  res.view('/index.html', { hello: 'world' })
});


app.get('/', (req, res) => res.send({ message: "Fast, and Speedy" }))
   .get('/run', (req, res) => res.send("It works"));

// Error handling
app.setNotFoundHandler((req, res) => {
    res
        .code(404)
        .type('text/plain')
        .send('A custom not found');
});

app.listen(PORT, err => {
    if (err) app.log.error(err);
    app.log.warn('this is a waring text');
    app.log.info("Server listening on port", PORT);
});
