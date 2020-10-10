let browserlist = {
    "modern": ["> 10%"],
    "general": ["defaults, IE 8"]
};

let babelConfig = {
    "node": {
        "presets": ["@babel/preset-env"]
    }
};

["modern", "general"].forEach(function (type) {
    babelConfig[type] = {
        babelHelpers: 'bundled',
        "babelrc": false,
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": false,
                "modules": false,
                "targets": {
                    "browsers": browserlist[type]
                }
            }]
        ]
    };
});

let _export = { babelConfig, ...browserlist };
module.exports = _export;
