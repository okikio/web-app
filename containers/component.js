// The base component layer and layout inherit from, allows for components as children
module.exports = type => (...props) => (
    {
        "type": type,
        ...Object.assign.apply(null, [{}].concat(props))
    }
);
