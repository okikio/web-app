// import swup from "swup";
// import el from "./components/ele";
// import _class from "./components/class";
import _event from "./components/event";
// import scrollPlugin from "@swup/scroll-plugin";
// import slideTheme from '@swup/slide-theme';
// import preload from '@swup/preload-plugin';
// import anime from "anime";

// let ele = new el("body");
let _log = (...args) => args.forEach(v => console.log(v));
_log(_event._static({})); // 
/*ele.set("style", {});
fetch("/assets/app.js")
	.then(console.log);*/

console.log({
	message: "Hello"
});
/*
new swup({
	requestHeaders: {
		"X-Requested-With": "swup", // So we can tell request comes from swup
		"x-partial": "swup" // Request a partial html page
	}
});*/
