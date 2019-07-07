let attr = require("./attr");

// Class attribute container
module.exports = (...args) => attr("class", "") (args.join(' '));
