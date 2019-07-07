let background = require("./background");
let font_size = require("./font-size");
let component = require("./component");
let class_add = require("./class-add");
let padding = require("./padding");
let content = require("./content");
let section = require("./section");
let margin = require("./margin");
let values = require("./values");
let layout = require("./layout");
let _class = require("./class");
let layer = require("./layer");
let color = require("./color");
let title = require("./title");
let tile = require("./tile");
let tabs = require("./tabs");
let href = require("./href");
let hero = require("./hero");
let attr = require("./attr");
let link = require("./link");
let src = require("./src");
let row = require("./row");
let img = require("./img");
let alt = require("./alt");
let col = require("./col");
let { assign } = Object;

// Shared similarites between page containers
let page = (...args) => {
    let defaults = [title("Page"), tabs("about", "projects", "contact")];
    return assign(assign(...defaults), ...args);
};

assign(page, { values, title, tile, tabs, src, section, row, page, padding, margin, link, layout, layer, img, href, hero, font_size, content, component, color, col, _class, class_add, background, attr, alt });
module.exports = page;