let browserlist = {
    "modern": ["> 10%"],
    "general": ["defaults, IE 8"]
};

let babelConfig = {
    "modern": {
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": "usage",
                "corejs": "3.1.4",
                "targets": {
                    "browsers": browserlist.modern
                }
            }]
        ]
    },
    "general": {
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": "usage",
                "corejs": "3.1.4",
                "targets": {
                    "browsers": browserlist.general
                } 
            }]
        ]
    },
    "node": {
        "presets": [ "@babel/preset-env" ]
    }
};

module.exports = { ...browserlist, babelConfig };