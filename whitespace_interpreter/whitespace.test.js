const whitespace = require('./whitespace');

const stackEmptyStr = 'Not enough items on stack';

test("Testing push, output of numbers 0 through 3", function () {
    // space (stack manipulation)
    //   space (read number and push onto stack)
    //     space (positive)->tab (1)->\n (end number)
    // tab->\n (I/O)
    //   space->tab (pop stack, output as number)
    // \n (flow control)
    //   \n->\n (exit program)
    var output1 = "   \t\n\t\n \t\n\n\n";
    expect(whitespace(output1)).toBe("1");

    var output2 = "   \t \n\t\n \t\n\n\n";
    expect(whitespace(output2)).toBe("2");

    var output3 = "   \t\t\n\t\n \t\n\n\n";
    expect(whitespace(output3)).toBe("3");

    var output0 = "    \n\t\n \t\n\n\n";
    expect(whitespace(output0)).toBe("0");

    var altOutput0 = '   \n\t\n \t\n\n\n';
    expect(whitespace(altOutput0)).toBe('0');
});

test("Testing ouput of numbers -1 through -3", function () {
    var outputNegative1 = "  \t\t\n\t\n \t\n\n\n";
    expect(whitespace(outputNegative1)).toBe("-1");

    var outputNegative2 = "  \t\t \n\t\n \t\n\n\n";
    expect(whitespace(outputNegative2)).toBe("-2");

    var outputNegative3 = "  \t\t\t\n\t\n \t\n\n\n";
    expect(whitespace(outputNegative3)).toBe("-3");
});

test("Testing simple flow control edge case", function () {
    // Expecting exception for unclean termination
    expect(() => whitespace("")).toThrow('Unclean termination: programs should end with \'\\n\\n\\n\'');
});

test("Testing output of letters A through C", function () {
    // space (stack manipulation)
    //   space (read number and push onto stack)
    //     space (positive)->tab (1)->space (0)*5->tab (1)->\n (end) (overall: 65)
    // tab->\n (I/O)
    //   space->space (pop stack, output as character)
    // \n (flow control)
    //   \n->\n (exit program)
    var outputA = "   \t     \t\n\t\n  \n\n\n";
    expect(whitespace(outputA)).toBe("A");

    var outputB = "   \t    \t \n\t\n  \n\n\n";
    expect(whitespace(outputB)).toBe("B");

    var outputC = "   \t    \t\t\n\t\n  \n\n\n";
    expect(whitespace(outputC)).toBe("C");
});

test("Testing output of letters A through C with comments", function () {
    var outputA = "blahhhh   \targgggghhh     \t\n\t\n  \n\n\n";
    expect(whitespace(outputA)).toBe("A");

    var outputB = " I heart \t  cats  \t \n\t\n  \n\n\n";
    expect(whitespace(outputB)).toBe("B");

    var outputC = "   \t  welcome  \t\t\n\t\n to the\nnew\nworld\n";
    expect(whitespace(outputC)).toBe("C");
});

