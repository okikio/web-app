let { values, title, tile, tabs, src, section, row, page, padding, margin, link, layout, layer, img, href, hero, font_size, content, component, color, col, _class, class_add, background, attr, alt } = require("./containers/page")
module.exports = {
    "pages": {
        "index": page(
            title("Hello There"),
            values(
                layer(
                    _class(
                        background("primary")
                    ),
                    hero(
                        img("/assets/blue-sky.jpg", "A city Image"),
                        title("HEro to REscue")
                    ),
                    layout(
                        _class("layout-enlarge"),
                        values(
                            section(
                                title("Hello"),
                                values(
                                    img("/assets/city.jpg", "A city Image")
                                )
                            )
                        )
                    )
                ),
                img("/assets/blue-sky.jpg", "A city Image"),
                content("Shes alive")
            )
        )
    },
    "routes": {
        "/": "index",
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
                "src": "https://res.cloudinary.com/okikio-assets/image/upload/q_10,f_auto/white-flower.jpg",
                "alt": ""
            }
        },
        {
            "name": "Science",
            "url": "science",
            "detail": "Lorem itpsim",
            "info": "Info about Leukemia",
            "img": {
                "src": "https://res.cloudinary.com/okikio-assets/image/upload/q_10,f_auto/city.jpg",
                "alt": ""
            }
        },
        {
            "name": "Civics",
            "url": "civics",
            "detail": "Lorem itpsim",
            "info": "A little about renewable sources of energy",
            "img": {
                "src": "https://res.cloudinary.com/okikio-assets/image/upload/q_10,f_auto/blue-sky.jpg",
                "alt": ""
            }
        }
    ]
};