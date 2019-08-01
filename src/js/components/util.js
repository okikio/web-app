let { assign, keys, values } = Object;
let { isArray, from, of } = Array;

// Test the type of a value
let _is = (val, type) => (typeof val == type);

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
    class: obj => obj && obj._method && obj._class,
    not: (type, ...args) => !_is[type](...args),
    doc: ctor => _isInst(ctor, Document),
    def: val => !_is(val, "undefined"),
    undef: _type("undefined"),
    bool: _type("boolean"),
    fn: _type("function"),
    obj: _type("object"),
    num: _type("number"),
    str: _type("string"),
    nul: _type("null"),
    inst: _isInst, 
    arr: isArray,
    _type
});

/**
 * @param  {Function} fn
 * @param  {Array<any>} args
 * @param  {Object} ctxt
 */
let _fnval = (fn, args, ctxt) => {
    if (_is.not("fn", fn) || 
        keys(fn.prototype || {}).length > 0) 
        { return fn; }
    return fn.apply(ctxt, args);
};

// Argument names
let _argNames = fn => {
    let args = fn.toString()
        .match(/^[\s(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
    return args.length == 1 && !args[0] ? [] : args;
};

// Get or set a value in an Object, based on it's path
let _path = (obj, path, val) => {
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
let _attr = (obj, path, val) => {
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

// A more efficient `new` keyword that allows for arrays to be passed as arguments
let _new = (ctor, args) => {
    let F = function () { return ctor.apply(this, args); };
    F.prototype = ctor.prototype;
    return new F();
};

export default { _is, _fnval, _argNames, _path, _attr, _new, assign, keys, values, from, of };