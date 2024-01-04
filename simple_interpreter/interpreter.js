// https://www.codewars.com/kata/53005a7b26d12be55c000243/javascript
// Extended: https://www.codewars.com/kata/52ffcfa4aff455b3c2000750/javascript

class NumberValue {
    constructor(value) {
        this.value = typeof value === 'number' ? value : parseFloat(value);
    }

    eval() {
        return this.value;
    }
}

class Identifier {
    constructor(id) {
        this.id = id;
    }

    eval(vars) {
        const res = vars.get(this.id);
        if (!res) {
            throw new Error(`ERROR: Invalid identifier. No variable with name '${this.id}' was found.`);
        }
        return res;
    }
}

class Operator {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
}

class Addition extends Operator {
    eval(vars) {
        return this.left.eval(vars) + this.right.eval(vars);
    }
}

class Subtraction extends Operator {
    eval(vars) {
        return this.left.eval(vars) - this.right.eval(vars);
    }
}

class Multiplication extends Operator {
    eval(vars) {
        return this.left.eval(vars) * this.right.eval(vars);
    }
}

class Division extends Operator {
    eval(vars) {
        return this.left.eval(vars) / this.right.eval(vars);
    }
}

class Modulus extends Operator {
    eval(vars) {
        return this.left.eval(vars) % this.right.eval(vars);
    }
}

class Assignment extends Operator {
    eval(vars) {
        const res = this.right.eval(vars);
        vars.set(this.left.id, res);
        return res;
    }
}

const operators = ['+', '-', '*', '/', '%'];

class Interpreter {
    constructor() {
        this.vars = new Map();
    }

    static tokenize(program) {
        const regex = /(?:[-+*\/\%=\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)/g;
        return program.match(regex);
    }

    static identifierRE = /^[A-Za-z_][A-Za-z0-9_]*$/
    static isIdentifier(token) {
        return this.identifierRE.test(token);
    }

    static numberRE = /^[0-9]*\.?[0-9]+$/
    static isNumber(token) {
        return this.numberRE.test(token);
    }

    input(expr) {
        const tokens = Interpreter.tokenize(expr);
        if (tokens.length === 0) return '';
        const expressionTree = this.parseExpression(tokens);
        return expressionTree.eval(this.vars);
    }

    parseExpression(tokens) {
        const astFragments = tokens.map(token => {
            if (Interpreter.isNumber(token)) {
                return new NumberValue(token);
            } else if (Interpreter.isIdentifier(token)) {
                return new Identifier(token);
            } else {
                return token;
            }
        });
        reduceAST(0);
        return astFragments[0];

        function reduceAST(start) {
            let i = start;
            while (true) {
                if (astFragments[i] === '(') {
                    // parse sub-expression
                    reduceAST(i + 1);
                    astFragments.splice(i, 3, astFragments[i + 1]);
                }
                // TODO: if astFragments[i] is a function, call reduceAST on i + 1, ... i + numArgs
                else if (astFragments[i] instanceof Identifier && astFragments[i + 1] === '=') {
                    // parse right subtree
                    reduceAST(i + 2);
                    astFragments.splice(i, 3, new Assignment(astFragments[i], astFragments[i + 2]));
                    break;
                } else if (operators.includes(astFragments[i + 1])) {
                    i += 2;
                } else {
                    break;
                }
            }
            const end = i;

            i = start;
            while (i < end) {
                if (astFragments[i] === '*') {
                    astFragments.splice(i - 1, 3, new Multiplication(astFragments[i - 1], astFragments[i + 1]));
                } else if (astFragments[i] === '/') {
                    astFragments.splice(i - 1, 3, new Division(astFragments[i - 1], astFragments[i + 1]));
                } else if (astFragments[i] === '%') {
                    astFragments.splice(i - 1, 3, new Modulus(astFragments[i - 1], astFragments[i + 1]));
                } else {
                    i++;
                }
            }

            i = start;
            while (i < end) {
                if (astFragments[i] === '+') {
                    astFragments.splice(i - 1, 3, new Addition(astFragments[i - 1], astFragments[i + 1]));
                } else if (astFragments[i] === '-') {
                    astFragments.splice(i - 1, 3, new Subtraction(astFragments[i - 1], astFragments[i + 1]));
                } else {
                    i++;
                }
            }
        }
    }    
}

module.exports = Interpreter;