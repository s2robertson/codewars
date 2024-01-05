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

test('functions', () => {
    expect(() => interpreter.input('fn avg x y => (x + y) / 2')).not.toThrow();
    expect(interpreter.input('avg 4 2')).toBe(3);
    expect(() => interpreter.input('avg 7')).toThrow();
    expect(() => interpreter.input('avg 7 2 4')).toThrow();
})

test('invalid function: external variable not allowed', () => {
    interpreter.input('y = 3');
    expect(() => interpreter.input('fn add x => x + y')).toThrow('ERROR: Invalid identifier \'y\' in function body.');
})

test('nested function calls', () => {
    interpreter.input('fn avg x y => (x + y) / 2');
    interpreter.input('fn id x => x');
    expect(interpreter.input('avg id 5 id 7')).toBe(6);
})

test('naming conflicts', () => {
    interpreter.input('x = 4');
    expect(() => interpreter.input('fn x y => y')).toThrow();
    expect(() => interpreter.input('fn id x => x')).not.toThrow();
    expect(() => interpreter.input('id = 4')).toThrow();
})