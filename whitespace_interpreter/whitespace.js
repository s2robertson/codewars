// https://www.codewars.com/kata/52dc4688eca89d0f820004c6/javascript
// 'Whitespace' is an esolang that uses only spaces, tabs, and new-lines
// http://compsoc.dur.ac.uk/whitespace/tutorial.php

// to help with debugging
function unbleach (n) {
    if (n) return n.replace(/ /g, 's').replace(/\t/g, 't').replace(/\n/g, 'n');
}

// solution
function whitespace(code, input = '') {
    const stackCommands = {
        ' ': readNumberToStack,
        '\t ': readNumberAndDuplicateStackItem,
        '\t\n': readNumberAndDiscardBelowTopOfStack,
        '\n ': duplicateTopOfStack,
        '\n\t': swapTopStackElements,
        '\n\n': discardTopOfStack
    };
    const arithmeticCommands = {
        '  ': stackAddition,
        ' \t': stackSubtraction,
        ' \n': stackMultiplication,
        '\t ': stackDivision,
        '\t\t': stackRemainder
    };
    const heapAccessCommands = {
        ' ': addToHeap,
        '\t': readFromHeap
    };
    const ioCommands = {
        '  ': popStackAndOutputAsChar,
        ' \t': popStackAndOutputAsNumber,
        '\t ': readCharFromInput,
        '\t\t': readNumberFromInput
    };
    const flowControlCommands = {
        '\n\n': exitProgram
    }
    const commandTypes = {
        ' ': stackCommands,
        '\t ': arithmeticCommands,
        '\t\t': heapAccessCommands,
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
        if (stack.length <= stackIndex) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        stack.push(stack.at(-1 - stackIndex));
    }

    function readNumberAndDiscardBelowTopOfStack() {
        let num = readCodeNumber();
        if (num < 0 || num >= stack.length) {
            num = stack.length - 1;
        }
        stack.splice(-1 - num, num);
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

    // *** Arithmetic ***

    function stackAddition() {
        if (stack.length < 2) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(b + a);
    }

    function stackSubtraction() {
        if (stack.length < 2) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(b - a);
    }

    function stackMultiplication() {
        if (stack.length < 2) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(b * a);
    }

    function stackDivision() {
        if (stack.length < 2) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        const a = stack.pop();
        if (a === 0) {
            throw new Error(`Division by 0: position ${codePos - 2}`);
        }
        const b = stack.pop();
        stack.push(Math.floor(b / a));
    }

    function stackRemainder() {
        if (stack.length < 2) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        const a = stack.pop();
        if (a === 0) {
            throw new Error(`Division by 0: position ${codePos - 2}`);
        }
        const b = stack.pop();
        stack.push(b - a * Math.floor(b / a));
    }

    // *** Heap Access ***

    function addToHeap() {
        if (stack.length < 2) {
            throw new Error(`Not enough items on stack: position ${codePos - 3}`);
        }
        const val = stack.pop();
        const addr = stack.pop();
        heap[addr] = val;
    }

    function readFromHeap() {
        if (stack.length < 1) {
            throw new Error(`Not enough items on stack: position ${codePos - 3}`);
        }
        const addr = stack.pop();
        const val = heap[addr];
        if (val === undefined) {
            throw new Error(`Heap lookup failed: position ${codePos - 3}`);
        }
        stack.push(val);
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

    function readCharFromInput() {
        if (inputPos >= input.length) {
            throw new Error(`Attempting to read past end of input: position ${codePos - 2}`);
        }
        const char = input[inputPos++];
        if (stack.length < 1) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        const addr = stack.pop();
        heap[addr] = char.charCodeAt(0);
    }

    function readNumberFromInput() {
        const inputEnd = input.indexOf('\n', inputPos) + 1;
        if (inputEnd === 0) {
            throw new Error(`Attempting to read past end of input: position ${codePos - 2}`);
        }
        const num = parseInt(input.slice(inputPos, inputEnd));
        if (isNaN(num)) {
            throw new Error(`Invalid number in input: ${input.slice(inputPos, inputEnd)}`);
        }
        inputPos = inputEnd;
        if (stack.length < 1) {
            throw new Error(`Not enough items on stack: position ${codePos - 2}`);
        }
        const addr = stack.pop();
        heap[addr] = num;
    }

    // *** Flow Control ***

    function exitProgram() {
        if (inputPos < input.length) {
            throw new Error('Program ended with unread input');
        }
        return true;
    }
};

module.exports = whitespace;