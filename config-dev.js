module.exports = {
    "websiteURL": "https://app-fast.herokuapp.com/",
    "cloud_name": "okikio-assets",
    "imageURLConfig": {
        "flags": "progressive:steep",
        "fetch_format": "auto",
        "client_hints": true,
        "crop": "scale",
        "quality": 30,
        "dpr": "auto"
    },
    "pages": {
        "404": {
            "page": {
                "title": "Ooops!",
                "tabs": {
                    "values": [{
                        "a": {
                            "href": "/about.html",
                            "content": "about"
                        }
                    }, {
                        "a": {
                            "href": "/projects.html",
                            "content": "projects"
                        }
                    }, {
                        "a": {
                            "href": "/contact.html",
                            "content": "contact"
                        }
                    }]
                },
                "name": "404",
                "values": [{
                    "layer": {
                        "class": "layout-padding-horz layout-padding-large-top",
                        "layout": {
                            "class": "layout-shorten layout-contain",
                            "values": [{
                                "section": {
                                    "title": "404, Page Not Found.",
                                    "type": "header"
                                }
                            }, {
                                "section": {
                                    "class": "style-center",
                                    "values": [{
                                        "content": " ",
                                        "class": "layout-padding-top layout-margin-left-large layout-inline-block"
                                    }, "Sorry, the page you are looking for doesn't exist. How about going back ", {
                                        "a": {
                                            "href": "/index.html",
                                            "content": "home"
                                        }
                                    }, "."],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "class": "footer",
                        "layout": {
                            "section": {
                                "class": "layout-padding style-center style-spaceout-small style-font-weight-bold style-font-title",
                                "values": ["Made with ❤ by Okiki Ojo."]
                            }
                        }
                    }
                }],
                "noFooter": true
            }
        },
        "projects": {
            "page": {
                "title": "Projects",
                "tabs": {
                    "values": [{
                        "a": {
                            "href": "/about.html",
                            "content": "about"
                        }
                    }, {
                        "a": {
                            "href": "/projects.html",
                            "content": "projects"
                        }
                    }, {
                        "a": {
                            "href": "/contact.html",
                            "content": "contact"
                        }
                    }]
                },
                "name": "projects",
                "values": [{
                    "hero": {
                        "title": "Projects.",
                        "img": {
                            "src": "/assets/blue-sky",
                            "alt": "A city Image"
                        }
                    }
                }, {
                    "layer": {
                        "class": "layout-padding-horz",
                        "layout": {
                            "class": "layout-shorten layout-contain",
                            "values": [{
                                "section": {
                                    "title": "Lorem itpsuim",
                                    "type": "header"
                                }
                            }, {
                                "section": {
                                    "values": [{
                                        "content": " ",
                                        "class": "layout-padding-top layout-margin-left-large layout-inline-block"
                                    }, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer\n                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n                                        It was popularised in the 1960s with the release of Letraset sheets\n                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, ", {
                                        "a": {
                                            "href": "/index.html",
                                            "content": "home"
                                        }
                                    }],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "layout": {
                            "class": "layout-contain-large layout-padding-horz layout-padding-large",
                            "values": [{
                                "section": {
                                    "class": "layout-vert",
                                    "values": [{
                                        "row": {
                                            "values": [{
                                                "col": {
                                                    "class": "layout-col-6 layout-padding-bottom-small layout-padding-right-large",
                                                    "values": [{
                                                        "content": "Breakthrough<br>Limits!",
                                                        "class": "style-bold style-line-height h3 style-color-primary"
                                                    }]
                                                }
                                            }, {
                                                "col": {
                                                    "class": "layout-col-6",
                                                    "values": [{
                                                        "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n                                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an\n                                                        unknown printer took a galley of type and scrambled it to make a type specimen book.",
                                                        "class": "layout-block style-line-height-double style-font-16"
                                                    }]
                                                }
                                            }]
                                        }
                                    }],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "layout": {
                            "class": "layout-contain-large",
                            "values": [{
                                "section": {
                                    "class": "layout-shorten-vert",
                                    "values": [{
                                        "row": {
                                            "class": "layout-margin-dull",
                                            "values": [{
                                                "col": {
                                                    "class": "layout-block layout-col-3"
                                                }
                                            }, {
                                                "col": {
                                                    "class": "layout-col-9 layout-padding-small",
                                                    "values": [{
                                                        "tile": {
                                                            "title": "",
                                                            "content": "",
                                                            "class": "layer-box layer-surface layer-shadow--1 layout-block"
                                                        }
                                                    }]
                                                }
                                            }]
                                        }
                                    }, {
                                        "row": {
                                            "class": "layout-margin-dull",
                                            "values": [{
                                                "col": {
                                                    "class": "layout-col-9 layout-padding-small layout-padding-vert-large",
                                                    "values": [{
                                                        "tile": {
                                                            "title": "Google Designs",
                                                            "content": "",
                                                            "img": {
                                                                "src": "/assets/blue-sky",
                                                                "alt": "City Alt"
                                                            },
                                                            "class": "layer-box layer-surface layer-shadow--1 layout-block"
                                                        }
                                                    }]
                                                }
                                            }, {
                                                "col": {
                                                    "class": "layout-block layout-col-3"
                                                }
                                            }]
                                        }
                                    }],
                                    "type": "main"
                                }
                            }, {
                                "section": {
                                    "values": [{
                                        "content": " ",
                                        "class": "layout-padding-top layout-margin-left-large layout-inline-block"
                                    }, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer\n                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n                                        It was popularised in the 1960s with the release of Letraset sheets\n                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, ", {
                                        "a": {
                                            "href": "/index.html",
                                            "content": "home"
                                        }
                                    }],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "class": "layer-color-black",
                        "layout": {
                            "class": "layout-contain layout-padding-horz layout-padding-top",
                            "values": [{
                                "section": {
                                    "class": "h4 layout-shorten",
                                    "values": [{
                                        "section": {
                                            "title": "Next",
                                            "class": "style-color-white style-font-light style-font-thin style-spaceout",
                                            "type": "header"
                                        }
                                    }, {
                                        "section": {
                                            "class": "style-center layout-padding-vert",
                                            "values": [{
                                                "content": "NASA Rocket Ship",
                                                "class": "h1 style-bold style-primary"
                                            }],
                                            "type": "main"
                                        }
                                    }]
                                }
                            }, {
                                "section": {
                                    "class": "layer-box layer-box-flat layer-surface layer-shadow layout-block"
                                }
                            }]
                        }
                    }
                }],
                "noFooter": true
            }
        },
        "about": {
            "page": {
                "title": "The Sub Page",
                "tabs": {
                    "values": [{
                        "a": {
                            "href": "/about.html",
                            "content": "about"
                        }
                    }, {
                        "a": {
                            "href": "/projects.html",
                            "content": "projects"
                        }
                    }, {
                        "a": {
                            "href": "/contact.html",
                            "content": "contact"
                        }
                    }]
                },
                "name": "about",
                "values": [{
                    "hero": {
                        "title": "Subpage.",
                        "img": {
                            "src": "/assets/white-flower",
                            "alt": "A city Image"
                        }
                    }
                }, {
                    "layer": {
                        "class": "layout-padding-horz",
                        "layout": {
                            "class": "layout-shorten layout-contain",
                            "values": [{
                                "section": {
                                    "title": "Lorem itpsuim",
                                    "type": "header"
                                }
                            }, {
                                "section": {
                                    "values": [{
                                        "content": " ",
                                        "class": "layout-padding-top layout-margin-left-large layout-inline-block"
                                    }, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer\n                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n                                        It was popularised in the 1960s with the release of Letraset sheets\n                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, ", {
                                        "a": {
                                            "href": "/index.html",
                                            "content": "home"
                                        }
                                    }],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "class": "footer",
                        "layout": {
                            "section": {
                                "class": "layout-padding style-center style-spaceout-small style-font-weight-bold style-font-title",
                                "values": ["Made with ❤ by Okiki Ojo."]
                            }
                        }
                    }
                }],
                "noFooter": true
            }
        },
        "index": {
            "page": {
                "title": "Hello There",
                "tabs": {
                    "values": [{
                        "a": {
                            "href": "/about.html",
                            "content": "about"
                        }
                    }, {
                        "a": {
                            "href": "/projects.html",
                            "content": "projects"
                        }
                    }, {
                        "a": {
                            "href": "/contact.html",
                            "content": "contact"
                        }
                    }]
                },
                "name": "index",
                "values": [{
                    "hero": {
                        "title": "Relax.",
                        "img": {
                            "src": "/assets/white_car",
                            "alt": "A city Image"
                        }
                    }
                }, {
                    "layer": {
                        "class": "layout-padding-horz",
                        "layout": {
                            "class": "layout-shorten layout-contain",
                            "values": [{
                                "section": {
                                    "title": "Lorem itpsuim",
                                    "type": "header"
                                }
                            }, {
                                "section": {
                                    "values": [{
                                        "content": " ",
                                        "class": "layout-padding-top layout-margin-left-large layout-inline-block"
                                    }, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer\n                                        took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n                                        It was popularised in the 1960s with the release of Letraset sheets\n                                        containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum, ", {
                                        "a": {
                                            "href": "/about.html",
                                            "content": "run"
                                        }
                                    }],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "layout": {
                            "class": "layout-padding-horz layout-padding-large-top",
                            "section": {
                                "class": "layout-shorten layout-contain",
                                "values": [{
                                    "section": {
                                        "title": "Listings",
                                        "type": "header"
                                    }
                                }, {
                                    "section": {
                                        "class": "layout-padding-top style-line-height-double",
                                        "values": [{
                                            "row": {
                                                "values": [{
                                                    "col": {
                                                        "class": "layout-col-2 layout-padding-bottom-small",
                                                        "values": [{
                                                            "content": "03/03",
                                                            "class": "style-bold style-font-16"
                                                        }]
                                                    }
                                                }, {
                                                    "col": {
                                                        "class": "layout-col-3 layout-padding-bottom",
                                                        "values": [{
                                                            "content": "2018",
                                                            "class": "style-line-height-double style-bold layout-block style-font-16"
                                                        }, {
                                                            "content": "E-commerse",
                                                            "class": "style-line-height-double layout-block style-font-16"
                                                        }, {
                                                            "content": "Design Executive",
                                                            "class": "style-line-height-double layout-block style-font-16"
                                                        }]
                                                    }
                                                }, {
                                                    "col": {
                                                        "class": "layout-col-7",
                                                        "values": [{
                                                            "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n                                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an\n                                                        unknown printer took a galley of type and scrambled it to make a type specimen book.",
                                                            "class": "style-line-height-double style-font-16"
                                                        }]
                                                    }
                                                }]
                                            }
                                        }],
                                        "type": "main"
                                    }
                                }]
                            }
                        }
                    }
                }, {
                    "layer": {
                        "layout": {
                            "class": "layout-padding-horz layout-padding-vert-large layout-contain-large",
                            "values": [{
                                "section": {
                                    "title": "",
                                    "class": "layout-vert style-bold-font style-500 h2",
                                    "values": ["Got your attention.", " ", {
                                        "content": "Good!",
                                        "class": "style-color-primary"
                                    }],
                                    "type": "header"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "class": "layer-color-primary",
                        "layout": {
                            "class": "layout-contain-large layout-enlarge-vert",
                            "values": [{
                                "section": {
                                    "title": "",
                                    "class": "layout-vert style-bold-font style-500 h2 style-color-white",
                                    "values": ["Got your attention.", " ", {
                                        "content": "Good!",
                                        "class": "style-color-tertiary"
                                    }],
                                    "type": "header"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "class": "layer-color-secondary",
                        "layout": {
                            "class": "layout-contain-large layout-enlarge-vert",
                            "values": [{
                                "section": {
                                    "title": "",
                                    "class": "layout-vert style-bold-font style-500 h2 style-color-white",
                                    "values": ["Got your attention.", " ", {
                                        "content": "Good!",
                                        "class": "style-color-tertiary"
                                    }],
                                    "type": "header"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "class": "layer-color-tertiary",
                        "layout": {
                            "class": "layout-contain-large layout-enlarge-vert",
                            "values": [{
                                "section": {
                                    "title": "",
                                    "class": "layout-vert style-bold-font style-500 h2 style-color-dark",
                                    "values": ["Got your attention.", " ", {
                                        "content": "Good!",
                                        "class": "style-color-secondary"
                                    }],
                                    "type": "header"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "layout": {
                            "class": "layout-contain-large layout-padding-horz layout-padding-large",
                            "values": [{
                                "section": {
                                    "class": "layout-vert",
                                    "values": [{
                                        "row": {
                                            "values": [{
                                                "col": {
                                                    "class": "layout-col-6 layout-padding-bottom-small layout-padding-right-large",
                                                    "values": [{
                                                        "content": "Breakthrough<br>Limits!",
                                                        "class": "style-bold style-line-height h3 style-color-primary"
                                                    }]
                                                }
                                            }, {
                                                "col": {
                                                    "class": "layout-col-6",
                                                    "values": [{
                                                        "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n                                                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an\n                                                        unknown printer took a galley of type and scrambled it to make a type specimen book.",
                                                        "class": "layout-block style-line-height-double style-font-16"
                                                    }]
                                                }
                                            }]
                                        }
                                    }],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "layout": {
                            "class": "layout-contain-large",
                            "values": [{
                                "section": {
                                    "class": "layout-shorten-vert",
                                    "values": [{
                                        "row": {
                                            "class": "layout-margin-dull",
                                            "values": [{
                                                "col": {
                                                    "class": "layout-block layout-col-3"
                                                }
                                            }, {
                                                "col": {
                                                    "class": "layout-col-9 layout-padding-small",
                                                    "values": [{
                                                        "tile": {
                                                            "title": "",
                                                            "content": "",
                                                            "class": "layer-box layer-surface layer-shadow--1 layout-block"
                                                        }
                                                    }]
                                                }
                                            }]
                                        }
                                    }, {
                                        "row": {
                                            "class": "layout-margin-dull",
                                            "values": [{
                                                "col": {
                                                    "class": "layout-col-9 layout-padding-small layout-padding-vert-large",
                                                    "values": [{
                                                        "tile": {
                                                            "title": "Google Designs",
                                                            "content": "",
                                                            "img": {
                                                                "src": "/assets/blue-sky",
                                                                "alt": "City Alt"
                                                            },
                                                            "class": "layer-box layer-surface layer-shadow--1 layout-block"
                                                        }
                                                    }]
                                                }
                                            }, {
                                                "col": {
                                                    "class": "layout-block layout-col-3"
                                                }
                                            }]
                                        }
                                    }],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "layout": {
                            "class": "layout-margin-vert-bottom-large",
                            "values": [{
                                "section": {
                                    "values": [{
                                        "row": {
                                            "class": "layout-margin-dull",
                                            "values": [{
                                                "col": {
                                                    "class": "layout-col-12 layout-padding-dull",
                                                    "values": [{
                                                        "tile": {
                                                            "title": "",
                                                            "content": "",
                                                            "class": "layer-box layer-box-flat layer-box-tall layer-surface layer-shadow layout-block"
                                                        }
                                                    }]
                                                }
                                            }]
                                        }
                                    }],
                                    "type": "main"
                                }
                            }]
                        }
                    }
                }, {
                    "layer": {
                        "class": "footer",
                        "layout": {
                            "section": {
                                "class": "layout-padding style-center style-spaceout-small style-font-weight-bold style-font-title",
                                "values": ["Made with ❤ by Okiki Ojo."]
                            }
                        }
                    }
                }],
                "noFooter": true
            }
        }
    },
    "routes": {
        "/": "index",
        "/about": "about",
        "/projects": "project"
    },
    "social_links": [{
        "name": ["Twitter", "Tw"],
        "href": "https://twitter.com/okikio_dev"
    }, {
        "name": ["Instagram", "In"],
        "href": "https://www.instagram.com/okikio.dev/"
    }, {
        "name": ["Github", "Git"],
        "href": "https://github.com/okikio"
    }, {
        "name": ["LinkedIn", "Lk"],
        "href": "https://www.linkedin.com/in/okiki-o-a5287213b"
    }, {
        "name": ["Mail", "@"],
        "href": "mailto:okikio.dev@gmail.com"
    }],
    "projects": [{
        "name": "Leader",
        "url": "leader",
        "detail": "Lorem itpsim",
        "info": "The nature of leadership",
        "img": {
            "src": "/assets/white-flower",
            "alt": ""
        }
    }, {
        "name": "Science",
        "url": "science",
        "detail": "Lorem itpsim",
        "info": "Info about Leukemia",
        "img": {
            "src": "/assets/city",
            "alt": ""
        }
    }, {
        "name": "Civics",
        "url": "civics",
        "detail": "Lorem itpsim",
        "info": "A little about renewable sources of energy",
        "img": {
            "src": "/assets/blue-sky",
            "alt": ""
        }
    }]
};