import _class, { _get, _is, _alias } from "./class";
import { _path, keys } from "./util";
import _global from './global';
import _event from './event';
import anime from "animejs";
const { createElement, documentElement } = document;

let Ele;
let tagRE = /^<([\w-])\s*\/?>(?:<\/\1>|)$/;
let _cssNumber = ["column-count", "columns", "font-weight", "line-height", "opacity", "z-index", "zoom"];
let _qsa = (dom, sel) => Ele(...dom.querySelectorAll(sel));

// The matches() method checks to see if the Element would be selected by the provided selectorString -- in other words -- checks if the element "is" the selector.
let _matches = (ele, sel) => {
    let matchSel = ele.matches || ele.msMatchesSelector || ele.webkitMatchesSelector;
    if (matchSel) return matchSel.call(ele, sel);
};

// Check if the parent node contains the given DOM node. Returns false if both are the same node.
let _contains = (parent, node) => {
    if (parent.contains) return parent !== node && parent.contains(node);
    while (node && (node = node.parentNode))
        if (node === parent) return true;
    return false;
};

// Creates elements
let _createElem = sel => {
    let el = "div";
    if (_is.str(sel) && tagRE.test(sel)) {
        el = sel.replace(tagRE, "$1")
        return createElement(el);
    }
};

// Element selector
let _elem = sel => {
    if (_is.inst(sel, Ele)) { return sel.ele; }
    else if (_is.arr(sel) || _is.inst(sel, NodeList)) { return [...sel]; }
    else if (_is.el(sel)) { return [sel]; }
    else if (tagRE.test(sel)) { return [_createElem(sel)]; }
    return _qsa(document, sel);
};

let arrProto = _alias(Array.prototype, (val, ...args) => {
    args = args.map(v => _is.fn(v) ? v.bind(this) : v, this);
    let _val = val.apply(this, args);
    return _is.inst(_val, Ele) ? Ele(_val) : (_is.undef(_val) ? this : _val);
});

let _filter = (nodes, sel) => _is.nul(sel) ? Ele(nodes) : Ele(nodes).filter(sel);
let _uniq = arr => { 
    return arrProto.filter.call(arr, (val, idx) => arr.indexOf(val) == idx); 
};

let _children = el => {
    return 'children' in el ? arrProto.slice.call(el.children) :
        arrProto.map.call(el.childNodes, node => { 
            if (node.nodeType == 1) return node; 
        });
}; 

let _maybeAddPx = (name, val) => {
    return (_is.num(val) && _cssNumber.includes(name)) ? `${val}px` : val;
};

