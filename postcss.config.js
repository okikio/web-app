const purgecss = require('@fullhuman/postcss-purgecss');
const { general } = require("./browserlist");
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        purgecss({
            content: ['public/**/*.html'],
            keyframes: false,
            fontFace: false
        }),
        autoprefixer({
            overrideBrowserslist: general
        })
    ]
};