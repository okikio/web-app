let { values, title, _tile, _tabs, src, section, row, page, padding, margin, _link, layout, layer, _img, href, hero, _hero, font, content, color, col, _class, background, alt } = require('./containers');
let carImg = "/assets/white_car.webp?w=400&h=400";
let { assign } = Object;

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
                layer([
                    hero([
                        _img(carImg, "A city Image"),
                        title("Subpage.")
                    ])
                ]),
                // End Hero Layer

                // Intro layer
                layer([
                    _class(
                        padding("horz", "large-top")
                    ),
                    layout([
                        _class("layout-shorten"),
                        values(
                            section(
                                title("Lorem itpsuim"),
                                values(
                                    assign(
                                        content(" "),
                                        _class(
                                            padding("top"),
                                            margin("left-large"),
                                            "layout-inline-block"
                                        )
                                    ),
                                    content(`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                        It was popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, `),
                                    _link("home", "/")
                                )
                            )
                        )
                    ])
                ])
                // End Intro Layer
            ])
        ]),
        "index": page(
            title("Hello There"),
            values(
                // Hero Layer
                layer(
                    hero(
                        _img(carImg, "A city Image"),
                        title("Relax.")
                    )
                ),
                // End Hero Layer

                // Intro layer
                layer(
                    _class(
                        padding("horz", "large-top")
                    ),
                    layout(
                        _class("layout-shorten"),
                        values(
                            section(
                                title("Lorem itpsuim"),
                                values(
                                    assign(
                                        content(" "),
                                        _class(
                                            padding("top"),
                                            margin("left-large"),
                                            "layout-inline-block"
                                        )
                                    ),
                                    content(`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                                        It was popularised in the 1960s with the release of Letraset sheets
                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, `),
                                    _link("run", "/about")
                                )
                            )
                        )
                    )
                ),
                // End Intro Layer

                // Listings layer
                layer(
                    _class(
                        padding("horz", "large-top")
                    ),
                    layout(
                        _class("layout-shorten"),
                        values(
                            section(
                                title("Listings"),
                                _class(
                                    padding("top"),
                                    "style-line-height-double"
                                ),
                                values(
                                    row(
                                        values(
                                            col(
                                                _class(
                                                    "layout-col-2",
                                                    padding("bottom-small")
                                                ),
                                                values(
                                                    assign(
                                                        content(`03/03`),
                                                        _class(
                                                            "style-bold",
                                                            font("16")
                                                        )
                                                    )
                                                )
                                            ),

                                            col(
                                                _class(
                                                    "layout-col-3",
                                                    padding("bottom")
                                                ),
                                                values(
                                                    assign(
                                                        content(`2018`),
                                                        _class(
                                                            "style-line-height-double",
                                                            "style-bold",
                                                            "layout-block",
                                                            font("16")
                                                        )
                                                    ),
                                                    assign(
                                                        content(`E-commerse`),
                                                        _class(
                                                            "style-line-height-double",
                                                            "layout-block",
                                                            font("16")
                                                        )
                                                    ),
                                                    assign(
                                                        content(`Design Executive`),
                                                        _class(
                                                            "style-line-height-double",
                                                            "layout-block",
                                                            font("16")
                                                        )
                                                    )
                                                )
                                            ),

                                            col(
                                                _class(
                                                    "layout-col-7"
                                                ),
                                                values(
                                                    assign(
                                                        _class(
                                                            "style-line-height-double",
                                                            font("16")
                                                        ),
                                                        content(`Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                                                        unknown printer took a galley of type and scrambled it to make a type specimen book.`)
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),
                // End Listings Layer

                // Breakthrough layer
                layer(
                    layout(
                        _class(
                            "layout-contain-large",
                            padding("horz", "large")
                        ),
                        values(
                            section(
                                _class( "layout-vert" ),
                                values(
                                    row(
                                        values(
                                            col(
                                                _class(
                                                    "layout-col-6",
                                                    padding("bottom-small", "right-large")
                                                ),
                                                values(
                                                    assign(
                                                        content(`Breakthrough<br>Limits!`),
                                                        _class(
                                                            "style-bold",
                                                            "style-line-height",
                                                            "h3",
                                                            color("primary")
                                                        )
                                                    )
                                                )
                                            ),

                                            col(
                                                _class( "layout-col-6" ),
                                                values(
                                                    assign(
                                                        content(`Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
                                                        unknown printer took a galley of type and scrambled it to make a type specimen book.`),
                                                        _class(
                                                            "layout-block",
                                                            "style-line-height-double",
                                                            font("16")
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),
                // End Breakthrough Layer

                // Image Column layer
                layer(
                    layout(
                        _class( "layout-contain-large" ),
                        values(
                            section(
                                _class( "layout-shorten-vert" ),
                                values(
                                    row(
                                        _class( margin("dull") ),
                                        values(
                                            col(
                                                _class(
                                                    "layout-block",
                                                    "layout-col-3"
                                                )
                                            ),

                                            col(
                                                _class(
                                                    "layout-col-9",
                                                    padding("small")
                                                ),
                                                values(
                                                    assign(
                                                        content(` `),
                                                        _class(
                                                            "layout-block",
                                                            "layer-box",
                                                            "layer-surface",
                                                            "layer-shadow--1"
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    ),

                                    row(
                                        _class( margin("dull") ),
                                        values(
                                            col(
                                                _class(
                                                    "layout-col-9",
                                                    padding("small", "vert-large")
                                                ),
                                                values(
                                                    assign(
                                                        _img("/assets/city.webp?w=250"),
                                                        _class(
                                                            "layout-block",
                                                            "layer-box",
                                                            "layer-surface",
                                                            "layer-shadow"
                                                        )
                                                    )
                                                )
                                            ),

                                            col(
                                                _class(
                                                    "layout-col-3",
                                                    "layout-block"
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
                // End Image Column Layer
            )
        )
    },
    "routes": {
        "/": "index",
        "/about": "about",
        "/run": "run"
    },
    "social_links": [{
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
    "projects": [{
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