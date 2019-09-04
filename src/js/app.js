import swup from "swup";
import el from "./components/ele";
import { _log } from "./components/util";
import preload from '@swup/preload-plugin';
import scrollPlugin from "@swup/scroll-plugin";

// import './components/smoothstate';
// import _class from "./components/class";
// import _event from "./components/event";

let _backToTop = el('#back-to-top');
let _navbar = el('.navbar');
let _global = el(window);

let _height = _navbar.height();
let _focusPt = _height + 20;
let _load, _scroll, _scrollEle;

_scrollEle = window.document.scrollingElement || window.document.body || window.document.documentElement;
_scrollEle = el(_scrollEle);

_navbar.click('.navbar-menu', e => {
    e.preventDefault();
    _navbar.toggleClass("navbar-show");
});

_backToTop.click(e => {
    e.preventDefault();
    _scrollEle.animate({
        scrollTop: 0,
        duration: 500,
        easing: 'easeInOutQuad'
    });
});

_global.scroll(_scroll = () => {
    _navbar.toggleClass("navbar-focus", (_global.scrollTop() + _height) >= _focusPt);
    _navbar.hasClass("navbar-show") && _navbar.removeClass("navbar-show");
});

_load = () => {
    let _next_layer_btn = el(".next-layer"), _next_layer;
    let _img = el(".load-img");
    let _main = el(".main");
    _scroll();

    _img.each($img => {
        let img = el($img);
        let _core_img = img.find(".core-img").get(0);
        let _placeholder_img = img.find(".placeholder-img");

        if (_core_img.complete) {
            _placeholder_img.addClass("core-img-show");
        } else {
            _core_img.addEventListener("load", function () {
                _placeholder_img.addClass("core-img-show");
            }, false);
        }
    });

    _next_layer_btn.click((e, _el) => {
        e.preventDefault();
        _next_layer = el(_el).closest(".layer", _main).next(".layer");
        _scrollEle.animate({
            scrollTop: el(_next_layer).offset().top - _height,
            duration: 500,
            easing: 'easeInOutQuad'
        });
    });
};

_load();
new swup({
    requestHeaders: {
        "X-Requested-With": "swup", // So we can tell request comes from swup
        "x-partial": "swup" // Request a partial html page
    },
    plugins: [new preload(), new scrollPlugin({
        doScrollingRightAway: false,
        animateScroll: true,
        scrollFriction: 0.3,
        scrollAcceleration: 0.04,
    })]
})

// This event runs for every page view after initial load
.on('contentReplaced', _load);
