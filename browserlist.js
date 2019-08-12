let babelConfig = {};
let browserlist = {
    "modern": ["> 10%"],
    "general": ["defaults, IE 8"]
};

["modern", "general"].forEach(function (type) {
    babelConfig[type] = {
        "presets": [
            ["@babel/preset-env", {
                "useBuiltIns": "usage",
                "corejs": "3.1.4",
                "targets": {
                    "browsers": browserlist[type]
                }
            }]
        ]
    };
});

module.exports = { ...browserlist, babelConfig };