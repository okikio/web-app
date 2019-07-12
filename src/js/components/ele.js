const { assign } = Object;
export default class El {
    constructor(el) {
        this.el = (el instanceof El) ? el.el : [...document.querySelectorAll(el)];
    }

    each(fn = () => {}) {
        this.el.forEach(fn.bind(this), this);
        return this;
    }

    set(prop, val) {
        return this.each(el => {
            switch (typeof val) {
                case 'object':
                    if (typeof el[prop] != 'object') this.el[prop] = {};
                    assign(el[prop], val);
                    break;
                case 'undefined':
                    el = prop;
                    break;
                default:
                    el[prop] = val;
            }
        });
    }
};