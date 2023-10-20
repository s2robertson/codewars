const listPosition = require("./anagramListPosition");

test.each([
    ['A', 1],
    ['ABAB', 2],
    ['AAAB', 1],
    ['BAAA', 4],
    ['QUESTION', 24572],
    ['BOOKKEEPER', 10743]
])('Provided examples', (input, answer) => {
    expect(listPosition(input)).toBe(answer);
})