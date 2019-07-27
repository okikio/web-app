const { fetch, Promise } = window;
const { body } = document;

try {
    let script = document.createElement("script");
    let isModern = fetch && Promise;

    let src = `./js/app${isModern ? `-modern` : ''}.min.js`;
    script.setAttribute("src", src);
    body.appendChild(script);
} catch (e) {
    let err = "Your browser is outdated, I suggest updating or upgrading to a new one.";
    document.write(err);
    console.warn(err);
}