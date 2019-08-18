const { fetch, Promise } = window;
const { body } = document;

try {
    let script = document.createElement("script");
    let isModern = fetch && Promise;

    let src = `./js/app${isModern ? `.modern` : ''}.min.js`;
    script.setAttribute("src", src);
    if (isModern) {
        fetch(src)
            .then(res => {
                if (!res.ok) {
                    console.log('Looks like there was a problem. Status Code: ', status);
                    return;
                }
                
                res.text().then(data => {
                    window.eval.call(window, data);
                    script.innerHTML = data;
                    body.appendChild(script);
                });
            })
            .catch(err => {
                console.log('Fetch Error: ', err);
            });
    } else {
        body.appendChild(script);
    }
} catch (e) {
    let err = "Your browser is outdated, I suggest updating or upgrading to a new one.";
    document.write(err);
    console.warn(err);
}