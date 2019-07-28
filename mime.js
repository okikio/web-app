const { lookup } = require("mime-types");
const axios = require("axios");
console.log(lookup("asdasd/assets/this.png"));

// https://res.cloudinary.com/okikio-assets/raw/upload/barba.js
axios.get("http://localhost:3000/js/app-modern.min.js", undefined) // media ? { responseType: 'arraybuffer' } : undefined
    .then(val => console.info(val.data))
    .catch(console.error);