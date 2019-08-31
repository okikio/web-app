import swup from "swup";
import el from "./components/ele";
import { _log } from "./components/util";

// import preload from '@swup/preload-plugin';
// import './components/smoothstate';
// import _class from "./components/class";
// import _event from "./components/event";
// import scrollPlugin from "@swup/scroll-plugin";

let _copyright = el('#copyright-btn');
let _navbar = el('.navbar');
let _global = el(window);

let _height = _navbar.height();
let _focusPt = _height + 20;

_copyright.hover(function () {
    _copyright.addClass("btn-show").addClass("btn-round");
}, function () {
    _copyright.removeClass("btn-show").removeClass("btn-round");
});

_navbar.mousedown('.navbar-menu', function(e) {
    e.preventDefault();
    _navbar.toggleClass("navbar-show");
});

_global.scroll(() => {
    _navbar.toggleClass("navbar-focus", (_global.scrollTop() + _height) >= _focusPt);
    _navbar.hasClass("navbar-show") && _navbar.removeClass("navbar-show");
});

if (window._isModern) {
    let trans = new swup(/*{
        requestHeaders: {
            "X-Requested-With": "swup", // So we can tell request comes from swup
            "x-partial": "swup" // Request a partial html page
        },
        // plugins: [new preload()]
    }*/);


    // let _load = () => { };
    // _load();

    // this event runs for every page view after initial load
    //    trans.on('contentReplaced', _load);
}
