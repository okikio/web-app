let pick = require(`../util/pick${dev ? '' : ".min"}`);

// Attributes for components
module.exports = (attr, defaults, list) => (...vals) => {
    let val = list ? vals : vals[0];
    return { [attr]: pick(val, defaults) };
};
