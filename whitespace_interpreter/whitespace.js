// https://www.codewars.com/kata/52dc4688eca89d0f820004c6/javascript
// 'Whitespace' is an esolang that uses only spaces, tabs, and new-lines
// http://compsoc.dur.ac.uk/whitespace/tutorial.php

// to help with debugging
function unbleach (n) {
    if (n) return n.replace(/ /g, 's').replace(/\t/g, 't').replace(/\n/g, 'n');
}

// solution
function whitespace(code, input) {
    const stackCommands = {
        ' ': readNumberToStack,
        '\t ': readNumberAndDuplicateStackItem,
        '\n ': duplicateTopOfStack,
        '\n\t': swapTopStackElements,
        '\n\n': discardTopOfStack
    };
    const ioCommands = {
        '  ': popStackAndOutputAsChar,
        ' \t': popStackAndOutputAsNumber
    };
    const flowControlCommands = {
        '\n\n': exitProgram
    }
    const commandTypes = {
        ' ': stackCommands,
        '\t\n': ioCommands,
        '\n': flowControlCommands
    };
    let output = '', stack = [], heap = {};
    let codePos = 0, inputPos = 0;
    while (true) {
        const commands = readAndGetFromMap(commandTypes);
        if (!commands) {
            throw new Error(`Invalid command at index ${codePos - 2}`);
        }
        const cmd = readAndGetFromMap(commands);
        if (!cmd) {
            throw new Error(`Invalid command at index ${codePos - 2}`);
        }

        if (cmd()) {
            // only the exit command should return a value
            break;
        }
    }
    return output;

    function readChar() {
        while (codePos < code.length) {
            switch (code[codePos]) {
                case ' ':
                case '\t':
                case '\n':
                    return code[codePos++];
                default:
                    codePos++;
            }
        }
        throw new Error('Unclean termination: programs should end with \'\\n\\n\\n\'');
    }

    function readAndGetFromMap(map) {
        let name = readChar();
        if (map[name]) {
            return map[name];
        } else {
            name += readChar();
            return map[name];
        }
    }

    function readCodeNumber() {
        let sign;
        const signChar = readChar();
        if (signChar === ' ') {
            sign = 1;
        } else if (signChar === '\t') {
            sign = -1;
        } else {
            // signChar === '\n'
            throw new Error('Invalid number encountered: no sign digit');
        }

        let num = 0;
        while (true) {
            const char = readChar();
            if (char === ' ') {
                // ' ' = 0
                num *= 2;
            } else if (char === '\t') {
                // '\t' = 1
                num *= 2;
                num += 1;
            } else if (char === '\n') {
                return sign * num;
            }
        }
    }

    // *** Stack Manipulation ***

    function readNumberToStack() {
        const num = readCodeNumber();
        stack.push(num);
    }

    function readNumberAndDuplicateStackItem() {
        // 0-indexed
        const stackIndex = readCodeNumber();
        if (stack.length < stackIndex) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        stack.push(stack.at(-1 - stackIndex));
    }

    function duplicateTopOfStack() {
        if (stack.length === 0) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        stack.push(stack.at(-1));
    }

    function swapTopStackElements() {
        if (stack.length < 2) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        const x = stack.pop();
        const y = stack.pop();
        stack.push(x, y);
    }

    function discardTopOfStack() {
        if (stack.length < 1) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        stack.pop();
    }

    // *** I/O ***

    function popStackAndOutputAsChar() {
        const num = stack.pop();
        if (num === undefined) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        output += String.fromCharCode(num);
    }

    function popStackAndOutputAsNumber() {
        const num = stack.pop();
        if (num === undefined) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        output += num;
    }

    // *** Flow Control ***

    function exitProgram() {
        return true;
    }
};

module.exports = whitespace;