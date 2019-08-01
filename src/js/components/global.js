import _event from "./event";
const { readyState } = document;

// Global event Object
let _global = _event();
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

export default _global;