describe('Testing stack functionality', () => {
    test('Push two numbers', () => {
        // '   \t\t\n' add number (3) to stack (col 31)
        // '   \t\t\n' repeat prev (col 40)
        // '\t\n \t' pop stack, output as number
        // '\t\n \t' repeat prev (col 47)
        // '\n\n\n' exit program
        var pushTwice = "   \t\t\n   \t\t\n\t\n \t\t\n \t\n\n\n";
        expect(whitespace(pushTwice)).toBe("33");
    })

    test('Duplicate top of stack', () => {
        // '   \t\t\n' add number (3) to stack (col 31)
        // ' \n ' duplicate top value on stack (col 35)
        // '\t\n \t' pop stack, output as number (col 42)
        // '\t\n \t' repeat prev (col 49)
        // '\n\n\n' exit program
        var duplicate = "   \t\t\n \n \t\n \t\t\n \t\n\n\n";
        expect(whitespace(duplicate)).toBe("33");
    })

    test('Duplicate n-th item on stack', () => {
        // '   \t\n' add number (1) to stack (col 31)
        // '   \t \n' add number (2) to stack (col 39)
        // '   \t\t\n' add number (3) to stack (col 48)
        // stack = [1, 2, 3]
        // ' \t  \t \n' read number (2), duplicate 2nd value from top of stack, 0-indexed (col 58)
        // stack = [1, 2, 3, 1]
        // '\t\n \t' pop stack, output as number (col 65)
        // '\n\n\n' exit program
        var duplicateN1 = "   \t\n   \t \n   \t\t\n \t  \t \n\t\n \t\n\n\n";
        expect(whitespace(duplicateN1)).toBe("1");
    
        var duplicateN2 = "   \t\n   \t \n   \t\t\n \t  \t\n\t\n \t\n\n\n";
        expect(whitespace(duplicateN2)).toBe("2");
    
        var duplicateN3 = "   \t\n   \t \n   \t\t\n \t   \n\t\n \t\n\n\n";
        expect(whitespace(duplicateN3)).toBe("3");
    })

    test('Swap top two stack elements', () => {
        // '   \t\t\n' add number (3) to stack (col 26)
        // '   \t \n' add number (2) to stack (col 34)
        // ' \n\t' swap top 2 stack elements (col 39)
        // '\t\n \t' pop stack, output as number (col 46)
        // '\t\n \t' repeat prev
        // '\n\n\n' exit program
        var swap = "   \t\t\n   \t \n \n\t\t\n \t\t\n \t\n\n\n";
        expect(whitespace(swap)).toBe("32");
    })

    test('Discard top stack element', () => {
        // '   \t\t\n' add number (3) to stack (col 29)
        // '   \t \n' add number (2) to stack (col 37)
        // ' \n\t' swap top 2 stack elements (col 42)
        // ' \n\n' discard top element from stack (col 47)
        // '\t\n \t' pop stack, output as number (col 54)
        // '\n\n\n' exit program
        var discard = "   \t\t\n   \t \n \n\t \n\n\t\n \t\n\n\n";
        expect(whitespace(discard)).toBe("2");
    })

    test('Discard n elements below top of stack', () => {
        // '   \t\t\n' add number (3) to stack (col 27)
        // '   \t \n' add number (2) to stack (col 35)
        // '   \t\n' add number (1) to stack (col 42)
        // '   \t  \n' add number (4) to stack (col 51)
        // '   \t\t \n' add number (6) to stack (col 61)
        // '   \t \t\n' add number (5) to stack (col 71)
        // '   \t\t\t\n' add number (7) to stack (col 82)
        // stack = [3, 2, 1, 4, 6, 5, 7]
        // ' \n\t' swap top 2 stack elements (col 87)
        // stack = [3, 2, 1, 4, 6, 7, 5]
        // ' \t\n \t\t\n' read number (3), discard n elements from below top of stack
        // stack = [3, 2, 1, 5]
        // '\t\n \t' pop stack, output as number (col 106)
        // '\t\n \t' repeat last (col 113)
        // '\t\n \t' repeat last (col 120)
        // '\t\n \t' repeat last (col 127)
        // '\n\n\n' exit program
        var slide = "   \t\t\n   \t \n   \t\n   \t  \n   \t\t \n   \t \t\n   \t\t\t\n \n\t \t\n \t\t\n\t\n \t\t\n \t\t\n \t\t\n \t\n\n\n";
        expect(whitespace(slide)).toBe("5123");
    
        // '   \t\t\n' add number (3) to stack
        // '   \t \n' add number (2) to stack
        // '   \t\n' add number (1) to stack
        // ' \t\n\t\t\n' read number (-1) and delete all items but top from stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const slide2 = '   \t\t\n   \t \n   \t\n \t\n\t\t\n\t\n \t\n\n\n';
        expect(whitespace(slide2)).toBe('1');
    
        // '   \t\t\n' add number (3) to stack
        // '   \t \n' add number (2) to stack
        // '   \t\n' add number (1) to stack
        // ' \t\n \t  \n' read number (4) and delete all items but top from stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const slide3 = '   \t\t\n   \t \n   \t\n \t\n \t  \n\t\n \t\n\n\n';
        expect(whitespace(slide3)).toBe('1');
    })
})

