describe("Meddle", function ()
{
    describe("Scalar", function ()
    {
        var stubFunctions
        
        beforeEach(function ()
        {
            stubFunctions = {
                onchange: function (oldValue, newValue) {}
            }
            
            for (var n in stubFunctions)
            {
                spyOn(stubFunctions, n)
            }
        })
        
        it("has a get method", function ()
        {
            var foo = Meddle.Scalar()()
            expect(foo.set).toBeDefined()
            expect(foo.set instanceof Function).toBeTruthy()
        })
        
        it("has a default value of null", function ()
        {
            var foo = Meddle.Scalar()(),
                val = foo.get()
                
            expect(val).toBeDefined()
            expect(val).toBeNull()
        })
        
        it("has a set method", function ()
        {
            var foo = Meddle.Scalar()()
            expect(foo.set).toBeDefined()
            expect(foo.set instanceof Function).toBeTruthy()
        })
        
        it("can have its value set", function ()
        {
            var foo = Meddle.Scalar()()
            foo.set('bar')
            expect(foo.get()).toEqual('bar')
        })
        
        it("can have a default value", function ()
        {
            var foo = Meddle.Scalar(23)()
            expect(foo.get()).toEqual(23)
        })
        
        it("notifies a change listener when value is set", function ()
        {
            var foo = Meddle.Scalar()()
            foo.onchange = stubFunctions.onchange
            foo.set(777)
            expect(stubFunctions.onchange).toHaveBeenCalled()
        })
        
        it("provides the old and new values to the change listener", function ()
        {
            var foo = Meddle.Scalar(666)()
            foo.onchange = stubFunctions.onchange
            foo.set(777)
            expect(stubFunctions.onchange).toHaveBeenCalledWith(666, 777)
        })
    })

    describe("List", function ()
    {
        it("can have items added to it", function ()
        {
            var foos = Meddle.List()()
            foos.push(1, 2, 3)
            expect(foos).toEqual([1,2,3])
        })
        
        it("can have items removed from it", function ()
        {
            var foos = Meddle.List()()
            foos.push(1, 2, 3)
            foos.remove(2, 1)
            expect(foos).toEqual([3])
        })
        
        it("can do other array things", function ()
        {
            var foos = Meddle.List()()
            foos.push(1,2,3)
            var squaredArray = foos.map(function (x) { return x * x })
            expect(squaredArray).toEqual([1,4,9])
        })
        
        it("can be initialized with an existing array", function ()
        {
            var foos = Meddle.List([1,2,3])()
            expect(foos).toEqual([1,2,3])
        })
        
        it("notifies a change listener when modified", function ()
        {
            var mutatingFunctions = {
                    fill: [0],
                    pop: [],
                    push: [1],
                    reverse: [],
                    shift: [],
                    sort: [],
                    splice: [0,1],
                    unshift: [1]
                }
            
            for (var n in mutatingFunctions)
            {
                var spy = jasmine.createSpy(n+"ChangeListener"),
                    foo = Meddle.List([1,2,3])()
                    
                foo.onchange = spy
                
                if (foo[n] !== undefined)
                {
                    foo[n].apply(foo, mutatingFunctions[n])
                    expect(spy).toHaveBeenCalled()
                }
            }
        })
        
        it("passes the modification method name and arguments to the change listener", function ()
        {
            var foo = Meddle.List([1,2,3])()
            foo.onchange = jasmine.createSpy("changeListener")
            foo.push(23)
            expect(foo.onchange).toHaveBeenCalledWith('push', 23)
        })
    })
    
    describe("Record", function ()
    {
        it("can create new classes", function ()
        {
            var Foo = Meddle.Record()
            expect(Foo).toBeDefined()
            expect(Foo).not.toBeNull()
        })
        
        it("can be initialized with a number of fields", function ()
        {
            var bar = Meddle.Scalar(123),
                baz = Meddle.List([1,2,3]),
                Foo = Meddle.Record({
                    bar: bar,
                    baz: baz
                })
            expect(Foo.bar).toBe(bar)
            expect(Foo.baz).toBe(baz)
        })
        
        it("can generate instances", function ()
        {
            var Foo = Meddle.Record({
                    bar: Meddle.Scalar(123),
                    baz: Meddle.List([1,2,3])
                }),
                f = new Foo()
                
            expect(f.bar).toEqual(123)
            expect(f.baz).toEqual([1,2,3])
        })
        
        it("has a change listener that fires when a scalar property changes", function ()
        {
            var Foo = Meddle.Record({
                    bar: Meddle.Scalar(123),
                    baz: Meddle.List([1,2,3])
                }),
                f = new Foo()
                
            f.onchange = jasmine.createSpy('onchange')
            f.bar = 666
            expect(f.onchange).toHaveBeenCalledWith('bar', 123, 666)
        })
        
        it("has a change listener that fires when a list property changes", function ()
        {
            var Foo = Meddle.Record({
                    bar: Meddle.Scalar(123),
                    baz: Meddle.List([1,2,3])
                }),
                f = new Foo()
                
            f.onchange = jasmine.createSpy('onchange')
            f.baz.push('purple carrot')
            expect(f.onchange).toHaveBeenCalledWith('baz', 'push', 'purple carrot')
        })
    })
})