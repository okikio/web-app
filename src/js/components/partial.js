import { _is, keys, assign } from "./util";
import _global from "./global";
import _event from "./event";

let { state, replaceState, pushState } = window.history;
let { href, origin } = window.location;
let { title } = document;

// A transition manager [based on smoothState.js]
let _partial = _event.extend({
    _class: "Partial-Transition-Manager",
    defaults: {
        headers: {
            "x-partial": "html"
        },
        containers: ["[data-partial]"],
        anchors: `a[href^="${origin}"]:not([data-partial-default]), 
              a[href^="/"]:not([data-partial-default]), 
              a[href^="#"]:not([data-partial-default])`,
        enable: true,
        cache: true,
        events: {}
    },
    init(opts) {
        this.opts = assign({}, this.defaults, opts);
        this.scrollEle = null;
        this.transition = {};

        if (this.opts.enable) this.enable();
    },
    enable() {
        if (_is.undef(pushState)) return this;
    }
});
    
export default _partial;