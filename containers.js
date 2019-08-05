let { env } = process;
if (!('dev' in env)) require('dotenv').config();
let dev = 'dev' in env && env.dev.toString() == "true";

let pick = require(`../util/pick${dev ? '' : ".min"}`);
let { assign } = Object;

// The base for containers that add to the class attribute
let class_add = prefix => (...args) => {
    return args.length ? args.map(val => `${prefix}-${val}`).join(' ') : prefix;
};

// Attributes for components
let attr = (attr, defaults, list) => (...vals) => {
    let val = list ? vals : vals[0];
    return { [attr]: pick(val, defaults) };
};

// Class attribute container
let _class = (...args) => attr("class", "") (args.join(' '));

// The base component layer and layout inherit from, allows for components as children
let component = type => (...props) => (
    { [type]: assign({}, ...props) }
);

// -- Classes --
let font = class_add("style-font"); // Font of a component
let margin = class_add("layout-margin"); // Margins of a component
let padding = class_add("layout-padding"); // Paddings of a component
let background = class_add("layer-color"); // Background of a component

// -- Attributes --
let title = attr("title", "Title"); // Title attribute
let content = attr("content", "..."); // Content of a component
let values = attr("values", [], true); // The values property
let src = attr("src", "/assets/city.webp"); // Src attribute container
let alt = attr("alt", "An iamge of a bustling city."); // Alt attribute container

// -- Components --
let layer = component("layer"); // The layer component has access to the various styles available
let layout = component("layout"); // The layout component has access to the various layouts available
let section = component("section"); // The section component


// Color of a component
let color = class_add("style-color");

// Tile layer component
let tile = (_title, _src, _alt) => component("tile") (title(_title), src(_src), alt(_alt));let _link = require("./link");

// Href attribute
let href = attr("href", "/");

// Link component
let link = (_content, _href) => component("a") (href(_href), content(_content));

// Tabs component
let tabs = (...args) => component("tabs") (
    values(...args.map(val => {
        return link(val.toUpperCase(), `/${val}`);
    }))
);


let hero = component("hero"); // Hero layer component
let row = component("row"); // Row component
let col = component("col"); // Column component

// Image component
let img = (_src = "/assets/city.webp", _alt = "A city Image") => component("img") (src(_src), alt(_alt));


// Shared similarites between page containers
let page = (...args) => {
    let defaults = [title("Page"), tabs("about", "projects", "contact")];
    return assign(assign(...defaults), ...args);
};

assign(page, { values, title, tile, tabs, src, section, row, page, padding, margin, link, layout, layer, img, href, hero, font, content, component, color, col, _class, class_add, background, attr, alt });
module.exports = page;