export let { assign, keys, values } = Object;
export let { isArray, from, of } = Array;

// Remove certain properties
export let _removeProps = (prop, obj) => {
    let newObj = assign({}, obj);
    prop.forEach(key => delete newObj[key]);
    return newObj;
 };

// Create an array of values that two array share in common
export let _intersect = (a, b) => a.filter(val => b.includes(val));

// Log values
export let _log = (...args) => args.forEach(v => console.log(v));

// Capitalize strings
export let _capital = val => val[0].toUpperCase() + val.slice(1);

// Test the type of a value
export let _is = (val, type) => (typeof val == type);

// Is Instance Of
let _isInst = (ctor, obj) => (ctor instanceof obj);
let _type = type => { // Tweak of _is
    return val => _is(val, type);
};

assign(_is, {
    el: el => _isInst(el, Element) || _isInst(el, Document),
    arrlike (obj) {
        let len = _is(obj.length, "number") && obj.length;
        return len == 0 || len > 0 && (len - 1) in obj;
    },
    num: val => !isNaN(val) && _type("number") (val),
    class: obj => obj && obj._method && obj._class,
    not: (type, ...args) => !_is[type](...args),
    doc: ctor => _isInst(ctor, Document),
    def: val => !_is(val, "undefined"),
    win: val => val && val.window,
    undef: _type("undefined"),
    bool: _type("boolean"),
    fn: _type("function"),
    str: _type("string"),
    obj: _type("object"),
    nul: v => v == null,
    inst: _isInst,
    arr: isArray,
    _type
});

/**
 * @param  {Function} fn
 * @param  {Array<any>} args
 * @param  {Object} ctxt
 */
export let _fnval = (fn, args, ctxt) => {
    if (_is.not("fn", fn) ||
        keys(fn.prototype || {}).length > 0)
        { return fn; }
    return fn.apply(ctxt, args);
};

let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
let ARGUMENT_NAMES = /(?:^|,)\s*([^\s,=]+)/g;

// Argument names
export let _argNames = fn => {
    let fnStr = fn.toString().replace(STRIP_COMMENTS, '');
    let argsList = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'));
    let result = argsList.match( ARGUMENT_NAMES ), stripped = [];

    if (_is.nul(result)) return [];
    else {
        for (let i = 0; i < result.length; i ++) {
            stripped.push( result[i].replace(/[\s,]/g, '') );
        }

        return stripped;
    }
};

// Get or set a value in an Object, based on it's path
export let _path = (obj, path, val) => {
    path = path.toString().split(/[.,]/g);
    if (_is.def(val)) {
        if (path.length > 1) {
            _path(obj[path.shift()], path, val);
        } else { obj[path[0]] = val; }
        return val;
    } else {
        path.forEach(_val => { obj = obj[_val]; });
    }
    return obj;
};

/*
    Builds on path and adds more power,
    * Allows for multiple paths one value
    * Using Objects as paths and setting the values individually
    * Access values as an Array, from multiple paths
*/
export let _attr = (obj, path, val) => {
    if (_is.obj(path) && _is.not("arr", path))
        { return assign(obj, path); }
    else if (_is.arr(path)) {
        if (_is.undef(val)) {
            return path.map(_key => _path(obj, _key));
        } else {
            path.forEach(_key => { _path(obj, _key, val); });
        }
    } else { return _path(obj, path, val); }
    return obj;
};

// The matches() method checks to see if the Element would be selected by the provided selectorString -- in other words -- checks if the element "is" the selector.
export let _matches = (ele, sel) => {
    if (_is.undef(ele)) return;
    let matchSel = ele.matches || ele.msMatchesSelector || ele.webkitMatchesSelector;
    if (matchSel) return matchSel.call(ele, sel);
};

// A more efficient `new` keyword that allows for arrays to be passed as arguments
export let _new = function (ctor, args) {
    let F = function () { return ctor.apply(this, args); };
    F.prototype = ctor.prototype;
    return new F();
};

export default { _matches, _capital, _is, _intersect, _fnval, _argNames, _path, _attr, _new, assign, keys, values, from, of };
