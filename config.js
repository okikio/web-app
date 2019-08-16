let { _tile, _col, _style, _layer, _layout, _header, _main, values, title, row, page, padding, margin, _link, layout, layer, _img, _hero, font, _content, color, col, _class } = require('./containers');
let carImg = "/assets/white_car.webp?w=400&h=400";

let indent = _content(" ", [
    padding("top"), margin("left-large"),
    _layout("inline-block")
]);

let spacingColumns = size => col([
    _class( _layout("block"), _col(size.toString()) )
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
        "about": page([
            title("The Sub Page"),
            values([
                // Hero Layer
                _hero([ "Subpage.", [carImg, "A city Image"] ]),
                // End Hero Layer

                // Intro layer
                layer([
                    _class( padding("horz", "large-top") ),
                    layout([
                        _class("layout-shorten"),
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
                ])
                // End Intro Layer
            ])
        ]),
        "index": page([
            title("Hello There"),
            values([
                // Hero Layer
                _hero([ "Relax.", [carImg, "A city Image"] ]),
                // End Hero Layer

                // Intro layer
                layer([
                    _class( padding("horz", "large-top") ),
                    layout([
                        _class("layout-shorten"),
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
                // End Intro Layer

                // Listings layer
                layer([
                    _class( padding("horz", "large-top") ),
                    layout([
                        _class( _layout("shorten") ),
                        values([
                            _header(title("Listings")),
                            _main([
                                _class(
                                    padding("top"),
                                    _style("line-height-double")
                                ),
                                values([
                                    row([
                                        values([
                                            col([
                                                _class( _col("2"), padding("bottom-small") ),
                                                values([
                                                    _content(`03/03`, [ _style("bold"), font("16") ])
                                                ])
                                            ]),
                                            
                                            col([
                                                _class( _col("3"), padding("bottom") ),
                                                values([
                                                    _content(`2018`, [
                                                        _style("line-height-double"), _style("bold"),
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
                                                _class( _col("7") ),
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
                ]),
                // End Listings Layer
                
                // Breakthrough layer
                layer([
                    layout([
                        _class(
                            _layout("contain-large"),
                            padding("horz", "large")
                        ),
                        values([
                            _main([
                                _class( _layout("vert") ),
                                values([
                                    row([
                                        values([
                                            col([
                                                _class( _col("6"), padding("bottom-small", "right-large") ),
                                                values([
                                                    _content(`Breakthrough<br>Limits!`, [
                                                        _style("bold"), _style("line-height"),
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
                // End Breakthrough Layer

                // Image Column layer
                layer([
                    layout([
                        _class( _layout("contain-large") ),
                        values([
                            _main([
                                _class( _layout("shorten-vert") ),
                                values([
                                    row([
                                        _class( margin("dull") ),
                                        values([
                                            spacingColumns(3),

                                            col([
                                                _class( _col("9"), padding("small") ),
                                                values([
                                                    _content(` `, [ 
                                                        _layout("block"), _layer("box"), 
                                                        _layer("surface"), _layer("shadow--1") 
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ]),

                                    row([
                                        _class( margin("dull") ),
                                        values([
                                            col([
                                                _class( _col("9"), padding("small", "vert-large") ),
                                                values([
                                                    _tile([
                                                        "Google Designs", 
                                                        ["/assets/city.webp?w=250", "City Alt"],
                                                        "",
                                                        _class([
                                                            _layout("block"), _layer("box"), 
                                                            _layer("secondary"), _layer("shadow--1")
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
                ])
                // End Image Column Layer
            ])
        ]) 
    },
    "routes": {
        "/": "index",
        "/about": "about",
        "/run": "run"
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