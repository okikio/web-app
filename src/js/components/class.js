let { assign, keys } = Object;
let { isArray } = Array;

// Test the type of a value
let _is = (val, type) => (typeof val == type);

/**
 * @param  {Function} fn
 * @param  {Array<any>} args
 * @param  {Object} ctxt
 */
let _fnval = (fn, args, ctxt) => {
    if (!_is(fn, "function") || 
        keys(fn.prototype || {}).length > 0) 
        { return fn; }
    return fn.apply(ctxt, args);
};

// Argument names
let _argNames = fn => {
    let args = fn.toString()
        .match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
    return args.length === 1 && !args[0] ? [] : args;
};

// Attach properties to class prototype or the class itself
let _attachProp = where => {
    let _prototype = where == "prototype";

    return (_obj, ...args) => {
        // If super class exists, set value of parent to `SuperClass` prototype
        let parent = _prototype && _obj.SuperClass ? _obj.SuperClass.prototype : _obj.SuperClass;

        args.forEach(val => {
            // Transform functions to Objects
            let obj = _fnval(val, [_obj, _obj.constructor], _prototype ? _obj.prototype : _obj);
            
            // Iterate through Object
            keys(obj).forEach(i => {
                let _val = obj[i], preVal = _val;

                // If a Parent Class is Present, Set any argument/params named `$super` to the `Parent`
                if (_is(_val, "function")) {
                    if (parent && _argNames(_val)[0] == "$super") {
                        // Let the first argument be the original value
                        _val = function (...args) {
                            return parent[i].apply(_obj, [preVal, ...args]);
                        };
                    }
                    
                    // For debugging purposes
                    _val.valueOf = preVal.valueOf.bind(preVal);
                    _val.toString = preVal.toString.bind(preVal);
                }

                (_prototype ? _obj.prototype : _obj)[i] = _val; // Redefinition Error Fix

                /* 
                    Allows the use of `Object.defineProperty`, if an Object has any of these 
                    { $$prop: true, get: function () { ... }, set: function () { ... } } 
                */
                if (_is(_val, "object") && _val !== undefined &&
                    _val !== null && (_val.$$prop || 
                        _val.get && _is(_val.get, "function") || 
                        _val.set && _is(_val.set, "function")) &&
                    !_val._class) {
                    Object.defineProperty(_prototype ? _obj.prototype : _obj, i, _val);
                }
            }, _obj);
        }, _obj);
        return _obj;
    };
};

// Set class prototype properties and methods
let _method = _attachProp("prototype");

// Set static properties and methods
let _static = _attachProp("static");

// Get or set a value in an Object, based on it's path
let _path = (obj, path, val) => {
    path = path.toString().split(/[\.\,]/g);
    if (!_is(val, "undefined")) {
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
    if (_is(path, "object") && !isArray(path)) 
        { return assign(obj, path); }
    else if (isArray(path)) {
        if (_is(val, "undefined")) {
            return path.map(_key => _path(obj, _key));
        } else {
            path.forEach(_key => { _path(obj, _key, val); });
        }
    } else { return _path(obj, path, val); }
    return obj;
};

// Create a copy of static methods that can function as prototype methods
let _alias = (props, opts = {}) => {
    let thisArg = opts.thisArg || []; // This as first argument
    let chain = opts.chain || [], toStr;
    let result = {}, val;

    for (let i in props) {
        val = props[i];

        if (_is(val, "function")) {
            result[i] = (...args) => {
                let _args = thisArg.includes(i) ?  [this, ...args] : args;
                if (chain.includes(i)) {
                    val.apply(this, _args);
                    return this;
                }
                return val.apply(this, _args);
            };

            toStr = val.toString.bind(val);
            result[i].toString = chain.includes(i) ?
                () => `${toStr()} return this;` : toStr;
            result[i].valueOf = val.valueOf.bind(val);
        }
    }
    return result;
};

// Easy access to configurable property attributes, like get, set, writeable, value etc...
let _configAttr = (attr = "get", type = "function") => {
    return val => {
        let _val = val;
        if (type == "function") {
            _val = Function(`with (this) return ${val}`);
            _val.toString = val.toString;
        }
        return { [attr]: _val };
    };
};

// Get and set property attributes
let _get = _configAttr("get", "function");
let _set = _configAttr("set", "function");

// A more efficient `new` keyword that allows for arrays to be passed as arguments
let _new = (ctor, args) => {
    let F = function () { return ctor.apply(this, args); };
    F.prototype = ctor.prototype;
    return new F();
};

let _class, props = { _is, _fnval, _argNames, _method, _static, _path, _attr, _alias, _configAttr, _get, _set, _new };

aliasMethods = _alias(props, {
    thisArg: ["_attr", "_path", "_method", "_static"],
    chain: []
});

// Create classes
_class = function (...args) {
    let Class, SubClass, Parent;

    // SubClass constructor
    SubClass = function () { };

    // Set parent constructor
    if (args[0] && _is(args[0], "function") || isArray(this.SubClasses)) {
        if (isArray(this.SubClasses)) { Parent = this; }
        else { Parent = args.shift(); }
    }

    // Class Object
    Class = function (..._args) {
        // Current Class
        if (!(this instanceof Class)) { return _new(Class, _args); }
        this._args = _args; // Arguments

        // Initialize Class
        return this.init.apply(this, this._args);
    };

    // Extend parent class, if any
    if (Parent) {
        Parent.prototype.constructor = Parent;
        SubClass.prototype = Parent.prototype;
        Class.prototype = new SubClass();
        void (Parent.SubClasses && Parent.SubClasses.push(Class));
    }

    Class.SuperClass = Parent; // Current Class's Parent if any
    Class.SubClasses = []; // List of SubClasses

    // Extend Class
    assign(Class, props);
    assign(Class.prototype, Class, aliasMethods);

    // Add Methods to Class
    Class._method.apply(Class, args);

    // Set Current class type
    if (!Class.prototype._class) { Class.prototype._class = "Object"; }

    // Set Class constructor
    Class.prototype.constructor = Class;
    if (!Class.prototype.init) { Class.prototype.init = () => { }; }
    else {
        // Set toString & toValue
        Class.toString = Class.prototype.init.toString;
        Class.toValue = Class.prototype.init.toValue;
    }

    // Call Super Class Methods
    Class.prototype.callSsper = function (method) {
        var _Parent = null, $ = this, arg = args(arguments, 1),
            _const = $, _super = _const.SuperClass;
        // Climb prototype chain to find method not equal to callee's method
        while (_super) {
            if ($[method] !== _super.prototype[method]) {
                _Parent = _super.prototype[method];
                break;
            }
            $ = _super.prototype;
            _const = $.constructor;
            _super = _const.SuperClass;
        }

        if (!_Parent) {
            println(method + ', method not found in prototype chain.');
            return;
        }
        return (arg.length > 0) ?
            _Parent.apply(this, arg) : _Parent.bind(this)();
    };
    return Class;
};

// Alias Methods
_.extend(Static, {
    Extends: Static.Create, // Extend from another Class
    // Add Prototype Methods to Class
    Method: Static.Method,
    AddTo: Static.Method,
    Prop: Static.Method,
});

let Class = Static.Create;
_.extend(Class, Static);
return Class;