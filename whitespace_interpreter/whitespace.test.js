const whitespace = require('./whitespace');

test("Testing push, output of numbers 0 through 3", function () {
  var output1 = "   \t\n\t\n \t\n\n\n";
  var output2 = "   \t \n\t\n \t\n\n\n";
  var output3 = "   \t\t\n\t\n \t\n\n\n";
  var output0 = "    \n\t\n \t\n\n\n";
  
  expect(whitespace(output1)).toBe("1");
  expect(whitespace(output2)).toBe("2");
  expect(whitespace(output3)).toBe("3");
  expect(whitespace(output0)).toBe("0");
});

test("Testing ouput of numbers -1 through -3", function () {
  var outputNegative1 = "  \t\t\n\t\n \t\n\n\n";
  var outputNegative2 = "  \t\t \n\t\n \t\n\n\n";
  var outputNegative3 = "  \t\t\t\n\t\n \t\n\n\n";
  
  expect(whitespace(outputNegative1)).toBe("-1");
  expect(whitespace(outputNegative2)).toBe("-2");
  expect(whitespace(outputNegative3)).toBe("-3");
});

test("Testing simple flow control edge case", function () {
  // Expecting exception for unclean termination
  expect(() => whitespace("")).toThrow();
});

test("Testing output of letters A through C", function () {
  var outputA = "   \t     \t\n\t\n  \n\n\n";
  var outputB = "   \t    \t \n\t\n  \n\n\n";
  var outputC = "   \t    \t\t\n\t\n  \n\n\n";
  
  expect(whitespace(outputA)).toBe("A");
  expect(whitespace(outputB)).toBe("B");
  expect(whitespace(outputC)).toBe("C");
});

test("Testing output of letters A through C with comments", function () {
  var outputA = "blahhhh   \targgggghhh     \t\n\t\n  \n\n\n";
  var outputB = " I heart \t  cats  \t \n\t\n  \n\n\n";
  var outputC = "   \t  welcome  \t\t\n\t\n to the\nnew\nworld\n";

  expect(whitespace(outputA)).toBe("A");
  expect(whitespace(outputB)).toBe("B");
  expect(whitespace(outputC)).toBe("C");
});

test("Testing stack functionality", function () {
  var pushTwice = "   \t\t\n   \t\t\n\t\n \t\t\n \t\n\n\n";
  var duplicate = "   \t\t\n \n \t\n \t\t\n \t\n\n\n";
  var duplicateN1 = "   \t\n   \t \n   \t\t\n \t  \t \n\t\n \t\n\n\n";
  var duplicateN2 = "   \t\n   \t \n   \t\t\n \t  \t\n\t\n \t\n\n\n";
  var duplicateN3 = "   \t\n   \t \n   \t\t\n \t   \n\t\n \t\n\n\n";
  var swap = "   \t\t\n   \t \n \n\t\t\n \t\t\n \t\n\n\n";
  var discard = "   \t\t\n   \t \n \n\t \n\n\t\n \t\n\n\n";
  var slide = "   \t\t\n   \t \n   \t\n   \t  \n   \t\t \n   \t \t\n   \t\t\t\n \n\t \t\n \t\t\n\t\n \t\t\n \t\t\n \t\t\n \t\n\n\n";
  
  expect(whitespace(pushTwice)).toBe("33");
  expect(whitespace(duplicate)).toBe("33");
  expect(whitespace(duplicateN1)).toBe("1");
  expect(whitespace(duplicateN2)).toBe("2");
  expect(whitespace(duplicateN3)).toBe("3");
  expect(whitespace(swap)).toBe("32");
  expect(whitespace(discard)).toBe("2");
  expect(whitespace(slide)).toBe("5123");
});