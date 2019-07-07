module.exports = {
    "pages": {
        "index": {
            "title": "Hello There",
            "tabs": {
                "values": [{
                        "a": {
                            "href": "/about",
                            "content": "ABOUT"
                        }
                    },
                    {
                        "a": {
                            "href": "/projects",
                            "content": "PROJECTS"
                        }
                    },
                    {
                        "a": {
                            "href": "/contact",
                            "content": "CONTACT"
                        }
                    }
                ]
            },
            "values": [{
                    "layer": {
                        "class": "layer-color-primary",
                        "hero": {
                            "img": {
                                "src": "/assets/blue-sky.jpg",
                                "alt": "A city Image"
                            },
                            "title": "HEro to REscue"
                        },
                        "layout": {
                            "class": "layout-enlarge",
                            "values": [{
                                "section": {
                                    "title": "Hello",
                                    "values": [{
                                            "img": {
                                                "src": "/assets/city.jpg",
                                                "alt": "A city Image"
                                            }
                                        },
                                        {
                                            "content": "X value -- "
                                        },
                                        {
                                            "content": "Print so many"
                                        }
                                    ]
                                }
                            }]
                        }
                    }
                },
                {
                    "img": {
                        "src": "/assets/blue-sky.jpg",
                        "alt": "A city Image"
                    }
                },
                {
                    "content": "Shes alive"
                }
            ]
        }
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