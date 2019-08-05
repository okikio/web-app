import _event from "./event";
const { readyState } = document;

// Global event Object
export let _global = _event();
(() => {
	let passive = false, opts = {}, noop = () => { };
	let _emit = () => { _global.emit("ready load"); };

	if (!/in/.test(readyState)) { _emit(); }
	else if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', _emit);
	} else {
		document.attachEvent('onreadystatechange', () => {
			if (!/in/.test(readyState)) _emit();
		});
	}

	// Based on [github.com/rafrex/detect-passive-events]
	opts = Object.defineProperty({}, "passive", {
		get: () => passive = { capture: false, passive: true }
	});

	window.addEventListener("PassiveEventTest", noop, opts);
	window.removeEventListener("PassiveEventsTest", noop, opts);

	for (let ev in _global._events) {
		if (ev != "scroll") {
			window.addEventListener(ev, e => { 
				_global.emit(ev, e); 
			});
		}
	}

	window.addEventListener('scroll', e => { 
		_global.emit("scroll", e); 
	}, passive);
})();