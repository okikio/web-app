import { _is, _path, _intersect, _fnval, _capital, timeline, remove, stagger, random, getOwnPropertyNames } from "./util";
import _event from './event';
import _class from "./class";

const { createElement, documentElement } = document;
const { _get } = _class;

let Ele;
let tagRE = /^\s*<(\w+|!)[^>]*>/;
let { applyNative, nativeEvents } = _event;
let _cssNumber = ["column-count", "columns", "font-weight", "line-height", "opacity", "z-index", "zoom"];
let _qsa = (dom = document, sel) => {
    let classes;
    if (!_is.str(sel) && sel.length == 0) return [];
    if (/^(#?[\w-]+|\.[\w-.]+)$/.test(sel)) {
        switch (sel.charAt(0)) {
            case '#':
                return [dom.getElementById(sel.substr(1))];
            case '.':
                classes = sel.substr(1).replace(/\./g, ' ');
                return [...dom.getElementsByClassName(classes)];
            default:
                return [...dom.getElementsByTagName(sel)];
        }
    }
    
    return [...dom.querySelectorAll(sel)];
};

// The matches() method checks to see if the Element would be selected by the provided selectorString -- in other words -- checks if the element "is" the selector.
let _matches = (ele, sel) => {
    let matchSel = ele.matches || ele.msMatchesSelector || ele.webkitMatchesSelector;
    if (matchSel) return matchSel.call(ele, sel);
};

// Check if the parent node contains the given DOM node. Returns false if both are the same node.
let _contains = (parent, node) => {
    if (parent.contains) return parent != node && parent.contains(node);
    while (node && (node = node.parentNode))
        if (node == parent) return true;
    return false;
};

// Support the Element Object as an Array
let _toArr = val => (_is.inst(val, Ele) ? val.toArray() : val);
let _concat = function (args) {
    [].map.call(args, val => _toArr(val));
    return [].concat.apply(_toArr(this), args);
};

// Create a flat Array
let _flatten = arr => (arr.length > 0 ? _concat.apply([], arr) : arr);

// Map Objects
let _map = (obj, fn, ctxt) => {
    return _flatten([].map.call(obj, fn, ctxt)
        .filter(item => _is.def(item)));
};

// Select all children of an element
let _children = el => {
    return 'children' in el ? [].slice.call(el.children) :
        _map(el.childNodes, node => {
            if (node.nodeType == 1) return node;
        });
};

// Allow default Array methods to work as Element Object methods
let arrProto = getOwnPropertyNames(Array.prototype)
.reduce(function (acc, i) {
    acc[i] = function (...args) {
        let _val = Array.prototype[i].apply(this, args);
        return _is.undef(_val) ? this : _val;
    };
    return acc;
}, {});

// Create an Element List from a HTML string
let _createElem = html => {
    let dom, container;
    container = createElement('div');
    container.innerHTML = '' + html;
    dom = [].slice.call(container.childNodes);
    dom.forEach(el => {
        container.removeChild(el);
    });

    return dom;
};

// Element selector
let _elem = sel => {
    if (_is.str(sel)) {
        sel = sel.trim();
        if (tagRE.test(sel)) { return _createElem(sel); }
        else { return _qsa(document, sel); }
    } else if (_is.inst(sel, Ele)) { return sel.ele; }
    else if (_is.arr(sel) || _is.inst(sel, NodeList)) 
        { return [...sel].filter(item => _is.def(item)); }
    else if (_is.obj(sel) || _is.el(sel)) { return [sel]; }
    else if (_is.fn(sel)) { Ele(document).ready(sel); }
    return [];
};

// Traverse DOM Depth First
let traverseDF = (_node, fn, childType = "childNodes") => {
    let recurse;
    // This is a recurse and immediately-invoking function
    recurse = node => { // Step 2
        node[childType] && node[childType].forEach(recurse, node); // Step 3
        fn.call(node, node); // Step 4
    };
    recurse(_node); // Step 1
};

// Quickly filter nodes by a selector 
let _filter = (nodes, sel) => !_is.def(sel) ? Ele(nodes) : Ele(nodes).filter(sel);

// Select all the different values in an Array, based on underscorejs
let _uniq = arr => {
    return [].filter.call(arr, (val, idx) => arr.indexOf(val) == idx);
};

// Quickly set the value of an attribute or remove the attribute completely from a node
let _setAttr = (node, name, value) => value == null ? node.removeAttribute(name) : node.setAttribute(name, value);

// Transform  string value to the proper type of value eg. "12" = 12, "[12, 'xyz']" = [12, 'xyz']
let _valfix = value => {
    let validTypes = /^true|false|null|undefined|\d+$/;
    let _fn = v => Function(`"use strict"; return ${v};`) ();
    let objectType = /^[[{]([\s\S]+)?[\]}]$/;
    try {
        return validTypes.test(value) ? _fn(value) : 
            objectType.test(value) ? JSON.parse(value.replace(/'/g, "\"")) : value;
    } catch (e) { return value; }
};

// Decide if the value deserves px at the 
let _maybeAddPx = (name, val) => {
    return _is.num(+val) && !_cssNumber.includes(name) ? `${val}px` : val;
};

// Element Object [Based on Zepto.js]
Ele = _event.extend(arrProto, {
    init(sel = '') {
        this.sel = sel; // Selector
        this.ele = _elem(this.sel); // Element

        for (let i = 0; i < this.length; i++) 
            this[i] = this.ele[i];
    },

    slice(...args) { return Ele([].slice.apply(this, args)); },
    map(fn) {
        return Ele(_map(this, (el, i) => fn.call(el, el, i), this));
    },

    on($super, evt, callback, scope) {
        let _same;
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.str(evt)) { evt = evt.split(/\s/g); }
        if (_is.not("arr", evt) && _is.not("obj", evt)) { evt = [evt]; } // Set evt to an array

        _same = _intersect(evt, nativeEvents);
        return this.forEach(function (el) {
            if (_same.length > 0) {
                _same.forEach(function (ev) {
                    applyNative(this, el, ev);
                }, this);
            }

            $super(evt, callback, scope || el);
        }, this);
    },

    length: _get("len"),
    len: _get("ele.length"),
    each(fn) {
        [].every.call(this, function (el, idx) 
            { return fn.call(el, el, idx) != false; });
        return this;
    },

    get(idx) {
        return _is.undef(idx) ? [].slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
    },
    nth: _get("get"),

    size() { return this.length; },
    toArray() { return this.get(); },
    remove() {
        return this.each(el => {
            if (_is.def(el.parentNode));
                el.parentNode.removeChild(el);
        });
    },

    not(sel) {
        let excludes, $this = this;
        return Ele(
            this.reduce(function (acc, el, idx) {
                if (_is.fn(sel) && _is.def(sel.call)) {
                    if (!sel.call(el, el, idx)) acc.push(el);
                } else {
                    excludes = _is.str(sel) ? $this.filter(sel) :
                        (_is.arrlike(sel) && _is.fn(sel.item)) ? [].slice.call(sel) : Ele(sel);
                    if (excludes.indexOf(el) < 0) acc.push(el);
                }
                return acc;
            }, [], this)
        );
    },

    filter(sel) {
        if (_is.fn(sel)) return this.not(this.not(sel));
        return [].filter.call(this, ele => _matches(ele, sel), this);
    },

    has(sel) {
        return this.filter(el => {
            return _is.obj(sel) ? _contains(el, sel) : Ele(el).find(sel).size();
        });
    },

    eq(idx) {
        return idx == -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
    },

    first() {
        let el = this.get(0);
        return el && !_is.obj(el) ? el : Ele(el);
    },

    last() {
        let el = this.get(-1);
        return el && !_is.obj(el) ? el : Ele(el);
    },

    find(sel) {
        let result, $this = this;
        if (!sel) result = Ele();
        else if (_is.obj(sel)) {
            result = Ele(sel).filter(el => {
                return [].some.call($this, parent => _contains(parent, el));
            });
        } else if (this.length == 1) { result = Ele(_qsa(this.get(0), sel)); }
        else { result = this.map(el => _qsa(el, sel)); }
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

    // `pluck` based on underscore.js, but way more powerful
    pluck(prop) { return this.map(el => _path(el, prop)); },
    parent(sel) {
        return _filter(_uniq(this.pluck('parentNode')), sel);
    },

    children(sel) {
        return _filter(this.map(el => _children(el)), sel);
    },

    contents() {
        return this.map(el => el.contentDocument || [].slice.call(el.childNodes));
    },

    siblings(sel) {
        return _filter(this.map(el =>
            [].filter.call(
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
                let originHTML = el.innerHTML;
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
        if (_is.str(name) && _is.undef(val)) {
            result = this.length && this.get(0).nodeType == 1 &&
                this.get(0).getAttribute(name);
            return !_is.nul(result) ? result : undefined;
        } else {
            return this.each((el, idx) => {
                if (el.nodeType != 1) return;
                if (_is.arr(name)) {
                    for (let i in name)
                        _setAttr(el, i, name[i]);
                } else {
                    _setAttr(el, name, _fnval(val, [idx, el.getAttribute(name)], el));
                }
            });
        }
    },

    removeAttr(name) {
        return this.each(el => {
            el.nodeType == 1 && name.split(' ')
                .forEach(attr => { _setAttr(el, attr); });
        });
    },

    data(name, value) {
        let attrName = `data-${name}`.toLowerCase();
        let data = _is.def(value) ? this.attr(attrName, value) : this.attr(attrName);
        return data != null ? _valfix(data) : undefined;
    },

    val(...args) {
        let [value] = args, _el;
        if (args.length) {
            if (_is.nul(value)) value = "";
            return this.each((el, idx) => {
                el.value = _fnval(value, [idx, el.value], el);
            });
        } else {
            _el = this.get(0);
            return _el && (_el.multiple ?
                Ele(_el).find('option').filter(el => el.selected).pluck('value') :
                _el.value);
        }
    },

    offset(coords) {
        let obj;
        if (coords) {
            return this.each((el, idx) => {
                let $this = Ele(el);
                let _coords = _fnval(coords, [idx, $this.offset()], el);
                let parentOffset = $this.offsetParent().offset();
                let props = {
                    top: _coords.top - parentOffset.top,
                    left: _coords.left - parentOffset.left
                };

                if ($this.style('position') == 'static') props.position = 'relative';
                $this.style(props);
            })
        }

        if (!this.length) return null;
        if (documentElement != this.get(0) && !_contains(documentElement, this.get(0)))
            return { top: 0, left: 0 };
        
        obj = this.get(0).getBoundingClientRect();
        return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
        };
    },

    style(...args) {
        let [prop, val] = args, css = '', key;
        if (args.length < 2) {
            let el = this.get(0);
            if (!el) return;
            if (_is.str(prop)) {
                return el.style[prop] || window.getComputedStyle(el, '').getPropertyValue(prop);
            } else if (_is.arr(prop)) {
                let props = {};
                let computedStyle = window.getComputedStyle(el, '');
                prop.forEach(_prop => {
                    props[_prop] = (el.style[_prop] || computedStyle.getPropertyValue(_prop))
                });
                return props;
            }
        }

        if (_is.str(prop)) {
            if (!val && val != 0) {
                this.each(el => { el.style.removeProperty(prop); });
            } else {
                css = prop + ":" + _maybeAddPx(prop, val);
            }
        } else {
            for (key in prop) {
                if (!prop[key] && prop[key] != 0) {
                    this.each(el => { el.style.removeProperty(key); });
                } else {
                    css += key + ':' + _maybeAddPx(key, prop[key]) + ';';
                }
            }
        }

        return this.each(el => { el.style.cssText += ';' + css; });
    },

    show: () => this.style("display", ""),
    hide: () => this.style("display", "none"),
    empty: () => this.each(el => { el.innerHTML = ''; }),
    index(el) {
        return el ? this.indexOf(Ele(el).get(0)) : this.parent().children().indexOf(this.get(0));
    },
    getAnime() { return this.timeline; },
    animate(opt = {}, offset) {
        opt = _fnval(opt, [{ stagger, remove, random }, offset], this);
        if (_is.undef(this.timeline)) { 
            this.timeline = timeline({
                targets: _toArr(this)
            });
        }

        let { play, ...opts } = opt;
        let tl = this.timeline;
        tl.add(opts, offset);
        _is.def(play) && (play && tl.play() || tl.pause());
        return this;
    }, 
}, 

// Generate shortforms for events eg. .click(), .hover(), etc... 
nativeEvents.reduce((acc, name) => {
    // Handle event binding
    acc[name] = function (...args) { return this.on(name, ...args); };
    return acc;
}, {
    hover(fnOver, fnOut) 
        { return this.mouseenter(fnOver).mouseleave(fnOut || fnOver); }
}), 

// Generate the `width` and `height` methods
['width', 'height'].reduce((acc, sz) => {
    let prop = _capital(sz);
    acc[sz] = function (value) {
        let offset, el = this.get(0);
        if (_is.undef(value)) {
            if (_is.win(el)) { 
                return el[`inner${prop}`];
            } else if (_is.doc(el)) {
                return el.documentElement[`scroll${prop}`];
            } else { return (offset = this.offset()) && offset[sz]; }
        } else {
            return this.each((_el, idx) => {
                el = Ele(_el);
                el.style(sz, _fnval(value, [idx, el[sz]()], _el));
            });
        }
    };

    return acc;
}, {}), 

// Generate the `after`, `prepend`, `before`, `append`, `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
[ 'after', 'prepend', 'before', 'append' ].reduce(function (acc, fn, idx) {
    let inside = idx % 2 //=> prepend, append
    acc[fn] = function (...args) {
        // Arguments can be nodes, arrays of nodes, Element objects and HTML strings
        let clone = this.length > 1;
        let nodes = _map(args, function (arg) {
            if (_is.arr(arg)) {
                return arg.reduce((acc, el) => {
                    if (_is.def(el.nodeType)) acc.push(el);
                    else if (_is.inst(el, Ele)) acc = acc.concat(el.get());
                    else if (_is.str(el)) acc = acc.concat(_createElem(el));
                    return acc;
                }, []);
            }

            return _is.obj(arg) || _is.nul(arg) ? arg : _createElem(arg);
        });

        return this.each(function (target) {
            let parent = inside ? target : target.parentNode;
            let parentInDoc = _contains(documentElement, parent);
            let next = target.nextSibling, first = target.firstChild;
            
            // Convert all methods to a "before" operation
            target = [next, first, target, null] [idx];
            nodes.forEach(function (node) {
                if (clone) node = node.cloneNode(true);
                else if (!parent) return Ele(node).remove();
                parent.insertBefore(node, target);
                
                if (parentInDoc) {
                    traverseDF(node, function (el) {
                        if (!_is.nul(el.nodeName) && el.nodeName.toUpperCase() == 'SCRIPT' &&
                            (!el.type || el.type == 'text/javascript') && !el.src) {
                            let target = el.ownerDocument ? el.ownerDocument.defaultView : window;
                            target.eval.call(target, el.innerHTML);
                        }
                    });
                }
            });
        });
    };

    // after    => insertAfter, prepend  => prependTo
    // before   => insertBefore, append   => appendTo
    acc[inside ? `${fn}To` : `insert${_capital(fn)}`] = function (html) {
        Ele(html) [fn] (this);
        return this;
    };

    return acc;
}, {}));

export default Ele;