describe('Stack manipulation errors', () => {
    test('Trying to output with empty stack', () => {
        // '\t\n \t' pop stack, output as number (error, stack is empty)
        // '\n\n\n' exit program
        const emptyOutputErr = '\t\n \t\n\n\n';
        expect(() => whitespace(emptyOutputErr)).toThrow(stackEmptyStr);
    })

    test('Attempting to duplicate non-existant stack items', () => {
        // '   \t\n' add number (1) to stack
        // ' \t  \t\n' duplicate stack item at 1 from end (i.e. index -2)
        // '\n\n\n' exit program
        const duplicationErr = '   \t\n \t  \t\n\n\n\n';
        expect(() => whitespace(duplicationErr)).toThrow(stackEmptyStr);
    
        // ' \n ' duplicate top item (error, stack is empty)
        // '\n\n\n' exit program
        const duplicationErr2 = ' \n \n\n\n';
        expect(() => whitespace(duplicationErr2)).toThrow(stackEmptyStr);

        // '   \t\n' push number (1)
        // '   \t \n' push number (2)
        // '   \t\t\n' push number (3)
        // ' \t \t\t\n' read number (-1), and duplicate/push (-1)-th item from top of stack (error)
        // '\t\n \t' pop value, output as number
        // '\n\n\n'
        const duplicationErr3 = '   \t\n   \t \n   \t\t\n \t \t\t\n\t\n \t\n\n\n';
        expect(() => whitespace(duplicationErr3)).toThrow('Cannot accept negative numbers');
    })

    test('Attempting to swap non-existant stack items', () => {
        // ' \n\t' swap top two items on stack (error, stack is empty)
        // '\n\n\n' exit program
        const swapErr = ' \n\t\n\n\n';
        expect(() => whitespace(swapErr)).toThrow(stackEmptyStr);
    
        // '   \t\n' add number (1) to stack
        // ' \n\t' swap top two items on stack (error, only one element)
        // '\n\n\n' exit program
        const swapErr2 = '   \t\n \n\t\n\n\n';
        expect(() => whitespace(swapErr2)).toThrow(stackEmptyStr);
    })

    test('Attempting to discard top of empty stack', () => {
        // ' \n\n' discard top item on stack (error, stack is empty)
        // '\n\n\n' exit program
        const discardErr = ' \n\n\n\n\n';
        expect(() => whitespace(discardErr)).toThrow(stackEmptyStr);
    })
})

