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
            var foo = new Meddle.Scalar()
            expect(foo.set).toBeDefined()
            expect(foo.set instanceof Function).toBeTruthy()
        })
        
        it("has a default value of null", function ()
        {
            var foo = new Meddle.Scalar(),
                val = foo.get()
                
            expect(val).toBeDefined()
            expect(val).toBeNull()
        })
        
        it("has a set method", function ()
        {
            var foo = new Meddle.Scalar()
            expect(foo.set).toBeDefined()
            expect(foo.set instanceof Function).toBeTruthy()
        })
        
        it("can have its value set", function ()
        {
            var foo = new Meddle.Scalar()
            foo.set('bar')
            expect(foo.get()).toEqual('bar')
        })
        
        it("can have a default value", function ()
        {
            var foo = new Meddle.Scalar(23)
            expect(foo.get()).toEqual(23)
        })
        
        it("will notify a listener when value is set", function ()
        {
            var foo = new Meddle.Scalar()
            foo.onchange = stubFunctions.onchange
            foo.set(777)
            expect(stubFunctions.onchange).toHaveBeenCalled()
        })
        
        it("will provide the old and new values to the change listener", function ()
        {
            var foo = new Meddle.Scalar(666)
            foo.onchange = stubFunctions.onchange
            foo.set(777)
            expect(stubFunctions.onchange).toHaveBeenCalledWith(666, 777)
        })
    })
    
    describe("Model", function ()
    {
        it("can create new classes", function ()
        {
            var Something = Meddle.Model.create()
            expect(Something).toBeDefined()
            expect(Something).not.toBeNull()
        })
    })
})