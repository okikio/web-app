const purgecss = require('@fullhuman/postcss-purgecss');
const flexibility = require('postcss-flexibility');
const { general } = require("./browserlist");
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        purgecss({
            content: ['public/**/*.html'],
            whitelistPatterns: [/-show$/, /-focus$/],
            keyframes: false,
            fontFace: false
        }),
        autoprefixer({
            overrideBrowserslist: general
        }),
        flexibility()
    ]
};
