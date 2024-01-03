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
        const expressionTree = this.parseTokens(tokens);
        return expressionTree.eval(this.vars);
    }

    parseTokens(tokens, start = 0, end = tokens.length) {
        // first pass: assignments and bracket expressions
        const phase1 = [];
        for (let i = start; i < end; i++) {
            const token = tokens[i];
            if (token === '(') {
                const newEnd = findClosingBracket(i);
                phase1.push(this.parseTokens(tokens, i + 1, newEnd));
                i = newEnd;
            } else if (token === '=') {
                const identifier = phase1.pop();
                const rightSubtree = this.parseTokens(tokens, i + 1, end);
                phase1.push(new Assignment(identifier, rightSubtree));
                break;
            } else if (Interpreter.isNumber(token)) {
                phase1.push(new NumberValue(token));
            } else if (Interpreter.isIdentifier(token)) {
                phase1.push(new Identifier(token));
            } else {
                phase1.push(token);
            }
        }

        // second pass: multiplicative operators
        const phase2 = [];
        for (let i = 0; i < phase1.length; i++) {
            const token = phase1[i];
            if (token === '*') {
                const left = phase2.pop();
                const right = phase1[i + 1];
                phase2.push(new Multiplication(left, right));
                i++;
            } else if (token === '/') {
                const left = phase2.pop();
                const right = phase1[i + 1];
                phase2.push(new Division(left, right));
                i++;
            } else if (token === '%') {
                const left = phase2.pop();
                const right = phase1[i + 1];
                phase2.push(new Modulus(left, right));
                i++;
            } else {
                phase2.push(token);
            }
        }

        // final pass: addition and subtraction
        let treeRoot = phase2[0];
        for (let i = 1; i < phase2.length; i += 2) {
            const operator = phase2[i];
            const nextOperand = phase2[i + 1];
            if (operator === '+') {
                treeRoot = new Addition(treeRoot, nextOperand);
            } else if (operator === '-') {
                treeRoot = new Subtraction(treeRoot, nextOperand);
            } else {
                throw new Error(`Could not parse expression: ${tokens.slice(start, end)}`);
            }
        }
        return treeRoot;

        function findClosingBracket(start) {
            let numBrackets = 0;
            for (let i = start; i < tokens.length; i++) {
                if (tokens[i] === '(') {
                    numBrackets++;
                } else if (tokens[i] === ')') {
                    numBrackets--;
                    if (numBrackets === 0) {
                        return i;
                    }
                }
            }
            throw new Error(`Unclosed bracket: ${tokens.slice(start).join(' ')}`);
        }
    }
}

module.exports = Interpreter;