// Element Object [Based on Zepto.js]
Ele = _class(_event, arrProto, {
    init(sel = '') {
        this.sel = _is.inst(sel, Ele) ? sel.ele : sel; // Selector
        this.ele = _elem(sel); // Element

        for (let i = 0; i < this.len; i++) { this[i] = this.ele[i]; }

        this.timeline = anime.timeline({
            targets: this.ele,
            autoplay: false
        });

        _global.on("ready load", () => {
            this.emit("ready load", Ele);
        }, this);
    },
    
    on($super, evt, ...args) {
        $super(evt, ...args);
        let $evt, emit = this.emit;
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.str(evt)) { evt = evt.split(/\s/g); }
        if (_is.not("arr", evt) && _is.not("obj", evt)) { evt = [evt]; } // Set evt to an array
        
        // Added support for native:events
        keys(evt).forEach(key => {
            $evt = evt[key];
            if (/native:/i.test($evt)) { 
                this.each(el => {
                    el.addEventListener(
                        $evt.replace(/native:/i, ""), 
                        (..._args) => { emit($evt, ..._args); }
                    );
                });
            }
        }, this);
        return this;
    },

    ready(fn) { return this.on("ready load", fn, this); },
    length: _get("ele.length"),
    each(fn) {
        arrProto.call(this, (el, idx) => fn.call(el, el, idx) != false);
        return this;
    },

    get(idx) {
        return _is.undef(idx) ? this.slice() : this[idx >= 0 ? idx : idx + this.length];
    },
    nth: _get("get"),

    len() { return this.length; },
    size() { return this.len(); },
    toArray() { return this.get(); },
    remove() {
        return this.each(el => {
            if (el.parentNode != null)
                el.parentNode.removeChild(el);
        });
    },

    not(sel) {
        let excludes;
        return Ele(
            this.reduce((acc, el, idx) => {
                if (_is.fn(sel) && _is.def(sel.call)) {
                    if (!sel.call(el, idx, el)) acc.push(el);
                } else {
                    excludes = _is.str(sel) ? this.filter(sel) :
                        (_is.arrlike(sel) && _is.fn(sel.item)) ? arrProto.slice.call(sel) : Ele(sel);
                    if (excludes.indexOf(el) < 0) acc.push(el);
                }
                return acc;
            }, [])
        );
    },

    filter(sel) {
        if (_is.fn(sel)) return this.not(this.not(sel));
        return arrProto.filter.call(this, ele => _matches(ele, sel), this);
    },

    has(sel) {
        return this.filter(() => {
            return _is.obj(sel) ? _contains(this, sel) : Ele(this).find(sel).size();
        });
    },

    eq(idx) {
        return idx == -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
    },

    first() {
        var el = this.get(0)
        return el && !_is.obj(el) ? el : Ele(el)
    },

    last() {
        let el = this.get(-1);
        return el && !_is.obj(el) ? el : Ele(el)
    },

    find(sel) {
        let result, $this = this;
        if (!sel) { result = Ele(); }
        else if (_is.obj(sel)) {
            result = Ele(sel).filter((_, el) => {
                return arrProto.some.call($this, parent => _contains(parent, el));
            });
        } else if (this.len() == 1) { result = Ele(_qsa(this[0], sel)); }
        else { result = this.map(() => _qsa(this, sel)); }
        return result;
    },

    closest(sel, ctxt) {
        let list = _is.obj(sel) && Ele(sel);
        return Ele(
            this.reduce((acc, ele) => {
                do {
                    if (list ? list.indexOf(ele) >= 0 : _matches(ele, sel)) break;
                    ele = ele != ctxt && _is.not("doc", ele) && ele.parentNode;
                } while (ele !== null && ele.nodeType === 1);
                if (ele && acc.indexOf(ele) < 0) acc.push(ele);
                return acc;
            }, [])
        );
    },

    parents(sel) {
        let ancestors = [], nodes = this;
        while (nodes.length > 0) {
            nodes = nodes.map(el => {
                if ((el = el.parentNode) && !_is.doc(el) && ancestors.indexOf(el) < 0) {
                    ancestors.push(el);
                    return el;
                }
            });
        }
        return _filter(ancestors, sel);
    },

    // `pluck`; based on underscore.js, but way more powerful
    pluck(prop) { return this.map(el => _path(el, prop)); },
    parent(sel) {
        return _filter(_uniq(this.pluck('parentNode')), sel);
    },

    children (sel) {
        return _filter(this.map(el => _children(el)), sel);
    },

    contents () {
        return this.map(el => el.contentDocument || arrProto.slice.call(el.childNodes));
    },
    
    siblings (sel) {
        return _filter(this.map(el => 
            arrProto.filter.call(
                _children(el.parentNode), 
                child => (child != el)
            )
        ), sel);
    },

    replaceWith: content => this.before(content).remove(),
    clone: () => this.map(el => el.cloneNode(true)),

    toggle(opt) {
        return this.each(el => {
            let _el = Ele(el);
            let _opt = opt || el.style("display") == "none";
            _el[_opt ? "show" : "hide"]();
        });
    },

    prev: sel => Ele(this.pluck('previousElementSibling')).filter(sel || '*'),
    next: sel => Ele(this.pluck('nextElementSibling')).filter(sel || '*'),
    html(...args) {
        let [html] = args;
        return args.length ?
            this.each((el, idx) => {
                let originHtml = el.innerHTML;
                Ele(el).empty().append(_fnval(html, [idx, originHTML], el));
            }) : (this.length ? this.get(0).innerHTML : null);
    },
    text(...args) {
        let [text] = args;
        return args.length ?
            this.each((el, idx) => {
                let newText = _fnval(text, [idx, el.textContent], el);
                el.textContent = _is.nul(newText) ? '' : `${newText}`;
            }) : (this.length ? this.pluck('textContent').join("") : null);
    },
    attr(name, val) {
        let result;
        
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
        return (_is.str(name) && _is.undef(val)) ?
            (this.length && this.get(0).nodeType == 1 && (result = this.get(0).getAttribute(name)) != null ? result : undefined) :
            this.each(function (idx) {
                if (this.nodeType !== 1) return
                if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
                else setAttribute(this, name, funcArg(this, val, idx, this.getAttribute(name)))
            })
    },
    removeAttr: function (name) {
        return this.each(function () {
        this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
            setAttribute(this, attribute)
        }, this)
        })
    },
    prop: function (name, value) {
        name = propMap[name] || name
        return (typeof name == 'string' && !(1 in arguments)) ?
            (this[0] && this[0][name]) :
            this.each(function (idx) {
                if (isObject(name)) for (key in name) this[propMap[key] || key] = name[key]
                else this[name] = funcArg(this, value, idx, this[name])
            })
    },
    removeProp: function (name) {
        name = propMap[name] || name
        return this.each(function () { delete this[name] })
    },
    data: function (name, value) {
        let attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

        let data = (1 in arguments) ?
            this.attr(attrName, value) :
            this.attr(attrName)

        return data !== null ? deserializeValue(data) : undefined
    },
    val: function (value) {
        if (0 in arguments) {
            if (value == null) value = ""
            return this.each(function (idx) {
                this.value = funcArg(this, value, idx, this.value)
            })
        } else {
            return this[0] && (this[0].multiple ?
                $(this[0]).find('option').filter(function () { return this.selected }).pluck('value') :
                this[0].value)
        }
    },
    offset: function (coordinates) {
        if (coordinates) return this.each(function (index) {
            let $this = $(this),
                coords = funcArg(this, coordinates, index, $this.offset()),
                parentOffset = $this.offsetParent().offset(),
                props = {
                    top: coords.top - parentOffset.top,
                    left: coords.left - parentOffset.left
                }

            if ($this.css('position') == 'static') props['position'] = 'relative'
            $this.css(props)
        })
        if (!this.length) return null
        if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0]))
            return { top: 0, left: 0 }
        let obj = this[0].getBoundingClientRect()
        return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
        }
    },
    css: function (property, value) {
        if (arguments.length < 2) {
            let element = this[0]
            if (typeof property == 'string') {
                if (!element) return
                return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
            } else if (isArray(property)) {
                if (!element) return
                let props = {}
                let computedStyle = getComputedStyle(element, '')
                $.each(property, function (_, prop) {
                    props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
                })
                return props
            }
        }

        var css = ''
        if (type(property) == 'string') {
            if (!value && value !== 0)
                this.each(function () { this.style.removeProperty(dasherize(property)) })
            else
                css = dasherize(property) + ":" + maybeAddPx(property, value)
        } else {
            for (key in property)
                if (!property[key] && property[key] !== 0)
                    this.each(function () { this.style.removeProperty(dasherize(key)) })
                else
                    css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
        }

        return this.each(function () { this.style.cssText += ';' + css })
    },

    show: () => this.style("display", ""),
    hide: () => this.style("display", "none"),
    empty: () => this.each(el => { el.innerHTML = ''; }),
    index: function (element) {
        return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },

    x(el) { return this.clientRect(el).x; },
    y(el) { return this.clientRect(el).y; },
    width(el) { return this.clientRect(el).width; },
    height(el) { return this.clientRect(el).height; },
    clientRect(el) { return el.getBoundingClientRect(); },
    style(ele, css = {}) {
        Object.assign(ele.style, css);
        return this;
    },
    animate(opt = {}, offset) {
        let tl = this.timeline;
        tl.add(opt, offset);
        _is.def(opt.play) && (opt.play && tl.play() || tl.pause());
        return this;
    },
    click(fn = () => { }) {
        return this.each(function (ele) {
            ele.onclick = fn.bind(this);
        }, this);
    },
    hover(fn = () => { }) {
        return this.each(function (ele) {
            ele.onmouseover = fn.bind(this);
        }, this);
    },
    mousemove(fn = () => { }) {
        return this.each(function (ele) {
            ele.addEventListener("mousemove", fn.bind(this));
        }, this);
    },
    intersect($this, el) {
        return (
            this.x($this) < this.x(el) + this.width(el) &&
            this.x(el) < this.x($this) + this.width($this) &&
            this.y($this) < this.y(el) + this.height(el) &&
            this.y(el) < this.y($this) + this.height($this)
        );
    }
}, () => {
    return `blur focus focusin focusout resize scroll click dblclick 
	        mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave 
            change select submit keydown keypress keyup contextmenu`.split(" ")
     .reduce((acc, name) => {
	    // Handle event binding
        acc[name] = (data, fn) => {
            return arguments.length > 0 ?
                this.on(name, null, data, fn) :
                this.emit(name);
        };
    }, {
        hover(fnOver, fnOut) {
            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        }
    });
}, () => {

    // Generate the `width` and `height` functions
    ['width', 'height'].forEach(function (dimension) {
        var dimensionProperty =
            dimension.replace(/./, function (m) { return m[0].toUpperCase() })

        $.fn[dimension] = function (value) {
            var offset, el = this[0]
            if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
                isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
                    (offset = this.offset()) && offset[dimension]
            else return this.each(function (idx) {
                el = $(this)
                el.css(dimension, funcArg(this, value, idx, el[dimension]()))
            })
        }
    })

    function traverseNode(node, fun) {
        fun(node)
        for (var i = 0, len = node.childNodes.length; i < len; i++)
            traverseNode(node.childNodes[i], fun)
    }

    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function (operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $.fn[operator] = function () {
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var argType, nodes = $.map(arguments, function (arg) {
                var arr = []
                argType = type(arg)
                if (argType == "array") {
                    arg.forEach(function (el) {
                        if (el.nodeType !== undefined) return arr.push(el)
                        else if ($.zepto.isZ(el)) return arr = arr.concat(el.get())
                        arr = arr.concat(zepto.fragment(el))
                    })
                    return arr
                }
                return argType == "object" || arg == null ?
                    arg : zepto.fragment(arg)
            }),
                parent, copyByClone = this.length > 1
            if (nodes.length < 1) return this

            return this.each(function (_, target) {
                parent = inside ? target : target.parentNode

                // convert all methods to a "before" operation
                target = operatorIndex == 0 ? target.nextSibling :
                    operatorIndex == 1 ? target.firstChild :
                        operatorIndex == 2 ? target :
                            null

                var parentInDocument = $.contains(document.documentElement, parent)

                nodes.forEach(function (node) {
                    if (copyByClone) node = node.cloneNode(true)
                    else if (!parent) return $(node).remove()

                    parent.insertBefore(node, target)
                    if (parentInDocument) traverseNode(node, function (el) {
                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                            (!el.type || el.type === 'text/javascript') && !el.src) {
                            var target = el.ownerDocument ? el.ownerDocument.defaultView : window
                            target['eval'].call(target, el.innerHTML)
                        }
                    })
                })
            })
        }

        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
            $(html)[operator](this)
            return this
        }
    return ["before"].reduce(() => {

    })
});

export default Ele;
/*export default class El {
    constructor(el) {
        this.el = (el instanceof El) ? el.el : [...document.querySelectorAll(el)];
    }

    each(fn = () => {}) {
        this.el.forEach(fn.bind(this), this);
        return this;
    }

    set(prop, val) {
        return this.each(el => {
            switch (typeof val) {
                case 'object':
                    if (typeof el[prop] != 'object') this.el[prop] = {};
                    assign(el[prop], val);
                    break;
                case 'undefined':
                    el = prop;
                    break;
                default:
                    el[prop] = val;
            }
        });
    }
};*/