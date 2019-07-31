import _class, { _get, _is, _argNames, keys } from "./class";
import stringify from "../../../util/stringify";

// Event class
let _event = _class({
    _class: "Event", // Class name
    _events: {}, // Event info.
    _emit: [],  // Store events set to be emitted

    // Name of all event's
    _names: _get("Object.keys(_events)"),

    // Number of events
    _eventCount: _get("_names.length"),

    // Prepare the event
    _preEvent: function (evt) {
        if (!this._events[evt]) // List of event's
            { this._events[evt] = []; }
        return this._events[evt];
    },

    // Apply event as object
    _eventApp: function (callback, scope, event) {
        return {
            callback: callback,
            scope: scope || this,
            event: event
        };
    },

    // Add a listener for a given event
    on: function (evt, callback, scope) {
        let $Evt;
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.not("arr", evt) && _is.not("obj", evt)) { evt = [evt]; } // Set evt to an array

        // Loop through the list of events 
        evt.forEach(($evt, key) => {
            if (_is.obj(evt) && _is.not("arr", evt)) {
                $Evt = this._eventApp($evt, callback || this, key);
                this._preEvent(key).push($Evt); // Set event list
            } else {
                $Evt = this._eventApp(callback, scope, $evt);
                this._preEvent($evt).push($Evt); // Set event list
            }
        }, this);
        return this;
    },

    // Call all function(s) within an event
    emit: function (evt, ...args) {
        let $Evt, $args = args;
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.not("arr", evt)) { evt = [evt]; } // Set evt to an array

        // Loop through the list of events 
        evt.forEach($evt => {
            $Evt = this._preEvent($evt);
            if (!this._emit.includes($evt)) 
                { this._emit.push($evt); }

            $Evt.forEach(_evt => {
                $args = args;
                if (_argNames(_evt.callback)[0] == "$evt")
                    { $args = [_evt, ...args]; }
                _evt.callback.apply(_evt.scope, $args);
            }, this);
        }, this);
        return this;
    },

    // Removes a listener for a given event
    off: function (evt, callback, scope) {
        let $evt;
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.not("arr", evt) && _is.not("obj", evt)) { evt = [evt]; } // Set evt to an array

        let _off = (($evt, callback, scope) => {
            let _Evt = this._preEvent($evt);

            if (callback) {
                let i, app = this._eventApp(callback, scope || this, $evt);

                _Evt.forEach((val, _i) => {
                    if (stringify(val) == stringify(app)) { i = _i; }
                }, this);

                if (i > - 1) { _Evt.splice(i, 1); }
            } else { delete this._events[$evt]; }
        }).bind(this);

        keys(evt).forEach((key) => {
            $evt = evt[key];
            if (_is.obj(evt) && _is.not("obj", evt)) {
                _off(key, $evt, scope);
            } else { _off($evt, callback, scope); }
        }, this);
        return this;
    },

    // Adds a one time event listener for a given event
    once: function (evt, callback, scope) {
        if (_is.undef(evt)) { return; } // If there is no event break
        if (_is.not("arr", evt) && _is.not("obj", evt)) { evt = [evt]; } // Set evt to an array

        let $Fn = function (...args) {
            this.off(evt, $Fn, scope);
            callback.apply(scope, args);
        };

        this.on(evt, $Fn, scope);
        return this;
    },

    // List's all listeners for a given event
    listeners: function (evt) {
        let $Evt = this._preEvent(evt);
        if (!$Evt.length) { return []; }
        return $Evt.map(val => val.callback);
    },

    // List's all listener values for a given event
    listenerValues: function (evt, ...args) {
        let $Evt = this._preEvent(evt);
        if (!$Evt.length) { return []; }
        return $Evt.map(val => val.callback.call(val.scope, ...args));
    },

    // Clear all events
    clear: function ()
        { this._eventCount = 0; this._events = {}; return this; },

    // Clear all events
    clearListeners: function (evt)
        { this._events[evt] = []; return this; },

    // Alias for the `on` method
    add: _get("on"), 
    bind: _get("on"),

    // Alias for the `off` method
    remove: _get("off"), 
    unbind: _get("off"),

    // Alias for the `emit` method
    fire: _get("emit"),
    trigger: _get("emit"),

    // Alias for the `listeners` method
    callbacks: _get("listeners")
});
    
export default _event;