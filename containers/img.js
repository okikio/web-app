let component = require("./component");
let _src = require("./src");
let _alt = require("./alt");

// Image component
module.exports = (src = "/assets/blue-sky.jpg", alt = "A city Image") => component("img") (_src(src), _alt(alt));
