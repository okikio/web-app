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
        "babelrc": false,
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": false,
                "modules": 'auto',
                "targets": {
                    "browsers": browserlist[type]
                }
            }]
        ]
    };
});

let _export = { babelConfig, ...browserlist };
module.exports = _export;