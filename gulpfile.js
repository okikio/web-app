let { env } = process;
if (!('dev' in env)) require('dotenv').config();
let dev = 'dev' in env && env.dev.toString() == "true";

const gulp = require('gulp');
const { src, task, series, parallel, dest, watch } = gulp;

const { babelConfig } = require(`./browserslist${dev ? '' : ".min"}`);
const nodeResolve = require('rollup-plugin-node-resolve');
const builtins = require("rollup-plugin-node-builtins");
const config = require(`./config${dev ? '' : ".min"}`);
const { init, write } = require('gulp-sourcemaps');
const commonJS = require('rollup-plugin-commonjs');
const rollupBabel = require('rollup-plugin-babel');
const rollupJSON = require("rollup-plugin-json");
const uglify = require('gulp-uglify-es').default;
const inlineSrc = require("gulp-inline-source");
const replace = require('gulp-string-replace');
const { html, js } = require('gulp-beautify');
const stringify = require(`./util/stringify`);
const rollup = require('gulp-better-rollup');
const { spawn } = require('child_process');
const htmlmin = require('gulp-htmlmin');
const assets = require("cloudinary").v2;
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const newer = require("gulp-newer");
const babel = require('gulp-babel');
const { writeFile } = require("fs");
const sass = require('gulp-sass');
const pug = require('gulp-pug');

let { pages, cloud_name, imageURLConfig } = config;
let staticSite = 'staticSite' in env && env.staticSite == "true";

let assetURL = `https://res.cloudinary.com/${cloud_name}/`;
assets.config({ cloud_name, secure: true });

let srcMapsWrite = '.';
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

// Streamlines Gulp Tasks
let stream = (_src, _opt = { }, done) => {
    let host = src(_src, _opt.opts), _pipes = _opt.pipes || [], _dest = _opt.dest || publicDest;
    return new Promise((resolve, reject) => { 
        _pipes.forEach(val => { host = host.pipe(val).on('error', reject); });
        host = host.pipe(dest(_dest))
                   .on('end', typeof done == 'function' ? done : resolve); // Output
    });
};

let streamList = (...args) => {
    return Promise.all(
        args.map(_stream => 
            Array.isArray(_stream) ? stream(..._stream) : _stream
        )
    );
}; 

// Based on: [https://gist.github.com/millermedeiros/4724047]
let _exec = cmd => {
    var parts = cmd.toString().split(/\s+/g);
    return new Promise((resolve = () => {}) => {
        spawn(parts[0], parts.slice(1), { shell: true, stdio: 'inherit' })
            .on('data', data => process.stdout.write(data))
            .on('error', err => console.error(err))
            .on('close', () => (resolve || function () {}) ());
    });
};

// Execute multiple commands in series
let _execSeries = (...cmds) => {
    return Promise.all(
        cmds.map(cmd => typeof cmd == "string" ? _exec(cmd) : cmd) 
    );
};

