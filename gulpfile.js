let { env } = process;
if (!('dev' in env)) require('dotenv').config();
let dev = 'dev' in env && env.dev.toString() == "true";
let debug = 'debug' in env && env.debug.toString() == "true";
let staticSite = 'staticSite' in env && env.staticSite == "true";

const gulp = require('gulp');
const { src, task, series, parallel, dest, watch } = gulp;

const nodeResolve = require('rollup-plugin-node-resolve');
const builtins = require("rollup-plugin-node-builtins");
const browserSync = require('browser-sync').create();
const { init, write } = require('gulp-sourcemaps');
const commonJS = require('rollup-plugin-commonjs');
const rollupBabel = require('rollup-plugin-babel');
const { stringify } = require('./util/stringify');
const rollupJSON = require("rollup-plugin-json");
const { babelConfig } = require("./browserlist");
const inlineSrc = require("gulp-inline-source");
const replace = require('gulp-string-replace');
const { html, js } = require('gulp-beautify');
const rollup = require('gulp-better-rollup');
const { spawn } = require('child_process');
const htmlmin = require('gulp-htmlmin');
const assets = require("cloudinary").v2;
const postcss = require('gulp-postcss');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const { writeFile } = require("fs");
const config = require('./config');
const sass = require('gulp-sass');
const pug = require('gulp-pug');

let { pages, cloud_name, imageURLConfig } = config;
let assetURL = `https://res.cloudinary.com/${cloud_name}/`;
assets.config({ cloud_name, secure: true });

let srcMapsWrite = debug ? ["../maps"] : ["../maps", {
    sourceMappingURL: file => {
        return `/maps/${file.relative}.map`;
    }
}];

let htmlMinOpts = {
    minifyJS: true,
    minifyCSS: true,
    removeComments: true,
    collapseWhitespace: true,
    removeEmptyAttributes: false,
    removeRedundantAttributes: false,
    processScripts: ["application/ld+json"]
};

let minifyOpts = { toplevel: !dev };
let minSuffix = { suffix: ".min" };
let watchDelay = { delay: 500 };
let publicDest = 'public';
let { assign } = Object;

// Streamline Gulp Tasks
let stream = (_src, _opt = { }, done) => {
    let _end = _opt.end || [];
    let host = src(_src, _opt.opts), _pipes = _opt.pipes || [], _dest = _opt.dest || publicDest;
    return new Promise((resolve, reject) => { 
        _pipes.forEach(val => { 
            if (val != undefined && val != null) 
                { host = host.pipe(val).on('error', reject); }
        });

        host = host.pipe(dest(_dest))
                   .on('end', typeof done == 'function' ? done : resolve); // Output  

        _end.forEach(val => { 
            if (val != undefined && val != null) 
                { host = host.pipe(val).on('error', reject); }
        });
    });
};

