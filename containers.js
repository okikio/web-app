let { env } = process;
if (!('dev' in env)) require('dotenv').config();
let dev = 'dev' in env && env.dev.toString() == "true";
let staticSite = 'staticSite' in env && env.staticSite == "true";

let pick = require('./util/pick');
let { isArray } = Array;
let { assign } = Object;

// Allows the use of the first argument if it is an Array
let anyArgs = args => isArray(args[0]) ? args[0] : args;

// Attributes for components
let attr = (attr, defaults, list) => (...vals) => {
    let val = list ? anyArgs(vals) : vals[0];
    return { [attr]: pick(val, defaults) };
};

// Class attribute container
let _class = (...args) => attr("class", "") (args.join(' '));

// The base for containers that add to the class attribute
let class_add = prefix => (...args) => {
    return args.length ? anyArgs(args).map(val => `${prefix}-${val}`).join(' ') : prefix;
};

// The base component layer and layout inherit from, allows for components as children
let component = type => (...props) => (
    { [type]: assign({}, ...anyArgs(props)) }
);

// -- Classes --
let font = class_add("style-font"); // Font of a component
let color = class_add("style-color"); // Color of a component
let margin = class_add("layout-margin"); // Margins of a component
let padding = class_add("layout-padding"); // Paddings of a component
let background = class_add("layer-color"); // Background of a component

// -- Attributes --
let href = attr("href", "/"); // Href attribute
let title = attr("title", "Title"); // Title attribute
let content = attr("content", "..."); // Content of a component
let values = attr("values", [], true); // The values property
let src = attr("src", "/assets/city.webp"); // Src attribute container
let alt = attr("alt", "An iamge of a bustling city."); // Alt attribute container

// -- Components --
let link = component("a"); // Link component
let img = component("img"); // Image component
let row = component("row"); // Row component
let col = component("col"); // Column component
let tabs = component("tabs"); // Tabs component
let tile = component("tile"); // Tile layer component
let hero = component("hero"); // Hero layer component
let layer = component("layer"); // The layer component has access to the various styles available
let layout = component("layout"); // The layout component has access to the various layouts available
let section = component("section"); // The section component

// -- Shortform Components --
let _link = (_content, _href) => link([
    href(_href + (dev && staticSite ? ".html" : (_href == "/" ? "index.html" : ""))), content(_content)
]);

let _tabs = (...args) => tabs([
    values(
        ...anyArgs(args).map(val => _link(val.toUpperCase(), `/${val}`))
    )
]);

let _tile = (_title, _src, _alt) => tile([
    title(_title), src(_src), alt(_alt)
]);

let _img = (_src = src().src, _alt = alt().alt) => img(src(_src), alt(_alt));

let _hero = (...args) => hero([
    title("Page"), _img(),
    ...anyArgs(args)
]);

/*
    -- Rules --
    General rules to use the containers.

    Containers are functions that return JSON Objects, these combine together to make a huge JSON Object tree. 
    Pug takes the JSON and renders it for each page of the site allowing for granular control.
    Containers are used in the `./config.js` file, along with other info. to create pages.
    Container functions support Arrays as well as Arguments.

    There are 3 major type of containers:
    * Components
    * Attributes
    * Class Attributes
    
    ---

    - Components represent HTML elements, sections, layers, etc...
    - Attributes give a component basic data to use to be display, or to be used in displaying a component, eg. img (it requires src, and href attributes).
    - Class Attributes are specific attributes that give a component its style, font, color, etc...


    -- Beware --
    Many components require certain components be bundled together to work properly.
    * class_add(...) only work in _class(...) functions 
        eg. layer(
            ...,
            _class([
                padding(["horz", "vert", ...]), // Returns "layout-padding-horz layout-padding-vert ..."
                class_add("layout-margin") ("horz", "vert", ...), // Returns "layout-margin-horz layout-margin-vert ...", the same as `margin(...)`
                "random-string-property-class"
            ])
        )

    * tabs(...) requires the link(...) function
        eg. layer(
            ...,
            _class([
                padding("horz", "vert", ...), // Returns "layout-padding-horz layout-padding-vert ..."
                class_add("layout-margin") ("horz", "vert", ...), // Returns "layout-margin-horz layout-margin-vert ...", the same as `margin(...)`
                "random-string-property-class"
            ])
        )
*/

// Shared similarites between page containers
let page = (...args) => {
    let defaults = [title("Page"), _tabs("about", "projects", "contact")];
    return assign(assign(...defaults), ...anyArgs(args));
};

assign(page, { _link, _tabs, _tile, _img, _hero, values, title, tile, tabs, src, section, row, page, padding, margin, link, layout, layer, img, href, hero, font, content, component, color, col, _class, class_add, background, attr, alt });
module.exports = page;