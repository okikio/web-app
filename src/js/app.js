import 'core-js-pure';
import swup from "swup";
import el from "./components/ele";
import { _log } from "./components/util";
// import './components/smoothstate';
// import _class from "./components/class";
// import _event from "./components/event";
// import scrollPlugin from "@swup/scroll-plugin";

import preload from '@swup/preload-plugin';
let _load = () => {
   let ele = el(`<a class='Name'>Hello</a>`);
   ele.prependTo("#swup");
   ele.on("click", function () {
      _log(this);
      el(this).animate({
         color: "#ffeeaa",
         translateX: 250
      });
   });

   el('main').find(`a.Name`).on("click mouseenter", () => {
      // e.preventDefault();
      _log("Name");
   });
};

 let trans = new swup({
	requestHeaders: {
		"X-Requested-With": "swup", // So we can tell request comes from swup
		"x-partial": "swup" // Request a partial html page
	},
	plugins: [new preload()]
});

_load();

// this event runs for every page view after initial load
trans.on('contentReplaced', _load);