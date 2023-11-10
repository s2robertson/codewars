const equalTo24 = require('./equalTo24');

describe("Provided Tests", () => {
    test("passing tests", () => {
        //If you got a message:"SyntaxError: Unexpected token ILLEGAL", 
        //maybe because your result is not a correct string for eval().
        //For example: eval("It's not possible!") will post the Error message ;-)
        //This is NOT an issue ;-)

        console.log("this one can return 1*2*3*4, your answer is:",equalTo24(1,2,3,4))
        expect(eval(equalTo24(1,2,3,4))).toBe(24);
        console.log("this one can return 2*(3+4+5), your answer is:",equalTo24(2,3,4,5))
        expect(eval(equalTo24(2,3,4,5))).toBe(24);
        console.log("this one can return (3+5-4)*6, your answer is:",equalTo24(3,4,5,6))
        expect(eval(equalTo24(3,4,5,6))).toBe(24);
        console.log("this one can return (1+1)*(13-1), your answer is:",equalTo24(1,1,1,13))
        expect(eval(equalTo24(1,1,1,13))).toBe(24);
        console.log("this one can return 13+(13-(12/6)), your answer is:",equalTo24(13,13,6,12))
        expect(eval(equalTo24(13,13,6,12))).toBe(24);
        console.log("this one can return 2*(13-(7/7)), your answer is:",equalTo24(2,7,7,13))
        expect(eval(equalTo24(2,7,7,13))).toBe(24);
        console.log("this one can return 6/(1-(3/4)), your answer is:",equalTo24(4,3,1,6))
        expect(eval(equalTo24(4,3,1,6))).toBe(24);
    })

    test('failing tests', () => {
        expect(equalTo24(1,1,1,1)).toBe("It's not possible!");
        expect(equalTo24(13,13,13,13)).toBe("It's not possible!");
    })

    test('rounding error', () => {
        expect(eval(equalTo24(72, 4, 3, 1))).toBeCloseTo(24);
    })
  })
  