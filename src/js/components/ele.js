import _class, { _get, _is } from "./class"; 
import { assign } from "./util";
import _event from './event';
import anime from "animejs";

const { createElement, documentElement } = document;
const arrProto = Array.prototype;

let tagRE = /^<([\w-])\s*\/?>(?:<\/\1>|)$/;
let _qsa = (dom, sel) => [...dom.querySelectorAll(sel)];
let _matches = (ele, sel) => {
    let matchSel = ele.matches || ele.msMatchesSelector || ele.webkitMatchesSelector;
    if (matchSel) return matchSel.call(ele, sel);
};

let _contains = (parent, node) => {
    if (parent.contains) return parent !== node && parent.contains(node);
    while (node && (node = node.parentNode))
        if (node === parent) return true;
    return false;
};

let _closest = (ele, sel) => {
    do {
        if (_matches(ele, sel)) return ele;
        ele = ele.parentElement || ele.parentNode;
    } while (ele !== null && ele.nodeType === 1);
    return null;
};

let _createElem = sel => {
    let el = "div";
    if (_is.str(sel) && tagRE.test(sel)) {
        el = sel.replace(tagRE, "$1")
        return createElement(el);
    }
};

let _elem = sel => {
    if (_is.inst(sel, Ele)) { return sel.ele; } 
    else if (_is.arr(sel) || _is.inst(sel, NodeList)) { return [...sel]; }
    else if (_is.el(sel)) { return [sel]; } 
    else if (tagRE.test(sel)) { return [_createElem(sel)]; }
    return _qsa(document, sel);
};
// Element Object
let Ele = _class(_event, arrProto, {
    init(sel = '', opts = {}) {
        let $this = this;
        this.sel = _is.inst(sel, Ele) ? sel.ele : sel; // Selector
        this.ele = _elem(sel); // Element
        this.opts = opts; // Options

        for (let i = 0; i < this.len; i ++) 
            { this[i] = this.ele[i]; }
        
        /* 
        // Checking the document.readyState property. If it contains the string in (as in uninitialized and loading) set a timeout and check again. Otherwise, execute function. [stackoverflow.com/a/30319853]
        if (/in/.test(document.readyState)) {
            window.setTimeout(() => { this.ready(fn); }, 9);
        } else { fn.call(this); }
            setTimeout((() => { 
                this.emit("ready load".split(/\s/g), this) 
            }).bind(this), 0); */
        if (document.readyState == "complete" ||
            (document.readyState !== "loading" && 
            !document.documentElement.doScroll)) { 
            setTimeout((() => { 
                this.emit("ready load".split(/\s/g), this) 
            }).bind(this), 0); 
        } else {
            var handler = function() {
            document.removeEventListener("DOMContentLoaded", handler, false)
            window.removeEventListener("load", handler, false)
            callback($)
            }
            document.addEventListener("DOMContentLoaded", handler, false)
            window.addEventListener("load", handler, false)
        }
    },
    ready(fn) { return this.on(["ready", "load"], fn, this); },
    len: _get("ele.length"),
    x(el) { return this.clientRect(el).x; },
    y(el) { return this.clientRect(el).y; },
    width(el) { return this.clientRect(el).width; },
    height(el) { return this.clientRect(el).height; },
    clientRect(el) { return el.getBoundingClientRect(); },
    each: arrProto.forEach,
    style(ele, css = {}) {
        Object.assign(ele.style, css);
        return this;
    },
    animate(opt = {}) {
        anime({
            targets: this.sel,
            ...opt
        });
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