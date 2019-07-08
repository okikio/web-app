// The base for containers that add to the class attribute
module.exports = prefix => (...args) => {
    return args.length ? args.map(val => `${prefix}-${val}`).join(' ') : prefix;
};
