import { assign } from "./util";
import _event from "./event";

const { readyState } = document;

// Global event Object
let _global = _event();
let _ready = (fn = () => {}) => {
    // Checking the document.readyState property. If it contains the string in (as in uninitialized and loading) set a timeout and check again. Otherwise, execute function. [stackoverflow.com/a/30319853]
    if (/in/.test(readyState)) {
        window.setTimeout(() => { _ready(fn); }, 9);
    } else { fn.call(this); }
    return this;
};

(() => {
    let _emit = () => { _global.emit("ready load"); };
    if (!/in/.test(readyState)) { _emit(); } 
    else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', _emit);
    } else {
      document.attachEvent('onreadystatechange', () => {
        if (!/in/.test(readyState)) _emit();
      });
    }
}) ();

_ready(() => { _global.emit("ready load"); });
export default _global;