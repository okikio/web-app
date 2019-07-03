let component = require("./component");
let _title = require("./title");
let _src = require("./src");
let _alt = require("./alt");

// Hero layer component
module.exports = (title, src, alt) => component("hero") (_title(title), _src(src), _alt(alt));
