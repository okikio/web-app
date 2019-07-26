// import "core-js/stable";
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
let ele = new el("body");
ele.set("style", { });
fetch("/assets/raw/barba.js")
    .then(console.log);

console.log({
    message: "Hello"
});