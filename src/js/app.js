import swup from "swup";
import el from "./components/ele";
import { _log } from "./components/util";
import preload from '@swup/preload-plugin';

// import './components/smoothstate';
// import _class from "./components/class";
// import _event from "./components/event";
// import scrollPlugin from "@swup/scroll-plugin";

let _navbar = el('.navbar');
let _global = el(window);

let _height = _navbar.height();
let _focusPt = _height + 20;
let _load;

_navbar.click('.navbar-menu', e => {
    e.preventDefault();
    _navbar.toggleClass("navbar-show");
});

_global.scroll(() => {
    _navbar.toggleClass("navbar-focus", (_global.scrollTop() + _height) >= _focusPt);
    _navbar.hasClass("navbar-show") && _navbar.removeClass("navbar-show");
});

_load = () => {
    let _copyright = el('.copyright-btn');
    let _img = el(".load-img");

    _img.each($img => {
        let img = el($img);
        let _core_img = img.find(".core-img").get(0);
        let _placeholder_img = img.find(".placeholder-img");

        _core_img.onload = function () {
            _placeholder_img.addClass("core-img-show");
        };
    });

    _copyright.hover(() => {
        _copyright.addClass("btn-show").addClass("btn-round");
    }, () => {
        _copyright.removeClass("btn-show").removeClass("btn-round");
    });
};

el(_load);

new swup({
    requestHeaders: {
        "X-Requested-With": "swup", // So we can tell request comes from swup
        "x-partial": "swup" // Request a partial html page
    },
    plugins: [new preload()]
})

// This event runs for every page view after initial load
.on('contentReplaced', _load);
