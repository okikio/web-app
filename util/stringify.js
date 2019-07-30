// Stringify
let stringify = obj => {
    let fns = [];
    let json = JSON.stringify(obj, (key, val) => {
        if (typeof val == "function") {
            fns.push(val.toString());
            return "_";
        }
        return val;
    }, 4);

    return json.replace(/\"_\"/g, () => fns.shift());
};

module.exports = stringify;