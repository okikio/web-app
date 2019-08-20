import swup from "swup";
import el from "./components/ele";
// import _class from "./components/class";
// import _event from "./components/event";
// import scrollPlugin from "@swup/scroll-plugin";
// import slideTheme from '@swup/slide-theme';
// import preload from '@swup/preload-plugin';
let _load = () => {
	let _log = (...args) => args.forEach(v => console.log(v));
	let ele = el("<a>Hello</a>");
	ele.prependTo("#swup");
	ele.on("click", function () {
		_log(this);
		el(this).animate({
			color: "#ffeeaa",
			translateX: 250
		}); 
	});
};

let trans = new swup({
	requestHeaders: {
		"X-Requested-With": "swup", // So we can tell request comes from swup
		"x-partial": "swup" // Request a partial html page
	}
});

_load();

// this event runs for every page view after initial load
trans.on('contentReplaced', _load);