task('html', () => {
    let pageNames = Object.keys(pages);
    let pageValues = Object.values(pages);
    return streamList(
        ...pageValues.map((page, i) => 
            ['views/app.pug', {
                pipes: [
                    // Rename
                    rename({
                        basename: pageNames[i],
                        extname: ".html"
                    }),
                    // Pug compiler
                    pug({ locals: { ...page, cloud_name } }),
                    // Minify or Beautify html
                    dev ? html({ indent_size: 4 }) : htmlmin(htmlMinOpts),
                    // Replace /assets/... URLs
                    replace(/\/assets\/[^\s"']+/g, url => {
                        let URLObj = new URL(`${assetURL + url}`.replace("/assets/", ""));
                        let query = URLObj.searchParams;
                        let queryString = URLObj.search;

                        let height = query.get("h");
                        let width = query.get("w") || 'auto';
                        let imgURLConfig = { ...imageURLConfig, width, height };

                        return staticSite ?
                                (/\/raw\/[^\s"']+/.test(url) ?
                                    `${assetURL + url.replace(queryString, '')}` :
                                    assets.url(url.replace(queryString, ''), imgURLConfig)
                                ).replace("/assets/", "") : url;
                    })
                ]
            }]
        )
    );
});

task("css", () =>
    stream('src/scss/*.scss', {
        pipes: [
            init(), // Sourcemaps init
            // Minify scss to css
            sass({ outputStyle: dev ? 'expanded' : 'compressed' }).on('error', sass.logError),
            // Autoprefix &  Remove unused CSS
            postcss(), // Rest of code is in postcss.config.js
            rename(minSuffix), // Rename
            write(srcMapsWrite) // Put sourcemap in public folder
        ],
        dest: `${publicDest}/css` // Output
    })
);

task("js", () => 
    streamList(...[
        ...["modern"].concat(!dev ? "general" : []).map(type => [
            ['src/js/app.js', {
                opts: { allowEmpty: true },
                pipes: [
                    // Only update when there is something to update
                    newer(`${publicDest}/js/app${type == 'general' ? '' : '.modern'}.min.js`),
                    init(), // Sourcemaps init
                    // Bundle Modules
                    rollup({
                        plugins: [
                            builtins(), // Access to builtin Modules
                            commonJS(), // Use CommonJS to compile the program
                            nodeResolve(), // Bundle all Modules
                            rollupJSON(), // Parse JSON Exports
                            rollupBabel(babelConfig[type]) // ES5 file for uglifing
                        ] 
                    }, type == 'general' ? 'umd' : 'es'),
                    dev ? js() : uglify(), // Minify the file
                    rename(`app${type == 'general' ? '' : '.modern'}.min.js`), // Rename
                    write(srcMapsWrite) // Put sourcemap in public folder
                ],
                dest: `${publicDest}/js` // Output
            }]
        ]).flat(),
        ['src/js/app.vendor.js', {
            opts: { allowEmpty: true },
            pipes: [
                // Only update when there is something to update
                newer(`${publicDest}/js/app.vendor.min.js`),
                init(), // Sourcemaps init
                // Bundle Modules
                rollup({
                    plugins: [
                        builtins(), // Access to builtin Modules
                        commonJS(), // Use CommonJS to compile the program
                        nodeResolve(), // Bundle all Modules
                        rollupJSON(), // Ability to Parse JSON
                        rollupBabel(babelConfig.node) // ES5 file for uglifing
                    ] 
                }, 'umd'),
                dev ? js() : uglify(), // Minify the file
                rename(minSuffix), // Rename
                write(srcMapsWrite) // Put sourcemap in public folder
            ],
            dest: `${publicDest}/js` // Output
        }]
    ])
);

task("util", () =>
    stream(["util/*.js", "!util/*.min.js"], {
        opts: { allowEmpty: true },
        pipes: [
            // Only update when there is something to update
            newer(`./*.min.js`),
            babel(babelConfig.node), // ES5 file for uglifing
            uglify(), // Minify the file
            rename(minSuffix) // Rename
        ],
        dest: '.' // Output
    })
);

task("server", () =>
    stream(["*.js", "!postcss.config.js", "!*.min.js", "!gulpfile.js", "!config.js", "!config-dev.js"], {
        opts: { allowEmpty: true },
        pipes: [
            // Only update when there is something to update
            newer(`./*.min.js`),
            babel(babelConfig.node), // ES5 file for uglifing
            uglify(), // Minify the file
            rename(minSuffix) // Rename
        ],
        dest: '.' // Output
    })
);

task("config", () =>
    streamList(
        new Promise((resolve, reject) => {
            // Create config.min
            writeFile(
                "./config.min.js", `module.exports = ${stringify(config)};`,
                err => { 
                    if (err) { reject(); throw err; }
                    resolve(); 
                }
            );
        }),
        ["config.min.js", {
            opts: { allowEmpty: true },
            pipes: [
                // Only update when there is something to update
                newer(`./config.min.js`),
                babel(babelConfig.node), // ES5 file for uglifing
                uglify() // Minify the file
            ],
            dest: '.' // Output
        }],
        ["config.min.js", {
            opts: { allowEmpty: true },
            pipes: [
                // Only update when there is something to update
                newer(`./config-dev.js`),
                js({ indent_size: 4 }), // Beautify the file
                // Rename
                rename({
                    basename: "config-dev",
                    extname: ".js"
                })
            ],
            dest: '.' // Output
        }]
    )
);

task("config:watch", () => 
    _exec("gulp config server html --gulpfile ./gulpfile.min.js")
);

task("update", () =>
    stream("gulpfile.js", {
        opts: { allowEmpty: true },
        pipes: [
            // Only update when there is something to update
            newer(`./gulpfile.min.js`),
            babel(babelConfig.node), // ES5 file for uglifing
            uglify(), // Minify the file
            rename(minSuffix) // Rename
        ],
        dest: '.' // Output
    })
);

task("gulpfile:watch", () =>
    _execSeries("gulp update", "gulp")
);

task("git", () =>
    _execSeries(
        "git add .",
        "git commit -m 'Upgrade'",
        "git push -u origin master"
    )
);

task('inline', () =>
    stream('public/*.html', {
        pipes: [
            // Inline external sources
            inlineSrc({ compress: false })
        ]
    })
);

// Gulp task to minify all files
task('default', series("util", "update", "config", parallel("server", "html", "js"), "css", "inline"));

// Gulp task to minify all files without -js
task('other', series("util", "update", "config", parallel("server", "html"), "css", "inline"));

// Gulp task to check to make sure a file has changed before minify that file files
task('watch', () => {
    watch(['config.js', 'containers/*.js'], watchDelay, series('config:watch'));
    watch(['gulpfile.js', 'postcss.config.js', 'util/*.js', '!util/*.min.js'], watchDelay, series('util', 'gulpfile:watch', 'server'));
    watch(['server.js', 'plugin.js'], watchDelay, series('server'));
    watch('views/**/*.pug', watchDelay, series('html', 'server', 'css', 'inline'));
    watch('src/**/*.scss', watchDelay, series('css', 'server', 'inline'));
    watch('src/**/*.js', watchDelay, series('js', 'server', 'inline'));
});