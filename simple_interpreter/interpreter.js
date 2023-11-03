// https://www.codewars.com/kata/53005a7b26d12be55c000243/javascript

class NumberValue {
    constructor(value) {
        this.value = value;
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

class BracketExpression {
    constructor(subtree) {
        this.subtree = subtree;
    }

    eval(vars) {
        return this.subtree.eval(vars);
    }
}

class Interpreter {
    constructor() {
        this.vars = new Map();
    }

    static tokenize(program) {
        const regex = /\s*([-+*\/\%=\(\)]|[A-Za-z_][A-Za-z0-9_]*|[0-9]*\.?[0-9]+)\s*/g;
        return program.split(regex).filter(s => /\S/.test(s));
    }

    static identifierRE = /^[A-Za-z_][A-Za-z0-9_]*$/
    static isIdentifier(token) {
        return this.identifierRE.test(token);
    }

    static numberRE = /^[0-9]*\.?[0-9]+$/

    input(expr) {
        const tokens = Interpreter.tokenize(expr);
        if (tokens.length === 0) return '';
        const expressionTree = Interpreter.parseTokens(tokens);
        return expressionTree.eval(this.vars);
    }

    static parseTokens(tokens, start = 0, end = tokens.length) {
        const classes = {
            '+': Addition,
            '-': Subtraction,
            '*': Multiplication,
            '/': Division,
            '%': Modulus
        }
        let treeRoot = null;
        for (let i = start; i < end; i++) {
            const token = tokens[i];
            let nextToken;
            let Op;
            switch (token) {
                case '+':
                case '-':
                    Op = classes[token];
                    [nextToken, i] = parseFactor(i + 1);
                    treeRoot = new Op(treeRoot, nextToken);
                    break;
                case '*':
                case '/':
                case '%':
                    Op = classes[token];
                    [nextToken, i] = parseFactor(i + 1);
                    if (treeRoot instanceof Addition || treeRoot instanceof Subtraction) {
                        treeRoot.right = new Op(treeRoot.right, nextToken);
                    } else {
                        treeRoot = new Op(treeRoot, nextToken);
                    }
                    break;
                case '=':
                    const rightSubtree = this.parseTokens(tokens, i + 1, end);
                    if (treeRoot instanceof Operator) {
                        treeRoot.right = new Assignment(treeRoot.right, rightSubtree);
                    } else {
                        treeRoot = new Assignment(treeRoot, rightSubtree);
                    }
                    return treeRoot;
                default:
                    [treeRoot, i] = parseFactor(i);
                    treeRoot = new Addition(new NumberValue(0), treeRoot);
                    break;
            }
        }
        return treeRoot;

        function parseFactor(index) {
            const token = tokens[index];
            if (token === '(') {
                const newEnd = findClosingBracket(index);
                const subtree = Interpreter.parseTokens(tokens, index + 1, newEnd);
                return [new BracketExpression(subtree), newEnd];
            } else if (Interpreter.isIdentifier(token)) {
                return [new Identifier(token), index];
            } else {
                return [new NumberValue(parseFloat(token)), index];
            }
        }

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