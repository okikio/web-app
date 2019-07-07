let component = require("./component");
let _values = require("./values");
let _link = require("./link");

// Tabs component
module.exports = (...args) => component("tabs") (
    _values(...args.map(val => {
        return _link(val.toUpperCase(), `/${val}`);
    }))
);