(function ()
{
"use strict";

var Scalar = function (defaultValue)
{
    this._value = defaultValue === undefined ? null : defaultValue
}
Scalar.prototype = 
{
    get: function ()
    {
        return this._value
    },
    
    set: function (value)
    {
        var oldValue = this._value
        this._value = value
        
        if (this.onchange)
        {
            this.onchange(oldValue, value)
        }
    },
    
    onchange: null
}


var Model = 
{
    create: function ()
    {
        return {}
    }
}

var Meddle = {
    Scalar: Scalar,
    Model: Model
}

window.Meddle = Meddle


})();