let browserlist = {
    "modern": ["> 10%"],
    "general": ["defaults, IE 10"]
};

let babelConfig = {
    "node": {
        "presets": ["@babel/preset-env"]
    }
};

["modern", "general"].forEach(function (type) {
    babelConfig[type] = {
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": "usage",
                "corejs": "3.2.1",
                "targets": {
                    "browsers": browserlist[type]
                }
            }]
        ]
    };
});

let _export = { babelConfig, ...browserlist };
module.exports = _export;