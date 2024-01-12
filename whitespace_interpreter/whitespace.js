// https://www.codewars.com/kata/52dc4688eca89d0f820004c6/javascript
// 'Whitespace' is an esolang that uses only spaces, tabs, and new-lines
// https://web.archive.org/web/20150618184706/http://compsoc.dur.ac.uk/whitespace/tutorial.php

// to help with debugging
function unbleach (n) {
    if (n) return n.replace(/ /g, 's').replace(/\t/g, 't').replace(/\n/g, 'n');
}

// solution
function whitespace(rawCode, input = '') {
    let parsePos = 0;
    const labels = {};
    const executable = parseCode();

    let execPos = 0, inputPos = 0, finished = false;
    let output = '';
    const stack = [], heap = {}, callStack = [];
    while (!finished && execPos < executable.length) {
        const cmd = executable[execPos];
        if (cmd()) {
            // only the exit command should return a value
            finished = true;
        }
        execPos++;
    }

    if (!finished) {
        throw new Error('Unclean termination: programs should end with \'\\n\\n\\n\'')
    }
    return output;

    function parseCode() {
        const stackCommands = {
            ' ': makePushNumberToStack,
            '\t ': makeDuplicateNumberedStackItem,
            '\t\n': makeDiscardBelowTopOfStack,
            '\n ': makeDuplicateTopOfStack,
            '\n\t': makeSwapTopStackElements,
            '\n\n': makeDiscardTopOfStack
        };
        const arithmeticCommands = {
            '  ': makeStackAddition,
            ' \t': makeStackSubtraction,
            ' \n': makeStackMultiplication,
            '\t ': makeStackDivision,
            '\t\t': makeStackRemainder
        };
        const heapAccessCommands = {
            ' ': makeAddToHeap,
            '\t': makeReadFromHeap
        };
        const ioCommands = {
            '  ': makePopStackAndOutputAsChar,
            ' \t': makePopStackAndOutputAsNumber,
            '\t ': makeReadCharFromInput,
            '\t\t': makeReadNumberFromInput
        };
        const flowControlCommands = {
            '  ': makeLabel,
            ' \t': makeCallSubroutine,
            ' \n': makeJumpToLabel,
            '\t ': makeJumpToLabelIfZero,
            '\t\t': makeJumpToLabelIfNegative,
            '\t\n': makeReturnFromSubroutine,
            '\n\n': makeExitProgram
        }
        const commandTypes = {
            ' ': stackCommands,
            '\t ': arithmeticCommands,
            '\t\t': heapAccessCommands,
            '\t\n': ioCommands,
            '\n': flowControlCommands
        };

        const res = [];
        while (parsePos < rawCode.length) {
            const commandType = readCommandAndGetFromMap(commandTypes);
            if (!commandType) {
                throw new Error(`Invalid command at index ${parsePos - 2}`);
            }
            const command = readCommandAndGetFromMap(commandType);
            if (!command) {
                throw new Error(`Invalid command at index ${parsePos - 2}`);
            }
            res.push(command(parsePos, res.length));
        }
        return res;
    }

    function readChar() {
        while (parsePos < rawCode.length) {
            switch (rawCode[parsePos]) {
                case ' ':
                case '\t':
                case '\n':
                    return rawCode[parsePos++];
                default:
                    parsePos++;
            }
        }
        throw new Error('Parse error: unexpected end of program');
    }

    function readCommandAndGetFromMap(map) {
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

    function readLabel() {
        let label = '';
        while (true) {
            const char = readChar();
            if (char === ' ' || char === '\t') {
                label += char;
            } else {
                // char === '\n'
                break;
            }
        }
        return label;
    }

    // *** Stack Manipulation ***

    function makePushNumberToStack() {
        const num = readCodeNumber();
        return function pushNumberToStack() {
            stack.push(num);
        }
    }

    function makeDuplicateNumberedStackItem(codePos) {
        // 0-indexed
        const stackIndex = readCodeNumber();
        if (stackIndex < 0) {
            throw new Error(`Cannot accept negative numbers: position ${codePos - 3}`);
        }
        return function duplicateNumberedStackItem() {
            if (stack.length <= stackIndex) {
                throw new Error(`Not enough items on stack: position ${codePos - 3}`);
            }
            stack.push(stack.at(-1 - stackIndex));
        }
    }

    function makeDiscardBelowTopOfStack() {
        const codeNum = readCodeNumber();
        return function discardBelowTopOfStack() {
            const numToRemove = codeNum < 0 || codeNum >= stack.length ? stack.length - 1 : codeNum;
            stack.splice(-1 - numToRemove, numToRemove);
        }
    }

    function makeDuplicateTopOfStack(codePos) {
        return function duplicateTopOfStack() {
            if (stack.length === 0) {
                throw new Error(`Not enough items on stack: position ${codePos - 3}`);
            }
            stack.push(stack.at(-1));
        }
    }

    function makeSwapTopStackElements(codePos) {
        return function swapTopStackElements() {
            if (stack.length < 2) {
                throw new Error(`Not enough items on stack: position ${codePos - 3}`);
            }
            const x = stack.pop();
            const y = stack.pop();
            stack.push(x, y);
        }
    }

    function makeDiscardTopOfStack(codePos) {
        return function discardTopOfStack() {
            if (stack.length < 1) {
                throw new Error(`Not enough items on stack: position ${codePos - 3}`);
            }
            stack.pop();
        }
    }

    // *** Arithmetic ***

    function makeStackAddition(codePos) {
        return function stackAddition() {
            if (stack.length < 2) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            const a = stack.pop();
            const b = stack.pop();
            stack.push(b + a);
        }
    }

    function makeStackSubtraction(codePos) {
        return function stackSubtraction() {
            if (stack.length < 2) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            const a = stack.pop();
            const b = stack.pop();
            stack.push(b - a);
        }
    }

    function makeStackMultiplication(codePos) {
        return function stackMultiplication() {
            if (stack.length < 2) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            const a = stack.pop();
            const b = stack.pop();
            stack.push(b * a);
        }
    }

    function makeStackDivision(codePos) {
        return function stackDivision() {
            if (stack.length < 2) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            const a = stack.pop();
            if (a === 0) {
                throw new Error(`Division by 0: position ${codePos - 4}`);
            }
            const b = stack.pop();
            stack.push(Math.floor(b / a));
        }
    }

    function makeStackRemainder(codePos) {
        return function stackRemainder() {
            if (stack.length < 2) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            const a = stack.pop();
            if (a === 0) {
                throw new Error(`Division by 0: position ${codePos - 4}`);
            }
            const b = stack.pop();
            stack.push(b - a * Math.floor(b / a));
        }
    }

    // *** Heap Access ***

    function makeAddToHeap(codePos) {
        return function addToHeap() {
            if (stack.length < 2) {
                throw new Error(`Not enough items on stack: position ${codePos - 3}`);
            }
            const val = stack.pop();
            const addr = stack.pop();
            heap[addr] = val;
        }
    }

    function makeReadFromHeap(codePos) {
        return function readFromHeap() {
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
    }

    // *** I/O ***

    function makePopStackAndOutputAsChar(codePos) {
        return function popStackAndOutputAsChar() {
            const num = stack.pop();
            if (num === undefined) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            output += String.fromCharCode(num);
        }
    }

    function makePopStackAndOutputAsNumber(codePos) {
        return function popStackAndOutputAsNumber() {
            const num = stack.pop();
            if (num === undefined) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            output += num;
        }
    }

    function makeReadCharFromInput(codePos) {
        return function readCharFromInput() {
            if (inputPos >= input.length) {
                throw new Error(`Attempting to read past end of input: position ${codePos - 4}`);
            }
            const char = input[inputPos++];
            if (stack.length < 1) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            const addr = stack.pop();
            heap[addr] = char.charCodeAt(0);
        }
    }

    function makeReadNumberFromInput(codePos) {
        return function readNumberFromInput() {
            const inputEnd = input.indexOf('\n', inputPos);
            if (inputEnd === -1) {
                throw new Error(`Attempting to read past end of input: position ${codePos - 4}`);
            }
            const num = parseInt(input.slice(inputPos, inputEnd));
            if (isNaN(num)) {
                throw new Error(`Invalid number in input: ${input.slice(inputPos, inputEnd)}`);
            }
            inputPos = inputEnd + 1; // +1 to capture the terminating \n
            if (stack.length < 1) {
                throw new Error(`Not enough items on stack: position ${codePos - 4}`);
            }
            const addr = stack.pop();
            heap[addr] = num;
        }
    }

    // *** Flow Control ***

    function makeLabel(rawCodePos, execPos) {
        const label = readLabel();
        if (labels[label] != undefined) {
            throw new Error(`Duplicate label (${unbleach(label)}) at position ${rawCodePos - 3}`);
        }

        labels[label] = execPos;
        return () => {}; // return a no-op for consistency with other commands
    }

    function makeCallSubroutine(codePos) {
        const label = readLabel();
        return function callSubroutine() {
            if (labels[label] == undefined) {
                throw new Error(`Invalid label (${unbleach(label)}) at position ${codePos - 3}`);
            }
            callStack.push(execPos);
            execPos = labels[label];
        }
    }

    function makeJumpToLabel(codePos) {
        const label = readLabel();
        return function jumpToLabel() {
            if (labels[label] == undefined) {
                throw new Error(`Invalid label (${unbleach(label)}) at position ${codePos - 3}`);
            }
            execPos = labels[label];
        }
    }

    function makeJumpToLabelIfZero(codePos) {
        const label = readLabel();
        return function jumpToLabelIfZero() {
            if (labels[label] == undefined) {
                throw new Error(`Invalid label (${unbleach(label)}) at position ${codePos - 3}`)
            }

            if (stack.length < 1) {
                throw new Error(`Not enough items on stack: position ${codePos}`);
            }
            const val = stack.pop();
            if (val === 0) {
                execPos = labels[label];
            }
        }
    }

    function makeJumpToLabelIfNegative(codePos) {
        const label = readLabel();
        return function jumpToLabelIfNegative() {
            if (labels[label] == undefined) {
                throw new Error(`Invalid label (${unbleach(label)}) at position ${codePos - 3}`)
            }

            if (stack.length < 1) {
                throw new Error(`Not enough items on stack: position ${codePos}`);
            }
            const val = stack.pop();
            if (val < 0) {
                execPos = labels[label];
            }
        }
    }

    function makeReturnFromSubroutine(codePos) {
        return function returnFromSubroutine() {
            if (callStack.length < 1) {
                throw new Error(`Attempting to return from subroutine, but call stack is empty (position ${codePos - 3})`);
            }
            execPos = callStack.pop();
        }
    }

    function makeExitProgram() {
        return function exitProgram() {
            if (inputPos < input.length) {
                throw new Error('Program ended with unread input');
            }
            return true;
        }
    }
};

module.exports = whitespace;