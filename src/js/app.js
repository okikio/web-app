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
import slideTheme from '@swup/slide-theme';
// import swupjs from "@swup/js-plugin"; '@swup/slide-theme'
// import anime from "anime";

let ele = new el("body");
ele.set("style", { });
fetch("/assets/app.js")
    .then(console.log);

console.log({
    message: "Hello"
});
/*
let options = [
    {
      from: '(.*)',
      to: '(.*)',
      in: function(next) {
        document.querySelector('#swup').style.opacity = 0;
        anime({
            targets: "#swup",
            duration: 500,
            opacity: 1,
            complete: next
        });
      },
      out: (next) => {
        document.querySelector('#swup').style.opacity = 1;
        anime({
            targets: "#swup",
            duration: 500,
            opacity: 0,
            complete: next
        });
      }
    }
  ];new swupjs(options)*/
new swup({
    plugins: [new slideTheme()]
});
