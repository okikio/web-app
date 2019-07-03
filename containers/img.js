let component = require("./component");
let _src = require("./src");
let _alt = require("./alt");

// Image component
module.exports = (src, alt) => component("img") (_src(src), _alt(alt));
