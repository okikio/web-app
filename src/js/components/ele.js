import _class, { _get, _is, _alias } from "./class"; 
import { assign } from "./util";
import _global from './global';
import _event from './event';
import anime from "animejs";
const { createElement, documentElement } = document;

let Ele;
let arrProto = _alias(Array.prototype, (val, ...args) => {
    args = args.map(v => _is.fn(v) ? v.bind(this) : v, this);
    let _val = val.apply(this, args);
    return _is.inst(_val, Ele) ? Ele(_val) : (_is.undef(_val) ? this : _val);
});

let tagRE = /^<([\w-])\s*\/?>(?:<\/\1>|)$/;
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

// Element Object [Based on Zepto.js]
Ele = _class(_event, arrProto, {
    init(sel = '') {
        this.sel = _is.inst(sel, Ele) ? sel.ele : sel; // Selector
        this.ele = _elem(sel); // Element

        for (let i = 0; i < this.len; i ++) 
            { this[i] = this.ele[i]; }
            
        this.timeline = anime.timeline({
            targets: this.ele,
            autoplay: false
        });

        _global.on("ready load", () => {
            this.emit("ready load", Ele);
        }, this);

    },

    ready (fn) { return this.on("ready load", fn, this); },
    length: _get("ele.length"),
    each (fn) {
        arrProto.call(this, (el, idx) => fn.call(el, idx, el) != false);
        return this;
    }, 

    get (idx) {
        return _is.undef(idx) ? this.slice() : this[idx >= 0 ? idx : idx + this.length]
    },
    nth: _get("get"),

    len () { return this.length; },
    size () { return this.len(); },
    toArray () { return this.get(); },
    remove () {
        return this.each(() => {
            if (this.parentNode != null)
                this.parentNode.removeChild(this);
        });
    },
    
    not (sel) {
        /*
         let excludes;
         return Ele(
            this.reduce((acc, el, idx) => {
                if (_is.fn(sel) && _is.def(sel.call)) {
                    if (!sel.call(el, idx)) acc.push(el);
                } else {
                    excludes = _is.str(sel) ? this.filter(sel) :
                        (_is.arrlike(sel) && _is.fn(sel.item)) ? [].slice.call(sel) : Ele(sel);
                    if (excludes.indexOf(el) < 0) acc.push(el);
                }
                return acc;
            })
        )  
        */
        let nodes = [];
        if (_is.fn(sel) && _is.def(sel.call)) {
            this.each(idx => {
                if (!sel.call(this, idx)) nodes.push(this);
            });
        } else {
            let excludes = _is.str(sel) ? this.filter(sel) :
                (_is.arrlike(sel) && _is.fn(sel.item)) ? [].slice.call(sel) : Ele(sel);
            this.forEach(el => {
                if (excludes.indexOf(el) < 0) nodes.push(el)
            })
        }
        return Ele(nodes);
    },
    filter (sel) {
        if (_is.fn(sel)) return this.not(this.not(sel));
        return arrProto.filter.call(this, ele => _matches(ele, sel), this);
    },

    has (sel) {
        return this.filter(() => {
            return _is.obj(sel) ? _contains(this, sel) : Ele(this).find(sel).size();
        });
    },
    eq (idx) {
        return idx == -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
    },
    first () {
        var el = this.get(0)
        return el && !_is.obj(el) ? el : Ele(el)
    },
    last () {
        let el = this.get(-1);
        return el && !_is.obj(el) ? el : Ele(el)
    },

    find (sel) {
        let result, $this = this, node;
        if (!sel) { result = Ele(); }
        else if (_is.obj(sel)) {
            result = Ele(sel).filter(() => {
                node = this;
                return arrProto.some.call($this, parent => {
                    return _contains(parent, node);
                });
            });
        } else if (this.len() == 1) { result = Ele(_qsa(this[0], sel)); }
        else { result = this.map(() => _qsa(this, sel)); }
        return result;
    },

    closest (sel, ctxt) {
        let list = _is.obj(sel) && Ele(sel);
       /* 
       nodes = [], 
       this.forEach(node => {
            while (node && !(list ? list.indexOf(node) >= 0 : _matches(node, sel))) {
                node = node != ctxt && _is.notInst(node, Document) && node.parentNode
            }
            if (node && nodes.indexOf(node) < 0) 
                { nodes.push(node); }
        });*/
        return Ele(
            this.reduce((acc, ele) => {
                do {
                    if (list ? list.indexOf(ele) >= 0 : _matches(ele, sel)) break;
                    ele = ele != ctxt && _is.notInst(ele, Document) && 
                         (ele.parentElement || ele.parentNode);
                } while (ele !== null && ele.nodeType === 1);
                if (ele && acc.indexOf(ele) < 0) { acc.push(ele); }
                return acc;
            })
        );
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
    click(fn = () => {}) {
        return this.each(function(ele) {
            ele.onclick = fn.bind(this);
        }, this);
    },
    hover(fn = () => {}) {
        return this.each(function(ele) {
            ele.onmouseover = fn.bind(this);
        }, this);
    },
    mousemove(fn = () => {}) {
        return this.each(function(ele) {
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