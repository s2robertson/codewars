const Interpreter = require('./interpreter');

let interpreter;

beforeEach(() => {
    interpreter = new Interpreter();
})

test("operators", () => {
    expect(interpreter.input("1 + 1")).toBe(2);
    expect(interpreter.input("2 - 1")).toBe(1);
    expect(interpreter.input("2 * 3")).toBe(6);
    expect(interpreter.input("8 / 4")).toBe(2);
    expect(interpreter.input("7 % 4")).toBe(3);
})

test("variables", () => {
    expect(interpreter.input("x = 1")).toBe(1);
    expect(interpreter.input("x")).toBe(1);
    expect(interpreter.input("x + 3")).toBe(4);
    expect(() => interpreter.input("y")).toThrow();
    expect(interpreter.input('4 + (y = 2)')).toBe(6);
    expect(interpreter.input('y')).toBe(2);
})

test('multiple operations', () => {
    expect(interpreter.input('4 / 2 * 3')).toBe(6);
    expect(interpreter.input('4 + 3 * 2')).toBe(10);
    expect(interpreter.input('4 / 2 + 3')).toBe(5);
    expect(interpreter.input('5 * 3 % 4')).toBe(3);
    expect(interpreter.input('7 - 8 % 3')).toBe(5);
})

test('parentheses', () => {
    expect(interpreter.input('(4 + 2) * 3')).toBe(18);
    expect(interpreter.input('(8 - (4 + 2)) * 3')).toBe(6);
})