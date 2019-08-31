let { attr, section, _img, background, _tile, _col, _style, _layer, _layout, _header, _main, values, title, row, page, padding, margin, _link, layout, layer, _hero, font, _content, color, col, _class } = require('./containers');
let carImg = "/assets/white_car.webp?w=970&h=566";

let _name = attr("name", "index");
let noFooter = attr("noFooter", true);
let newFooter = (value = "2019 Okiki Ojo") => layer([
    _class([ "footer" ]),
    layout([
        section([
            _class([ padding(), _style("center", "spaceout-small"), font("weight-bold", "title") ]),
            values([ value ]),
        ])
    ])
]);

let indent = _content(" ", [
    padding("top"), margin("left-large"),
    _layout("inline-block")
]);

let spacingColumns = size => col([
    _class([ _layout("block"), _col(size.toString()) ])
]);

module.exports = {
    "websiteURL": "https://app-fast.herokuapp.com/",
    "cloud_name": "okikio-assets",
    "imageURLConfig": {
        "fetch_format": "auto",
        "client_hints": true,
        // "flags": "lossy",
        "crop": "scale",
        "quality": 30,
        "dpr": "auto"
    },
    "pages": {
        "404": page([
            _name("404"),
            title("Ooops!"),
            values([
                // Intro layer
                layer([
                    _class([ padding("horz", "large-top") ]),
                    layout([
                        _class([ _layout("shorten", "contain") ]),
                        values([
                            _header(title("404, Page Not Found.")),
                            _main([
                                _class([ _style("center") ]),
                                values([
                                    indent,
                                    `Sorry, the page you are looking for doesn't exist. How about going back `,
                                    _link("home", "/"), "."
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Intro Layer

                // Footer
                newFooter()
            ]),
            noFooter()
        ]),
        "projects": page([
            _name("projects"),
            title("Projects"),
            values([
                // Hero Layer
                _hero([ "Projects.", ["/assets/blue-sky.webp?w=970&h=566", "A city Image"] ]),
                // End Hero Layer

                // Intro layer
                layer([
                    _class([ padding("horz", "large-top") ]),
                    layout([
                        _class([ _layout("shorten", "contain") ]),
                        values([
                            _header(title("Lorem itpsuim")),
                            _main([
                                values([
                                    indent,
                                    `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                        It was popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, `,
                                    _link("home", "/")
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Intro Layer

                // Footer
                newFooter()
            ]),
            noFooter()
        ]),
        "about": page([
            _name("about"),
            title("The Sub Page"),
            values([
                // Hero Layer
                _hero([ "Subpage.", ["/assets/white-flower.webp?w=970&h=566", "A city Image"] ]),
                // End Hero Layer

                // Intro layer
                layer([
                    _class([ padding("horz", "large-top") ]),
                    layout([
                        _class([ _layout("shorten", "contain") ]),
                        values([
                            _header(title("Lorem itpsuim")),
                            _main([
                                values([
                                    indent,
                                    `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                        It was popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, `,
                                    _link("home", "/")
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Intro Layer

                // Footer
                newFooter()
            ]),
            noFooter()
        ]),
        "index": page([
            _name(),
            title("Hello There"),
            values([
                // Hero layer
                _hero([ "Relax.", [carImg, "A city Image"] ]),
                // End Hero layer

                // Intro layer
                layer([
                    _class([ padding("horz", "large-top") ]),
                    layout([
                        _class([ _layout("shorten", "contain") ]),
                        values([
                            _header(title("Lorem itpsuim")),
                            _main([
                                values([
                                    indent,
                                    `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                        It was popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, `,
                                    _link("run", "/about")
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Intro layer

                // Listings layer
                layer([
                    layout([
                        _class([ padding("horz", "large-top") ]),
                        section([
                            _class([ _layout("shorten", "contain") ]),
                            values([
                                _header(title("Listings")),
                                _main([
                                    _class([ padding("top"), _style("line-height-double") ]),
                                    values([
                                        row([
                                            values([
                                                col([
                                                    _class([ _col("2"), padding("bottom-small") ]),
                                                    values([
                                                        _content(`03/03`, [ _style("bold"), font("16") ])
                                                    ])
                                                ]),

                                                col([
                                                    _class([ _col("3"), padding("bottom") ]),
                                                    values([
                                                        _content(`2018`, [
                                                            _style("line-height-double", "bold"),
                                                            _layout("block"), font("16")
                                                        ]),
                                                        _content(`E-commerse`, [
                                                            _style("line-height-double"),
                                                            _layout("block"),
                                                            font("16")
                                                        ]),
                                                        _content(`Design Executive`, [
                                                            _style("line-height-double"),
                                                            _layout("block"), font("16")
                                                        ])
                                                    ])
                                                ]),

                                                col([
                                                    _class([ _col("7") ]),
                                                    values([
                                                        _content(`Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                                                        unknown printer took a galley of type and scrambled it to make a type specimen book.`,
                                                        [ _style("line-height-double"), font("16") ])
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Listings layer

                // Banner layer 1
                layer([
                    layout([
                        _class([
                            padding("horz", "vert-large"),
                            _layout("contain-large")
                        ]),
                        values([
                            _header([
                                title(""),
                                _class([ _layout("vert"), _style("bold-font", "500"), "h2" ]),
                                values([
                                    `Got your attention.`, ` `,
                                    _content(`Good!`, [ color("primary") ])
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Banner layer 1

                // Banner layer 2
                layer([
                    _class([ background("primary") ]),
                    layout([
                        _class([ _layout("contain-large", "enlarge-vert") ]),
                        values([
                            _header([
                                title(""),
                                _class([ _layout("vert"), _style("bold-font", "500"), "h2", color("white") ]),
                                values([
                                    `Got your attention.`, ` `,
                                    _content(`Good!`, [ color("tertiary") ])
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Banner layer 2

                // Banner layer 3
                layer([
                    _class([ background("secondary") ]),
                    layout([
                        _class([ _layout("contain-large", "enlarge-vert") ]),
                        values([
                            _header([
                                title(""),
                                _class([ _layout("vert"), _style("bold-font", "500"), "h2", color("white") ]),
                                values([
                                    `Got your attention.`, ` `,
                                    _content(`Good!`, [ color("tertiary") ])
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Banner layer 3

                // Banner layer 4
                layer([
                    _class([ background("tertiary") ]),
                    layout([
                        _class([ _layout("contain-large", "enlarge-vert") ]),
                        values([
                            _header([
                                title(""),
                                _class([ _layout("vert"), _style("bold-font", "500"), "h2", color("dark") ]),
                                values([
                                    `Got your attention.`, ` `,
                                    _content(`Good!`, [ color("secondary") ])
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Banner layer 4

                // Breakthrough layer
                layer([
                    layout([
                        _class([
                            _layout("contain-large"),
                            padding("horz", "large")
                        ]),
                        values([
                            _main([
                                _class([ _layout("vert") ]),
                                values([
                                    row([
                                        values([
                                            col([
                                                _class([ _col("6"), padding("bottom-small", "right-large") ]),
                                                values([
                                                    _content(`Breakthrough<br>Limits!`, [
                                                        _style("bold", "line-height"),
                                                        "h3", color("primary")
                                                    ])
                                                ])
                                            ]),

                                            col([
                                                _class( _col("6") ),
                                                values([
                                                    _content(`Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                                                        unknown printer took a galley of type and scrambled it to make a type specimen book.`,
                                                        [ _layout("block"), _style("line-height-double"), font("16") ])
                                                ])
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Breakthrough layer

                // Image Column layer
                layer([
                    layout([
                        _class([ _layout("contain-large") ]),
                        values([
                            _main([
                                _class([ _layout("shorten-vert") ]),
                                values([
                                    row([
                                        _class([ margin("dull") ]),
                                        values([
                                            spacingColumns(3),

                                            col([
                                                _class([ _col("9"), padding("small") ]),
                                                values([
                                                    _tile([ "", "",
                                                        _class([
                                                            _layer("box", "surface", "shadow--1"),
                                                            _layout("block")
                                                        ])
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ]),

                                    row([
                                        _class([ margin("dull") ]),
                                        values([
                                            col([
                                                _class([ _col("9"), padding("small", "vert-large") ]),
                                                values([
                                                    _tile([
                                                        "Google Designs", "",
                                                        _img("/assets/city.webp?w=250", "City Alt"),
                                                        _class([
                                                            _layer("box", "surface", "shadow--1"),
                                                            _layout("block")
                                                        ])
                                                    ])
                                                ])
                                            ]),

                                            spacingColumns(3),
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Image Column layer

                // Image Banner layer
                layer([
                    layout([
                        _class([]),
                        values([
                            _main([
                                values([
                                    row([
                                        _class([ margin("dull") ]),
                                        values([
                                            col([
                                                _class([ _col("12"), padding("dull") ]),
                                                values([
                                                    _tile([ "", "",
                                                        _class([
                                                            _layer("box", "box-flat", "box-tall", "surface", "shadow--2"),
                                                            _layout("block")
                                                        ])
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ]),
                                ])
                            ])
                        ])
                    ])
                ]),
                // End Image Banner layer

                // Footer
                // newFooter(),

                // Next Page layer
                layer([
                    _class([ background("black") ]),
                    layout([
                        _class([ _layout("contain"), padding("horz", "top") ]),
                        values([
                            section([
                                _class([ "h4", _layout("shorten") ]),
                                values([
                                    _header([
                                        title("Next"),
                                        _class([ color("white"), font("light", "thin"), _style("spaceout") ])
                                    ]),
                                    _main([
                                        _class([ _style("center"), padding("vert") ]),
                                        values([
                                            _content(`NASA Rocket Ship`, [ "h1", _style("bold", "primary") ]),
                                        ])
                                    ])

                                ])
                            ]),
                            section([
                                _class([
                                    _layer("box", "box-flat", "surface", "shadow"),
                                    _layout("block")
                                ])
                            ])

                        ])
                    ])
                ]),
                // End Next Page layer
            ]), noFooter()
        ])
    },
    "routes": {
        "/": "index",
        "/about": "about"
    },
    "social_links": [
        {
            "name": [
                "Twitter",
                "Tw"
            ],
            "href": "https://twitter.com/okikio_dev"
        },
        {
            "name": [
                "Instagram",
                "In"
            ],
            "href": "https://www.instagram.com/okikio.dev/"
        },
        {
            "name": [
                "Github",
                "Git"
            ],
            "href": "https://github.com/okikio"
        },
        {
            "name": [
                "LinkedIn",
                "Lk"
            ],
            "href": "https://www.linkedin.com/in/okiki-o-a5287213b"
        },
        {
            "name": [
                "Mail",
                "@"
            ],
            "href": "mailto:okikio.dev@gmail.com"
        }
    ],
    "projects": [
        {
            "name": "Leader",
            "url": "leader",
            "detail": "Lorem itpsim",
            "info": "The nature of leadership",
            "img": {
                "src": "/assets/white-flower.jpg",
                "alt": ""
            }
        },
        {
            "name": "Science",
            "url": "science",
            "detail": "Lorem itpsim",
            "info": "Info about Leukemia",
            "img": {
                "src": "/assets/city.jpg",
                "alt": ""
            }
        },
        {
            "name": "Civics",
            "url": "civics",
            "detail": "Lorem itpsim",
            "info": "A little about renewable sources of energy",
            "img": {
                "src": "/assets/blue-sky.jpg",
                "alt": ""
            }
        }
    ]
};