import swup from "swup";
import el from "./components/ele";
import { _log } from "./components/util";
// import './components/smoothstate';
// import _class from "./components/class";
// import _event from "./components/event";
// import scrollPlugin from "@swup/scroll-plugin";

import preload from '@swup/preload-plugin';
let _load = () => {
   let ele = el(`<a class='name'>Hello</a>`);

   let _navbar = el('.navbar');
   let _global = el(window);
   let _height = _navbar.height() * 2;

   ele.prependTo("#swup");
   ele.on("click", function () {
       el(this).animate({
           direction: 'alternate',
           color: ["#ff0266", "#00eeaa"],
           translateX: [0, 250]
       });
   });

   el('.navbar-menu').click(function (e) {
       e.preventDefault();
       _navbar.toggleClass("navbar-show");
   });

   el('main').find(`a.name`).on("click mouseenter", () => { _log(`Link - Hover/Clicked`); });

   _global.scroll(function () {
       _navbar.toggleClass("navbar-focus", _global.scrollTop() > _height);
       _navbar.hasClass("navbar-show") && _navbar.removeClass("navbar-show");
   });
};

_load();

if (window._isModern) {
   let trans = new swup({
      requestHeaders: {
         "X-Requested-With": "swup", // So we can tell request comes from swup
         "x-partial": "swup" // Request a partial html page
      },
      plugins: [new preload()]
   });

   // this event runs for every page view after initial load
   trans.on('contentReplaced', _load);
}
