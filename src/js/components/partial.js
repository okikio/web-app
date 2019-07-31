import _class, { _get } from "./class";
import { _is, keys, assign } from "./util";
import _event from "./event";

let { state, replaceState, pushState } = window.history;
let { href, origin } = window.location;
let { title } = document;

// A transition manager
let _partial = _class(_event, {
    _class: "Partial-Transition-Manager",
    defaults: {
        headers: {
            "x-partial": "html"
        },
        containers: ["[data-partial]"],
        ele: `a[href^="${origin}"]:not([data-partial-default]), 
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
    emit($super, evt, ...args) {
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.not("arr", evt)) { evt = [evt]; } // Set evt to an array
        
        // Added support pjax:events, and history:events
        evt.forEach($evt => {
            if (/pjax:/i.test($evt)) { 
                window.addEventListener($evt.replace(/pjax:/i, ""), () => {
                    $super($evt, ...args); 
                });
            } else if (/history:/i.test($evt)) { 
                $evt = $evt.toLowerCase();
                let [_url] = args;
                let historyState = assign({}, state, {
                    random: Math.random(),
                    source: "partialjs",
                    url: _url || href
                }, ...this.listenerValues($evt));

                if ($evt == "history:replace") {
                    replaceState(historyState, title, href);
                } else if ($evt == "history:push") {
                    pushState(historyState, title, href);
                }
            } else { $super(...args); }
        }, this);
    }
});
    
export default _partial;