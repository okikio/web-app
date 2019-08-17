import swup from "swup";
// import el from "./components/ele";
// import scrollPlugin from "@swup/scroll-plugin";
// import slideTheme from '@swup/slide-theme';
// import preload from '@swup/preload-plugin';
// import anime from "anime";

/*
let ele = new el("body");
ele.set("style", {});
fetch("/assets/app.js")
	.then(console.log);*/

console.log({
	message: "Hello"
});

new swup({
	requestHeaders: {
		"X-Requested-With": "swup", // So we can tell request comes from swup
		"x-partial": "swup" // Request a partial html page
	}
});
