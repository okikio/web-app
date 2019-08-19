import { _is, _fnval, _argNames, _path, _attr, _new, assign, keys, getOwnPropertyNames } from "./util";

// Attach properties to class prototype or the class itself
export let _attachProp = where => {
    let _prototype = where == "prototype";
    return (_obj, ...args) => {
        // If super class exists, set value of parent to `SuperClass` prototype
        let parent = _obj.SuperClass && (_prototype ? _obj.SuperClass.prototype : _obj.SuperClass);
        args.forEach(function (val) {
            // Transform functions to Objects
            let obj = _fnval(val, [_obj, _obj.constructor], _prototype ? _obj.prototype : _obj);

            // Iterate through Object
            keys(obj).forEach(function (i) {
                let _val = obj[i], preVal = _val;

                // If a Parent Class is Present, Set any argument/params named `$super` to the `Parent`
                if (_is.fn(preVal)) {
                    if (parent && _argNames(preVal) && _argNames(preVal)[0] == "$super") {
                        // Let the first argument be the original value
                        _val = function (...args) {
                            let parentFn = parent[i].bind(this);
                            console.log(parentFn)
                            return preVal.call(this, parentFn, ...args);
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
                if (_is.def(_val) && _is.obj(_val) && 
                    (_val.$$prop || _is.fn(_val.get) || _is.fn(_val.set)) && 
                    !_val._class) {
                    Object.defineProperty(_prototype ? _obj.prototype : _obj, i, _val);
                }
            }, this);
        }, _obj);
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
    let _keys = getOwnPropertyNames(props);
    let chain = opts && opts.chain || [];
    let result = {},  _args;

    for (let idx = 0; idx < _keys.length; idx ++) {
        let i = _keys[idx], val = props[i], toStr;
        
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
        return { [attr]: _val };
    };
};

// Get and set property attributes
export let _get = _configAttr("get", "function");
export let _set = _configAttr("set", "function");

// Call the parent version of a method
export let _callsuper = function (obj, method, ...args) {
    let _prototype = obj.prototype; // Only static methods have access to the prototype Object
    let _parent = null, $ = obj, _const = $, _super = _const.SuperClass;

    // Climb prototype chain to find method not equal to callee's method
    while (_super) {
        _super = (_prototype ? _super : _super.prototype);
        if ($[method] != _super[method]) { _parent = _super[method]; break; }

        $ = _super;
        _const = $.constructor;
        _super = _const.SuperClass;
    }

    if (!_parent) {
        console.error(`${method} method not found in prototype chain.`);
        return;
    }
    return (args.length > 0) ?
        _parent.apply(obj, args) : _parent.call(obj);
};

// All properties combined
let _props = {
    is: _is,
    fnval: _fnval,
    argNames: _argNames,
    method: _method,
    static: _static,
    path: _path,
    attr: _attr,
    alias: _alias,
    configAttr: _configAttr,
    get: _get,
    set: _set,
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
    ..._props
};

// Properties methods with Class support
export let aliasMethods = _alias(props, {
    thisArg: ["_new", "_attr", "_path", "_method", "_static", "_callsuper"]
});

// Create classes
export let _class = function (...args) {
    let Class, SubClass, Parent;

    // SubClass constructor
    SubClass = function () { };

    // Set parent constructor
    if (_is.fn(args[0]) || _is.arr(args[0].SubClasses)) {
        if (_is.arr(Class.SubClasses)) { Parent = Class; }
        else { Parent = args.shift(); }
    }

    // Class Object
    Class = function (..._args) {
        // Current Class
        if (_is.not("inst", this, Class)) { return _new(Class, _args); }
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
    assign(Class, aliasMethods);
    assign(Class.prototype, aliasMethods, {
        SuperClass: Class.SuperClass,
        SubClasses: Class.SubClasses
    });

    // Add Methods to Class
    _method(Class, ...args);

    // Set Current class type
    if (!Class.prototype._class) { Class.prototype._class = "New Class"; }

    // Set Class constructor
    Class.prototype.constructor = Class;
    if (!Class.prototype.init) { Class.prototype.init = function () { }; }
    else {
        // Set toString & toValue
        Class.toString = Class.prototype.init.toString;
        Class.toValue = Class.prototype.init.toValue;
    }

    return Class;
};

assign(_class, aliasMethods); // Extend _class
export default _class;