describe('Arithmetic', () => {
    test('Addition', () => {
        // '   \t \t\n' add number (5) to stack
        // '   \t\t\n' add number (3) to stack
        // '\t   ' pop prev two numbers (a, b) and push a + b
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const sum = '   \t \t\n   \t\t\n\t   \t\n \t\n\n\n';
        expect(whitespace(sum)).toBe('8');
    })

    test('Subtraction', () => {
        // '   \t \t\n' add number (5) to stack
        // '   \t\t\n' add number (3) to stack
        // '\t  \t' pop a, b, push b - a
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const diff = '   \t \t\n   \t\t\n\t  \t\t\n \t\n\n\n';
        expect(whitespace(diff)).toBe('2');
    })

    test('Multiplication', () => {
        // '   \t \t\n' add number (5) to stack
        // '   \t\t\n' add number (3) to stack
        // '\t  \n' pop a, b, push a * b
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const mult = '   \t \t\n   \t\t\n\t  \n\t\n \t\n\n\n';
        expect(whitespace(mult)).toBe('15');
    })

    test('Division', () => {
        // '   \t\t\t\n' add number (7) to stack
        // '   \t\t\n' add number (3) to stack
        // '\t \t ' pop a, b, push floor(b / a)
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const div = '   \t\t\t\n   \t\t\n\t \t \t\n \t\n\n\n';
        expect(whitespace(div)).toBe('2');

        // '  \t\t\t\t\n' add number (-7) to stack
        // '   \t\t\n' add number (3) to stack
        // '\t \t ' pop a, b, push floor(b / a)
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const div2 = '  \t\t\t\t\n   \t\t\n\t \t \t\n \t\n\n\n';
        expect(whitespace(div2)).toBe('-3');
        
        // '   \t\t\t\n' add number (7) to stack
        // '  \t\t\t\n' add number (3) to stack
        // '\t \t ' pop a, b, push floor(b / a)
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const div3 = '   \t\t\t\n  \t\t\t\n\t \t \t\n \t\n\n\n';
        expect(whitespace(div3)).toBe('-3');
        
        // '  \t\t\t\t\n' add number (-7) to stack
        // '  \t\t\t\n' add number (-3) to stack
        // '\t \t ' pop a, b, push floor(b / a)
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const div4 = '  \t\t\t\t\n  \t\t\t\n\t \t \t\n \t\n\n\n';
        expect(whitespace(div4)).toBe('2');
    })

    test('Modulus', () => {
        // *** For the following tests, % is defined as: remainder = dividend - divisor * floor(dividend / divisor)
        
        // '   \t\t\t\n' add number (7) to stack
        // '   \t\t\n' add number (3) to stack
        // '\t \t\t' pop a, b, push b % a
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const mod = '   \t\t\t\n   \t\t\n\t \t\t\t\n \t\n\n\n';
        expect(whitespace(mod)).toBe('1');
        
        // '  \t\t\t\t\n' add number (-7) to stack
        // '   \t\t\n' add number (3) to stack
        // '\t \t\t' pop a, b, push b % a
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const mod2 = '  \t\t\t\t\n   \t\t\n\t \t\t\t\n \t\n\n\n';
        expect(whitespace(mod2)).toBe('2');
        
        // '   \t\t\t\n' add number (7) to stack
        // '  \t\t\t\n' add number (-3) to stack
        // '\t \t\t' pop a, b, push b % a
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const mod3 = '   \t\t\t\n  \t\t\t\n\t \t\t\t\n \t\n\n\n';
        expect(whitespace(mod3)).toBe('-2');
        
        // '  \t\t\t\t\n' add number (-7) to stack
        // '  \t\t\t\n' add number (-3) to stack
        // '\t \t\t' pop a, b, push b % a
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit
        const mod4 = '  \t\t\t\t\n  \t\t\t\n\t \t\t\t\n \t\n\n\n';
        expect(whitespace(mod4)).toBe('-1');
    })
})

test('Arithmetic errors', () => {
    const divByZeroStr = 'Division by 0';

    // '   \t\t\n' add number (3) to stack
    // '   \n' add number (0) to stack
    // '\t \t ' pop 0, 3, push 3 / 0 (error)
    // '\n\n\n' exit program
    const divErr = '   \t\t\n   \n\t \t \n\n\n';
    expect(() => whitespace(divErr)).toThrow(divByZeroStr);

    // '   \t\t\n' add number (3) to stack
    // '   \n' add number (0) to stack
    // '\t \t\t' pop 0, 3, push 3 % 0 (error)
    // '\n\n\n' exit program
    const modErr = '   \t\t\n   \n\t \t\t\n\n\n';
    expect(() => whitespace(modErr)).toThrow(divByZeroStr);
})

test('Heap access', () => {
    // '   \t \t\n' add number (5) to stack
    // '   \t\t\n' add number (3) to stack
    // '\t\t ' pop 3, 5 from stack, store 3 at heap address 5
    // '   \t \t\n' add number (5) to stack
    // '\t\t\t' pop 5 from stack, push value at heap address 5
    // '\t\n \t' pop stack, output as number
    // '\n\n\n' exit program
    const heap = '   \t \t\n   \t\t\n\t\t    \t \t\n\t\t\t\t\n \t\n\n\n';
    expect(whitespace(heap)).toBe('3');
})

test('Heap error', () => {
    // '\t\t\t' pop stack (error) and try to read heap
    // '\n\n\n' exit program
    const heapErr = '\t\t\t\n\n\n';
    expect(() => whitespace(heapErr)).toThrow(stackEmptyStr);

    // '   \t\t\n' add number (3) to stack
    // '\t\t\t' pop 3 and push value at heap address 3 (error)
    // '\n\n\n' exit program
    const heapErr2 = '   \t\t\n\t\t\t\n\n\n';
    expect(() => whitespace(heapErr2)).toThrow('Heap lookup failed');
})

