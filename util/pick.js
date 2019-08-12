// Choose the defined value in a list of 2 values
module.exports = (a, b) => {
    return a == undefined || a == null ? b : a;
};