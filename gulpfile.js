if (!('dev' in process.env)) require('dotenv').config();
const { src, task, series, parallel, dest, watch } = require('gulp');
const { init, write } = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const replace = require('gulp-string-replace');
const { html, js } = require('gulp-beautify');
const { spawn } = require('child_process');
const htmlmin = require('gulp-htmlmin');
const assets = require("cloudinary").v2;
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const { obj } = require('through2');
const babel = require('gulp-babel');
const { writeFile } = require("fs");
const config = require('./config');
const webpack = require('webpack');
const sass = require('gulp-sass');
const pug = require('gulp-pug');

let { env } = process;
let { pages, cloud_name, imageURLConfig } = config;
let dev = 'dev' in env && env.dev.toString() == "true";
let staticSite = 'staticSite' in env && env.staticSite == "true";

let assetURL = `https://res.cloudinary.com/${cloud_name}/`;
assets.config({ cloud_name, secure: true });

let htmlMinOpts = {
    minifyJS: true,
    minifyCSS: true,
    removeComments: true,
    collapseWhitespace: true,
    removeEmptyAttributes: false,
    removeRedundantAttributes: false,
    processScripts: ["application/ld+json"]
};

let minSuffix = { suffix: ".min" };
let watchDelay = { delay: 500 };
let publicDest = 'public';
let webpackConfig = {
    mode: dev ? 'development' : 'production',
    devtool: dev ? "inline-cheap-source-map" : "source-map",
    output: { filename: 'app.min.js' }
};

// Streamlines Gulp Tasks
let stream = (_src, _opt = { pipes: [], dest: publicDest }, done) => {
    let host = src(_src, _opt.opts), _pipes = _opt.pipes || [], _dest = _opt.dest || publicDest;
    _pipes.forEach(val => { host = host.pipe(val); });
    host = host.pipe(dest(_dest)); // Output
    if (done) done();
    return host;
};