describe('I/O', () => {
    const eofStr = 'Attempting to read past end of input';

    test('Character input', () => {
        // '   \n' add number (0) to stack
        // '\t\n\t ' read character (a) from input, pop address (b) from stack, store a (as character code) at heap[b]
        // '   \n' add number (0) to stack
        // '\t\t\t' pop address (a), push value at heap[a]
        // '\t\n  ' pop value, output as character
        // '\n\n\n' exit program
        const charInput = '   \n\t\n\t    \n\t\t\t\t\n  \n\n\n';
        expect(whitespace(charInput, 'a')).toBe('a');
    })

    test('Number input', () => {
        // '   \t\n' push number (1)
        // '\t\n\t\t' read number (a) from input, pop address (b), store a at heap[b]
        // '   \t\n' push number (1)
        // '\t\t\t' pop address (a) push value at heap[a]
        // '\t\n \t' pop value, output as number
        // '\n\n\n' exit program
        const numInput = '   \t\n\t\n\t\t   \t\n\t\t\t\t\n \t\n\n\n';
        expect(whitespace(numInput, '15\n')).toBe('15');
    })

    test('Number input (hex)', () => {
        // '   \t\n' push number (1)
        // '\t\n\t\t' read number (a) from input, pop address (b), store a at heap[b]
        // '   \t\n' push number (1)
        // '\t\t\t' pop address (a) push value at heap[a]
        // '\t\n \t' pop value, output as number
        // '\n\n\n' exit program
        const hexInput = '   \t\n\t\n\t\t   \t\n\t\t\t\t\n \t\n\n\n';
        expect(whitespace(hexInput, '0xb\n')).toBe('11');
    })

    test('Attempting to read character from empty input should throw', () => {
        // '   \n' push number (0)
        // '\t\n\t ' read character (a) from input, pop address (b) from stack, store a (as char code) at heap[b]
        // '\n\n\n' exit
        const charInputErr = '   \n\t\n\t \n\n\n';
        expect(() => whitespace(charInputErr, '')).toThrow(eofStr)
    })

    test('Attempting to read character when stack is empty should throw', () => {
        // '\t\n\t ' read character (a) from input, pop address (b) from stack (missing), store a at heap[b]
        // '\n\n\n' exit
        const charInputErr2 = '\t\n\t \n\n\n';
        expect(() => whitespace(charInputErr2, 'a')).toThrow(stackEmptyStr);
    })

    test('Attempting to read number from empty input should throw', () => {
        // '   \n' push number (0)
        // '\t\n\t\t' read number (a) from input, pop address (b), store a at heap[b]
        // '\n\n\n' exit
        const numInputErr = '   \n\t\n\t\t\n\n\n';
        expect(() => whitespace(numInputErr, '')).toThrow(eofStr);
    })
    
    test('Attempting to read unterminated number should throw', () => {
        // '   \n' push number (0)
        // '\t\n\t\t' read number (a) from input, pop address (b), store a at heap[b]
        // '\n\n\n' exit
        const numInputErr2 = '   \n\t\n\t\t\n\n\n';
        expect(() => whitespace(numInputErr2, '15')).toThrow(eofStr);
    })
    
    test('Attempting to read number when stack is empty should throw', () => {
        // '\t\n\t\t' read number (a) from input, pop address (b) (missing), store a at heap[b]
        // '\n\n\n' exit
        const numInputErr2 = '\t\n\t\t\n\n\n';
        expect(() => whitespace(numInputErr2, '15\n')).toThrow(stackEmptyStr);
    })
})

