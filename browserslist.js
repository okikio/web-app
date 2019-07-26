let browserlist = {
    "modern": [
        "Firefox >= 53",
        "Edge >= 15",
        "Chrome >= 58",
        "iOS >= 10.1"
    ],
    "general": [
        "last 99 version"
    ]
};

let babelConfig = {
    "modern": {
        "presets": [
            ["@babel/preset-env", {
                // "useBuiltIns": "usage",
                // "corejs": "3.1.4",
                "targets": {
                    "browsers": browserlist.modern
                },
                "modules": false
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
                },
                "modules": false
            }]
        ]
    }
};

module.exports = { ...browserlist, babelConfig };