// Stringify
let stringify = obj => {
    let fns = [];
    let json = JSON.stringify(obj, (key, val) => {
        if (typeof val == "function") {
            fns.push(val.toString());
            return "_";
        }
        return val;
    }, 4);

    return json.replace(/\"_\"/g, () => fns.shift());
};

// Based on: [https://gist.github.com/millermedeiros/4724047]
let exec = (cmd, cb) => {
    var parts = cmd.split(/\s+/g);
    return spawn(parts[0], parts.slice(1), { stdio: 'inherit' })
        .on('data', data => process.stdout.write(data))
        .on('exit', code => {
            var err = null;
            if (code) {
                err = new Error('Command "'+ cmd +'" exited with wrong status code "'+ code +'"');
                err.code = code;
                err.cmd = cmd;
            }
            if (cb) { cb(err); }
        });
};

// Execute multiple commands in series
let execSeries = (cmds, cb) => {
    let arr = [];
    var execNext = () => {
        arr.push(
            exec(cmds.shift(), err => {
                if (err) { cb(err); }
                else {
                    if (cmds.length) execNext();
                    else cb(null);
                }
            })
        );
    };
    execNext();
    return arr;
};

task('html', done => {
    for (let i in pages) {
        stream('views/app.pug', {
            pipes: [
                // Rename
                rename({
                    basename: i,
                    extname: ".html"
                }),
                // Pug compiler
                pug({ locals: { ...pages[i], cloud_name } }),
                // Minify or Beautify html
                dev ? html({ indent_size: 4 }) : htmlmin(htmlMinOpts),
                // Replace /assets/... URLs
                replace(/\/assets\/[^\s\"\']+/g, url => {
                    let URLObj = new URL(`${assetURL + url}`.replace("/assets/", ""));
                    let query = URLObj.searchParams;
                    let queryString = URLObj.search;

                    let height = query.get("h");
                    let width = query.get("w") || 'auto';
                    let imgURLConfig = { ...imageURLConfig, width, height };

                    return staticSite ?
                            (/\/raw\/[^\s\"\']+/.test(url) ?
                                `${assetURL + url.replace(queryString, '')}` :
                                 assets.url(url.replace(queryString, ''), imgURLConfig)
                            ).replace("/assets/", "") : url;
                })
            ]
        });
    }
    done();
});

task("css", () =>
    stream('src/scss/app.scss', {
        pipes: [
            init(), // Sourcemaps init
            // Minify scss to css
            sass({ outputStyle: dev ? 'expanded' : 'compressed' }).on('error', sass.logError),
            // Autoprefix &  Remove unused CSS
            postcss(), // Rest of code is in postcss.config.js
            rename(minSuffix), // Rename
            write('.') // Put sourcemap in public folder
        ],
        dest: `${publicDest}/css` // Output
    })
);

task("js", () =>
    stream("src/js/app.js", {
        opts: { allowEmpty: true },
        pipes: [
            // Configure webpack sourcemaps
            webpackStream(webpackConfig, webpack),
            // Push sourcemap to sourcemap.init
            obj(function (file, enc, cb) {
                let isSourceMap = /\.map$/.test(file.path);
                if (!isSourceMap) this.push(file);
                cb();
            }),
            init({ loadMaps: true }), // Sourcemaps init
            babel(), // ES5 file for uglifing
            dev ? js({ indent_size: 4 }) : uglify(), // Minify or Beautify file
            write('.') // Put sourcemap in public folder
        ],
        dest: `${publicDest}/js` // Output
    })
);

task("server", () =>
    stream(["*.js", "!postcss.config.js", "!*.min.js", "!gulpfile.js", "!config.js", "!config-dev.js"], {
        opts: { allowEmpty: true },
        pipes: [
            babel(), // ES5 file for uglifing
            uglify(), // Minify the file
            rename(minSuffix) // Rename
        ],
        dest: '.' // Output
    })
);

task("config", () => (
    // Create config.min
    writeFile("./config.min.js", `module.exports = ${stringify(config)};`,
              err => { if (err) throw err; }),
    stream("config.min.js", {
        opts: { allowEmpty: true },
        pipes: [
            babel(), // ES5 file for uglifing
            uglify() // Minify the file
        ],
        dest: '.' // Output
    }),

    stream("config.min.js", {
        opts: { allowEmpty: true },
        pipes: [
            js({ indent_size: 4 }), // Beautify the file
            // Rename
            rename({
                basename: "config-dev",
                extname: ".js"
            })
        ],
        dest: '.' // Output
    })
));

task("config:watch", done => {
    exec("gulp config server html --gulpfile ./gulpfile.min.js", () => done());
});

task("update", () =>
    stream("gulpfile.js", {
        opts: { allowEmpty: true },
        pipes: [
            babel(), // ES5 file for uglifing
            uglify(), // Minify the file
            rename(minSuffix) // Rename
        ],
        dest: '.' // Output
    })
);

task("gulpfile:watch", done => {
    exec("gulp update", () => done());
});

task("git", done => {
    let gitCommand = [
        "git add .",
        "git commit -m 'Upgrade'",
        "git push -u origin master"
    ];

    execSeries(gitCommand, () => done());
});

// Gulp task to minify all files
task('default', parallel(series("update", "config", "server", "html", "css"), "js"));

// Gulp task to check to make sure a file has changed before minify that file files
task('watch', () => {
    watch(['config.js', 'containers/*.js'], watchDelay, series('config:watch'));
    watch(['gulpfile.js', 'postcss.config.js'], watchDelay, series('gulpfile:watch', 'server'));
    watch(['server.js', 'plugin.js'], watchDelay, series('server'));
    watch('views/**/*.pug', watchDelay, series('html', 'server'));
    watch('src/**/*.scss', watchDelay, series('css', 'server'));
    watch('src/**/*.js', watchDelay, series('js', 'server'));
});
