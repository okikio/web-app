import el from "./el";

// Window element Object
export let _global = el(window);
export let _document = el(document);
export let _body = el("html, body");
export let _el = el;
export default _global;