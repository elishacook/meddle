(function ()
{
"use strict";

var Scalar = function (defaultValue)
{
    Object.defineProperty(this, '_value', {
        writable: true,
        enumerable: false,
        value: defaultValue === undefined ? null : defaultValue
    })
    
    Object.defineProperty(this, 'onchange', {
        writable: true,
        enumerable: false,
        value: undefined
    })
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
    }
}


var List = function (arr)
{
    Object.defineProperty(this, 'onchange', {
        writable: true,
        enumerable: false,
        value: undefined
    })
    
    if (arr)
    {
        Array.prototype.push.apply(this, arr)
    }
}
List.prototype = Object.create(Array.prototype, (function ()
{
    var props = 
    {
        remove:
        {
            enumerable: false,
            value: function ()
            {
                for (var i=0; i<arguments.length; i++)
                {
                    var index = this.indexOf(arguments[i])
                    
                    if (-1 < index)
                    {
                        this.splice(index, 1)
                    }
                }
            }
        }
    }
    
    var mutators = [
        'fill',
        'pop',
        'push',
        'reverse',
        'shift',
        'sort',
        'splice',
        'unshift'
    ]
    
    mutators.forEach(function (mutatorName)
    {
        if (Array.prototype[mutatorName] === undefined)
        {
            return
        }
        
        props[mutatorName] = 
        {
            enumerable: false,
            value: function ()
            {
                var retVal = Array.prototype[mutatorName].apply(this, arguments)
                
                if (this.onchange)
                {
                    var args = Array.prototype.slice.call(arguments)
                    args.unshift(mutatorName)
                    this.onchange.apply(undefined, args)
                }
                
                return retVal
            }
        }
    })
    
    return props
})())

var Record = function (attrs)
{
    var RecordClass = function ()
    {
        for (var n in attrs)
        {
            var attr = attrs[n]()
            attr.onchange = this.createChangeListener(n)
            
            if (attrs[n].type == Scalar)
            {
                this.createProperty(n, attr)
            }
            else
            {
                this[n] = attr
            }
        }
    }
    RecordClass.prototype = 
    {
        createProperty: function (name, scalar)
        {
            Object.defineProperty(this, name, 
            {
                get: function ()
                {
                    return scalar.get() 
                },
                
                set: function (value)
                {
                    return scalar.set(value)
                }
            })
        },
        
        createChangeListener: function (name)
        {
            return this.changeListener.bind(this, name)
        },
        
        changeListener: function ()
        {
            if (this.onchange)
            {
                this.onchange.apply(undefined, arguments)
            }
        }
    }
    
    for (var n in attrs)
    {
        RecordClass[n] = attrs[n]
    }
    
    return RecordClass
}

var makeFactory = function (constructor)
{
    return function ()
    {
        var args = Array.prototype.slice.call(arguments, 0),
            factory = function ()
            {
                var inst = Object.create(constructor.prototype)
                constructor.apply(inst, args)
                return inst
            }
        factory.type = constructor
        return factory
    }
}

var Meddle = {
    Scalar: makeFactory(Scalar),
    List: makeFactory(List),
    Record: Record
}

window.Meddle = Meddle

if (typeof define === "function")
{
    define(Meddle)
}

if (typeof module !== "undefined" && module.exports)
{
    module.exports = Meddle
}

if (window.angular !== undefined)
{
    angular.module('meddle', []).factory('Meddle', function () { return Meddle })
}

})();