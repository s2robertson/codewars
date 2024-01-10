const whitespace = require('./whitespace');

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

test("Testing stack functionality", function () {
    // space (stack manipulation)
    //   space (read number and push onto stack)
    //     space (positive) =>tab (1)*2->\n (end) (overall: 3)
    // repeat prev
    // tab->\n (I/O)
    //   space->tab (pop stack, output as number)
    // repeat prev
    // \n (flow control)
    //   \n->\n (exit program)
    var pushTwice = "   \t\t\n   \t\t\n\t\n \t\t\n \t\n\n\n";
    expect(whitespace(pushTwice)).toBe("33");

    // space->space (read number, push onto stack)
    //   space->tab (1)*2->\n (end) (overall 3)
    // space (stack manipulation)
    //   \n->space (duplicate top value on stack)
    // tab->\n (I/O)
    //   space->tab (pop stack, output as number)
    // repeat prev
    // \n (flow control)
    //   \n\n (exit program)
    var duplicate = "   \t\t\n \n \t\n \t\t\n \t\n\n\n";
    expect(whitespace(duplicate)).toBe("33");

    var duplicateN1 = "   \t\n   \t \n   \t\t\n \t  \t \n\t\n \t\n\n\n";
    expect(whitespace(duplicateN1)).toBe("1");

    var duplicateN2 = "   \t\n   \t \n   \t\t\n \t  \t\n\t\n \t\n\n\n";
    expect(whitespace(duplicateN2)).toBe("2");

    var duplicateN3 = "   \t\n   \t \n   \t\t\n \t   \n\t\n \t\n\n\n";
    expect(whitespace(duplicateN3)).toBe("3");

    var swap = "   \t\t\n   \t \n \n\t\t\n \t\t\n \t\n\n\n";
    expect(whitespace(swap)).toBe("32");

    var discard = "   \t\t\n   \t \n \n\t \n\n\t\n \t\n\n\n";
    expect(whitespace(discard)).toBe("2");

    var slide = "   \t\t\n   \t \n   \t\n   \t  \n   \t\t \n   \t \t\n   \t\t\t\n \n\t \t\n \t\t\n\t\n \t\t\n \t\t\n \t\t\n \t\n\n\n";
    expect(whitespace(slide)).toBe("5123");
});