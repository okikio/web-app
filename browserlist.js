let browserlist = {
    "modern": ["> 10%"],
    "general": ["defaults, IE 11"]
};

let babelConfig = {
    "node": {
        "presets": ["@babel/preset-env"]
    }
};

["modern", "general"].forEach(function (type) {
    let gen = type == 'general';
    babelConfig[type] = {
        "babelrc": false,
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": gen ? "entry" : "usage",
                "modules": 'false',
                "spec": true,
                "forceAllTransforms": gen,
                "corejs": 3,
                "targets": {
                    "browsers": browserlist[type]
                }
            }]
        ]
    };
});

let _export = { babelConfig, ...browserlist };
module.exports = _export;