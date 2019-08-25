const { fetch, Promise } = window;
const { body } = document;

let _src = v => `./js/${v}.min.js`;
try {
    let script = document.createElement("script");
    let isModern = fetch && Promise;

    let src = _src(isModern ? `app.modern` : 'polyfill');
    script.setAttribute("src", src);
    if (isModern) {
        fetch(src)
            .then(res => {
                if (!res.ok) {
                    console.log('Looks like there was a problem. Status Code: ', status);
                    return;
                }

                res.text().then(data => {
                    script.innerHTML = data;
                    body.appendChild(script);
                });
            })
            .catch(err => {
                console.log('Fetch Error: ', err);
            });
    } else {
        let src = _src('app');
        let newScript = document.createElement("script");
        newScript.setAttribute("src", src);

        body.appendChild(script);
        body.appendChild(newScript);
    }
} catch (e) {
    let err = "Your browser is outdated, I suggest updating or upgrading to a new one.";
    document.write(err);
    console.warn(err);
}