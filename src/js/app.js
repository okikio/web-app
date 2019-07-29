/*
// Feature detection
//
https://www.smashingmagazine.com/2018/10/smart-bundling-legacy-code-browsers/https://github.com/WICG/EventListenerOptions/blob/gh-pages/EventListenerOptions.polyfill.js
var passiveIfSupported = false;

try {
	window.addEventListener("test", null, Object.defineProperty({}, "passive", { get: function() { passiveIfSupported = { passive: true }; } }));
} catch(err) {}

window.addEventListener('scroll', function(event) {
	// do something
	// can't use event.preventDefault();
}, passiveIfSupported ); */

import el from "./components/ele";
import swup from "swup";
// import scrollPlugin from "@swup/scroll-plugin";
// import slideTheme from '@swup/slide-theme';
// import preload from '@swup/preload-plugin';
// import anime from "anime";

let ele = new el("body");
ele.set("style", {});
fetch("/assets/app.js")
	.then(console.log);

console.log({
	message: "Hello"
});

new swup({
	requestHeaders: {
		"X-Requested-With": "swup", // So we can tell request comes from swup
		"x-partial": "swup" // Request a partial html page
	}
});
