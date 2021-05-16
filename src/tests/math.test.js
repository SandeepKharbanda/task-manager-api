const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, sum} = require('../math')
// test('should run ', () => {
  
// })

// test('should failed ', () => {
//     throw new Error('Failed')
// })

test('CalculateTip', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
    // if(total !== 13){
    //     throw new Error('Value must be 13 but got ' + total)
    // }
})

test("Should convert 32 F to 0 C", () => expect(fahrenheitToCelsius(32)).toBe(0));

test("Should convert 0 C to 32 F", () => expect(celsiusToFahrenheit(0)).toBe(32));

// pass param in callback function say done in case of Async call
test("Async demo", (done) => {
    setTimeout(() => {
        expect(1).toBe(1)
        done()
    }, 800);
});

test('Should add two number', (done) => {
    sum(10, 20)
    .then(total => {
        expect(total).toBe(30)
        done()
    })
})

test('Should add two number using async-await', async() => {
    const total = await sum(10, 20)
    expect(total).toBe(30)

})