// A list of streams
let streamList = (...args) => {
    return Promise.all(
        (Array.isArray(args[0]) ? args[0] : args).map(_stream => 
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
        cmds.reduce((acc, cmd, i) => {
            if (cmd != null && cmd != undefined)
                acc[i] = typeof cmd == "string" ? _exec(cmd) : cmd;
            return acc;
        }, []) 
    );
};

task('html', () => {
    let pageNames = Object.keys(pages);
    let pageValues = Object.values(pages);
    return streamList(
        pageValues.map((page, i) => 
            ['views/app.pug', {
                pipes: [
                    // Rename
                    rename({
                        basename: pageNames[i],
                        extname: ".html"
                    }),
                    // Pug compiler
                    pug({ locals: { ...page, cloud_name, dev, staticSite } }),
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
            write(...srcMapsWrite) // Put sourcemap in public folder
        ],
        dest: `${publicDest}/css`, // Output
        end: [browserSync.stream()]
    })
);

task("js", () => 
    streamList([
        ...["modern"].concat(!dev ? "general" : [])
            .map(type => {
                let gen = type == 'general';
                let suffix = gen ? '' : '.modern';
                return ['src/js/app.js', {
                    opts: { allowEmpty: true },
                    pipes: [
                        init(), // Sourcemaps init
                        // Bundle Modules
                        rollup({
                            plugins: [
                                builtins(), // Access to builtin Modules
                                commonJS(), // Use CommonJS to compile the program
                                nodeResolve(), // Bundle all Modules
                                rollupJSON(), // Parse JSON Exports
                                rollupBabel(babelConfig[type]) // Babelify file for uglifing
                            ] 
                        }, gen ? 'umd' : 'es'),
                        // Minify the file
                        debug ? null : terser( 
                            assign(minifyOpts, gen ? { ie8: true, ecma: 5 } : {})
                        ),
                        rename(`app${suffix}.min.js`), // Rename
                        write(...srcMapsWrite) // Put sourcemap in public folder
                    ],
                    dest: `${publicDest}/js` // Output
                }];
            }),
            dev && staticSite ? null : ['src/js/app.vendor.js', {
            opts: { allowEmpty: true },
            pipes: [
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
                // Minify the file
                debug ? null : terser({ ...minifyOpts, ie8: true, ecma: 5 }), 
                rename(minSuffix), // Rename
                write(...srcMapsWrite) // Put sourcemap in public folder
            ],
            dest: `${publicDest}/js` // Output
        }]
    ])
);

task("server", () =>
    streamList([
        ["server.js", {
            opts: { allowEmpty: true },
            pipes: [
                // Bundle Modules
                rollup({
                    plugins: [
                        commonJS(), // Use CommonJS to compile file
                        rollupJSON(), // Parse JSON Exports
                        rollupBabel(babelConfig.node) // Babelify file for minifing
                    ] 
                }, 'cjs'),
                terser({ ...minifyOpts, ecma: 7 }), // Minify the file
                rename(minSuffix) // Rename
            ],
            dest: '.' // Output
        }]
    ])
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
                // Minify the file
                terser({ ...minifyOpts, ie8: true, ecma: 5 }), 
            ],
            dest: '.' // Output
        }],
        dev ? ["config.min.js", {
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
        }] : null
    )
);

task("config:watch", () => 
    _exec("gulp config html css")
);

task("update", () =>
    stream("gulpfile.js", {
        opts: { allowEmpty: true },
        pipes: [
            // Bundle Modules
            rollup({
                plugins: [ 
                    commonJS(), // Use CommonJS to compile file
                    rollupJSON(), // Parse JSON Exports
                    rollupBabel(babelConfig.node) // Babelify file for minifing
                ] 
            }, 'cjs'),
            debug ? null : terser({ ...minifyOpts, ecma: 7 }), // Minify the file
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
task('dev', series("config", parallel("server", "html", "js"), "css"));

// Gulp task to minify all files, and inline them in the pages
task('default', series("update", "dev", "inline"));

// Gulp task to minify all files without -js
task('other', series("update", "config", parallel("server", "html"), "css", "inline"));

// Gulp task to check to make sure a file has changed before minify that file files
task('watch', () => {
    browserSync.init({ server: "./public" });

    watch(['server.js', 'plugin.js'], watchDelay, series('server'));
    watch(['config.js', 'containers.js'], watchDelay, series('config:watch'))
        .on('change', browserSync.reload);
    watch(['gulpfile.js', 'postcss.config.js', 'util/*.js'], watchDelay, series('gulpfile:watch', 'css', 'js'))
        .on('change', browserSync.reload);

    watch('views/**/*.pug', watchDelay, series('html', 'css'));
    watch('src/**/*.scss', watchDelay, series('css'));
    watch(['src/**/*.js', '!src/**/app.vendor.js'], watchDelay, series('js'));
        
    watch('src/**/app.vendor.js', watchDelay, series('js'));
    watch(['public/**/*', '!public/css/*.css'])
        .on('change', browserSync.reload);
});