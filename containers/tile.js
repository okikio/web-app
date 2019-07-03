let component = require("./component");
let _title = require("./title");
let _src = require("./src");
let _alt = require("./alt");

// Tile layer component
module.exports = (title, src, alt) => component("title") (_title(title), _src(src), _alt(alt));
