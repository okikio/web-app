/*
   - Based on Prototype.js [#class] (api.prototypejs.org/language/Class/
*/

import { _log, _is, _removeProps, _fnval, _argNames, _path, _attr, _new, assign, keys } from "./util";

// Attach properties to class prototype or the class itself
export let _attachProp = function (where) {
    let _prototype = where == "prototype";
    return function (_obj, ...args) {
        // If super class exists, set value of parent to `SuperClass` prototype
        let parent = _obj.SuperClass && _obj.SuperClass.prototype;

        args.forEach(function (val) {
            // Transform functions to Objects
            let obj = _fnval(val, [_obj, _obj.constructor], _obj.prototype);

            // Iterate through Object
            keys(obj).forEach(function (i) {
                let _val = obj[i], preVal = _val, $$val = {
                    enumerable: true,
                    configurable: true
                };

                // If a Parent Class is Present, Set any argument/params named `$super` to the `Parent`
                if (_is.fn(preVal)) {
                    if (parent && _argNames(preVal)[0] == "$super") {
                        // Let the first argument be the original value
                        _val = function (...args) {
                            let parentFn = parent[i].bind(this);
                            return preVal.call(this, parentFn, ...args);
                        };
                    }

                    // For debugging purposes
                    _val.valueOf = preVal.valueOf.bind(preVal);
                    _val.toString = preVal.toString.bind(preVal);
                }

                /*
                    Allows the use of `Object.defineProperty`, if an Object has any of these
                    { $$prop: true, get: function () { ... }, set: function () { ... }, ... }
                */
                if (_is.def(_val) && _is.obj(_val) && _val.$$prop) {
                    assign($$val, {
                        set (v) { Object.defineProperty(this, i, { value: v }); },
                        get () { return this[i]; }
                    }, _removeProps(["$$prop"], _val));
                } else {
                    assign($$val, {
                        writable: true,
                        value: _val
                    });
                }

                Object.defineProperty(_prototype ? _obj.prototype : _obj, i, $$val);
            });
        });

        return _obj;
    };
};

// Set class prototype properties and methods
export let _method = _attachProp("prototype");

// Set static properties and methods
export let _static = _attachProp("static");

// Create a copy of static methods that can function as prototype methods
export let _alias = function (props = {}, opts) {
    let thisArg = opts && opts.thisArg || []; // This as first argument
    let chain = opts && opts.chain || [];
    let result = {},  _args;

    for (let i in props) {
        let val = props[i], toStr;

        if (_is.fn(val)) {
            // For more info: stackoverflow.com/questions/19696015
            result[i] = function (...args) {
                if (_is.fn(opts)) {
                    return opts.call(this, val, ...args);
                } else {
                    _args = thisArg.includes(i) ? [this, ...args] : args;
                    if (chain.includes(i)) {
                        val.apply(this, _args);
                        return this;
                    }

                    return val.apply(this, _args);
                }
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
export let _configAttr = function (attr = "get", type = "function") {
    return val => {
        let _val = val;
        if (type == "function") {
            _val = Function(`with (this) return ${val}`);
            _val.toString = val.toString;
        }

        return { $$prop: true, [attr]: _val };
    };
};

// Get and set property attributes
export let _get = _configAttr("get", "function");
export let _set = _configAttr("set", "function");

// Call the parent version of a method
export let _callsuper = function (obj, method, ...args) {
    let _parent = null, $ = obj, _const = $, _super = _const.SuperClass;

    // Climb prototype chain to find method not equal to callee's method
    while (_super) {
        let _method = _super.prototype[method];
        if ($[method] != _method)
            { _parent = _method; break; }

        $ = _super.prototype;
        _const = $.constructor;
        _super = _const.SuperClass;
    }

    if (!_parent) {
        console.error(`${method} method not found in prototype chain.`);
        return;
    }

    return _parent.apply(obj, args);
};

// All properties with the ability to use this as a first Argument
let _thisArgs = {
    fnval: _fnval,
    argNames: _argNames,
    method: _method,
    static: _static,
    path: _path,
    attr: _attr,
    alias: _alias,
    new: _new,
    callsuper: _callsuper
};

export let props = {
    _is,
    _fnval,
    _argNames,
    _method,
    _static,
    _path,
    _attr,
    _alias,
    _configAttr,
    _get,
    _set,
    _new,
    _callsuper,
    assign,
    keys
};

props = keys(props).reduce(function (acc, i) {
    i.charAt(0) == "_" && (acc[i.slice(1)] = props[i]);
    return acc;
}, props);

// Properties methods with Class support
export let aliasMethods = _alias(_thisArgs, function (val, ...args) {
    let _val = val.apply(this, [this, ...args]);
    return _val;
});

// Create classes
export let _create = function (...args) {
    let $class, subclass, parent, extend;

    // SubClass constructor
    subclass = function () { };

    // Set parent constructor
    if (_is.fn(args[0]) && keys(args[0].prototype || {}).length) {
        parent = args.shift();
    }

    // Class Object
    $class = function (..._args) {
        // Current Class
        if (!_is.inst(this, $class))
            { return _new($class, _args); }
        this._args = _args; // Arguments

        // Initialize Class
        return this.init.apply(this, this._args);
    };

    $class.SuperClass = parent; // Current Class's Parent if any
    $class.SubClasses = []; // List of SubClasses

    // Extend parent class, if any
    if (parent) {
        subclass.prototype = parent.prototype;
        $class.prototype = new subclass();
        if (!_is.arr(parent.SubClasses))
            parent.SubClasses = [];
        parent.SubClasses.push($class);
    }

    // Easily extend this class to create new subclasses
    extend = function (...args) {
        return _create.call(this, this, ...args);
    };

    // Extend Class
    assign($class, aliasMethods, { extend, create: _create });
    assign($class.prototype, $class);

    // Add Methods to Class
    $class.method(...args);

    // Set Current class type
    if (!$class.prototype._class) { $class.prototype._class = "New Class"; }

    if (!$class.prototype.init) { $class.prototype.init = function () { }; }
    else {
        // Set toString & toValue
        $class.toString = $class.prototype.init.toString;
        $class.toValue = $class.prototype.init.toValue;
    }

    // Set Class constructor
    $class.prototype.constructor = $class;
    return $class;
};

// Create classes
export let _class = _create;
assign(_class, props); // Extend _class
export default _class;