// The base for containers that add to the class attribute
module.exports = prefix => (...args) => {
    return args.map(val => `${prefix}-${val}`).join(' ');
};
