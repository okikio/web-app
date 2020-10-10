const purgecss = require('@fullhuman/postcss-purgecss');
const flexibility = require('postcss-flexibility');
const { general } = require("./browserlist");
const autoprefixer = require('autoprefixer');
const csso = require("postcss-csso");

module.exports = {
    plugins: [
        purgecss({
            content: ['docs/**/*.html'],
            whitelistPatterns: [/-show$/, /-focus$/],
            keyframes: false,
            fontFace: false
        }),
        autoprefixer({
            overrideBrowserslist: general
        }),
        flexibility(),
        csso()
    ]
};
