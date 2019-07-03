let component = require("./component");
let _content = require("./content");
let _href = require("./href");

// Link component
module.exports = (content, href) => component("a") (_href(href), _content(content));