describe('Labels and flow control', () => {
    test('Jump to label', () => {
        // '\n \n \n' jump to label ' '
        // '   \t\n' add number (1) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t \n' add number (2) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpToLabel = '\n \n \n   \t\n\t\n \t\n\n\n\n   \n   \t \n\t\n \t\n\n\n';
        expect(whitespace(jumpToLabel)).toBe('2');
    })

    test('Jump to invalid label should throw', () => {
        // '\n \n \n' jump to label ' '
        // '   \t\n' add number (1) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const labelJumpErr = '\n \n \n   \t\n\t\n \t\n\n\n';
        expect(() => whitespace(labelJumpErr)).toThrow('Invalid label (s)');
    })

    test('Duplicate label should throw', () => {
        // '\n   \n' define label ' '
        // '\n   \n' define label ' '
        // '   \t\n' add number (1) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const labelDupErr = '\n   \n\n   \n   \t\n\t\n \t\n\n\n';
        expect(() => whitespace(labelDupErr)).toThrow('Duplicate label (s)');
    })

    test('Pop stack, jump to label if 0 (true)', () => {
        // '   \n' add number (0) to stack
        // '\n\t  \n' pop stack, if 0 (true), jump to label ' '
        // '   \t\t\n' add number (3) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t  \n' add number (4) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpIfZeroTrue = '   \n\n\t  \n   \t\t\n\t\n \t\n\n\n\n   \n   \t  \n\t\n \t\n\n\n';
        expect(whitespace(jumpIfZeroTrue)).toBe('4');
    })

    test('Pop stack, jump to label if 0 (false)', () => {
        // '   \t\n' add number (1) to stack
        // '\n\t  \n' pop stack, if 0 (false), jump to label ' '
        // '   \t\t\n' add number (3) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t  \n' add number (4) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpIfZeroFalse = '   \t\n\n\t  \n   \t\t\n\t\n \t\n\n\n\n   \n   \t  \n\t\n \t\n\n\n';
        expect(whitespace(jumpIfZeroFalse)).toBe('3');
    })

    test('Jump to label if 0 should throw if label invalid', () => {
        // '   \n' add number (0) to stack
        // '\n\t  \n' pop stack, if 0 (true), jump to label ' '
        // '   \t\t\n' add number (3) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n  \t\n' define label 't'
        // '   \t  \n' add number (4) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpIfZeroInvalidErr = '   \n\n\t  \n   \t\t\n\t\n \t\n\n\n\n  \t\n   \t  \n\t\n \t\n\n\n';
        expect(() => whitespace(jumpIfZeroInvalidErr)).toThrow('Invalid label (s)');
    })

    test('Jump to label if 0 should throw if stack empty', () => {
        // '\n\t  \n' pop stack (empty), if 0, jump to label ' '
        // '   \t\t\n' add number (3) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t  \n' add number (4) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpIfZeroStackEmptyErr = '\n\t  \n   \t\t\n\t\n \t\n\n\n\n   \n   \t  \n\t\n \t\n\n\n';
        expect(() => whitespace(jumpIfZeroStackEmptyErr)).toThrow(stackEmptyStr);
    })

    test('Pop stack, jump to label if negative (true)', () => {
        // '  \t\t\n' add number (-1) to stack
        // '\n\t\t \n' pop stack, if negative (true), jump to label ' '
        // '   \t\t\n' add number (3) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t  \n' add number (4) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpIfNegTrue = '  \t\t\n\n\t\t \n   \t\t\n\t\n \t\n\n\n\n   \n   \t  \n\t\n \t\n\n\n';
        expect(whitespace(jumpIfNegTrue)).toBe('4');
    })

    test('Pop stack, jump to label if negative (false)', () => {
        // '   \n' add number (0) to stack
        // '\n\t\t \n' pop stack, if negative (true), jump to label ' '
        // '   \t\t\n' add number (3) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t  \n' add number (4) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpIfNegTrue = '   \n\n\t\t \n   \t\t\n\t\n \t\n\n\n\n   \n   \t  \n\t\n \t\n\n\n';
        expect(whitespace(jumpIfNegTrue)).toBe('3');
    })

    test('Jump to label if negative should throw if label invalid', () => {
        // '  \t\t\n' add number (-1) to stack
        // '\n\t\t \n' pop stack, if negative (true), jump to label ' '
        // '   \t\t\n' add number (3) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n  \t\n' define label 't'
        // '   \t  \n' add number (4) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpIfNegInvalidErr = '  \t\t\n\n\t\t \n   \t\t\n\t\n \t\n\n\n\n  \t\n   \t  \n\t\n \t\n\n\n';
        expect(() => whitespace(jumpIfNegInvalidErr)).toThrow('Invalid label (s)');
    })

    test('Jump to label if negative should throw if stack empty', () => {
        // '\n\t\t \n' pop stack, if negative (true), jump to label ' '
        // '   \t\t\n' add number (3) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t  \n' add number (4) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\n\n' exit program
        const jumpIfNegStackEmptyErr = '\n\t\t \n   \t\t\n\t\n \t\n\n\n\n   \n   \t  \n\t\n \t\n\n\n';
        expect(() => whitespace(jumpIfNegStackEmptyErr)).toThrow(stackEmptyStr);
    })

    test('Jump to label at index 0', () => {
        // '\n   \n' define label ' '
        // '   \n' add number (0) to stack
        // '\t\n\t\t' read number (a) from input, pop address (b), store a at heap[b]
        // '   \n' add number (0) to stack
        // '\t\t\t' pop address (a), push value at heap[a]
        // '\n\t \t\n' pop number (a), jump to label 't' if a == 0
        // '\n \n \n' jump to label ' '
        // '\n  \t\n' define label 't'
        // '\n\n\n' exit program
        const jumpToBeginning = '\n   \n   \n\t\n\t\t   \n\t\t\t\n\t \t\n\n \n \n\n  \t\n\n\n\n';
        expect(() => whitespace(jumpToBeginning, '1\n0\n')).not.toThrow();
    })

    test('Pop stack, jump to label at index 0 if 0', () => {
        // '\n   \n' define label ' '
        // '   \n' add number (0) to stack
        // '\t\n\t\t' read number (a) from input, pop address (b), store a at heap[b]
        // '   \n' add number (0) to stack
        // '\t\t\t' pop address (a), push value at heap[a]
        // '\n\t  \n' pop number (a), jump to label ' ' if a == 0
        // '\n\n\n' exit program
        const jumpToBeginningIfZero = '\n   \n   \n\t\n\t\t   \n\t\t\t\n\t  \n\n\n\n';
        expect(() => whitespace(jumpToBeginningIfZero, '0\n1\n')).not.toThrow();
    })

    test('Pop stack, jump to label at index 0 if negative', () => {
        // '\n   \n' define label ' '
        // '   \n' add number (0) to stack
        // '\t\n\t\t' read number (a) from input, pop address (b), store a at heap[b]
        // '   \n' add number (0) to stack
        // '\t\t\t' pop address (a), push value at heap[a]
        // '\n\t\t \n' pop number (a), jump to label ' ' if a == 0
        // '\n\n\n' exit program
        const jumpToBeginningIfNegative = '\n   \n   \n\t\n\t\t   \n\t\t\t\n\t\t \n\n\n\n';
        expect(() => whitespace(jumpToBeginningIfNegative, '-1\n1\n')).not.toThrow();
    })

    test('Call subroutine twice', () => {
        // '\n \t \n' call subroutine ' '
        // '\n \t \n' call subroutine ' '
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t\n' add number (1) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\t\n' return from subroutine
        const callSubroutine = '\n \t \n\n \t \n\n\n\n\n   \n   \t\n\t\n \t\n\t\n';
        expect(whitespace(callSubroutine)).toBe('11');
    })

    test('Calling subroutine should throw if label invalid', () => {
        // '\n \t\t\n' call subroutine 't'
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t\n' add number (1) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\t\n' return from subroutine
        const callSubroutineErr = '\n \t\t\n\n\n\n\n   \n   \t\n\t\n \t\n\t\n';
        expect(() => whitespace(callSubroutineErr)).toThrow('Invalid label (t)');
    })

    test('Returning from subroutine should throw if call stack is empty', () => {
        // '\n \n \n' jump to label ' '
        // '\n\n\n' exit program
        // '\n   \n' define label ' '
        // '   \t\n' add number (1) to stack
        // '\t\n \t' pop stack, output as number
        // '\n\t\n' return from subroutine (error: jump was used instead of call)
        const subroutineReturnErr = '\n \n \n\n\n\n\n   \n   \t\n\t\n \t\n\t\n';
        expect(() => whitespace(subroutineReturnErr)).toThrow('Attempting to return from subroutine, but call stack is empty');
    })
})