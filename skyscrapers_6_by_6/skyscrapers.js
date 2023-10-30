// https://www.codewars.com/kata/5679d5a3f2272011d700000d/javascript
// Create a 6-by-6 grid of skyscrapers.  
// Skyscrapers have heights of 1-6, and each row and column of the grid has one skyscraper of each height.
// The skyscrapers can be viewed from any side of the grid, with the number of visible skyscrapers depending on 
// their arrangement (taller skyscrapers can be seen behind shorter ones, but not the reverse).
// The 'clues' argument has restrictions on how many skyscrapers should be visible from the top/bottom of a column,
// or left/right of a row, or 0 for no restriction.
// This solution is probably massive overkill, but I wanted to explore how I might solve a more complicated
// constraint satisfaction problem.
function solvePuzzle(clues) {
    const state = createInitialState(clues);
    solveRecursively();
    return state.squares.map(row => row.map(square => square.value));

    function solveRecursively() {
        const line = findLineWithMRV(state);
        if (!line) return true; // no more empty squares!

        const successorUpdates = generatePossibleSuccessors(state, line);
        for (const update of successorUpdates) {
            const { undoStack, error } = applyValues(state, update);
            if (!error) {
                if (solveRecursively()) {
                    return true;
                }
            }
            undoStack.forEach(func => func());
        }
        return false;
    }
}

function createInitialState(clues) {
    const valuesArr = [1, 2, 3, 4, 5, 6];
    const rowsColsArr = [0, 1, 2, 3, 4, 5];
    const state = {
        squares: new Array(6),
        rows: new Array(6),
        cols: new Array(6)
    };
    for (let i = 0; i < 6; i++) {
        state.squares[i] = new Array(6);
        state.rows[i] = {
            values: new Array(6)
        };
        state.cols[i] = {
            values: new Array(6)
        };
        for (let j = 0; j < 6; j++) {
            state.squares[i][j] = {
                value: null,
                values: new Set(valuesArr)
            };
            state.rows[i].values[j] = new Set(rowsColsArr);
            state.cols[i].values[j] = new Set(rowsColsArr);
        }
    }

    if (clues) {
        const valuesToSet = [];
        for (let i = 0; i < 6; i++) {
            const top = clues[i];
            state.cols[i].top = top;
            if (top === 1) {
                valuesToSet.push({
                    row: 0,
                    col: i,
                    value: 6
                });
            } else if (top === 6) {
                for (let j = 0; j < 6; j++) {
                    valuesToSet.push({
                        row: j,
                        col: i,
                        value: j + 1
                    });
                }
            }

            const bottom = clues[17 - i];
            state.cols[i].bottom = bottom;
            if (bottom === 1) {
                valuesToSet.push({
                    row: 5,
                    col: i,
                    value: 6
                });
            } else if (bottom === 6) {
                for (let j = 0; j < 6; j++) {
                    valuesToSet.push({
                        row: j,
                        col: i,
                        value: 6 - j
                    });
                }
            }

            const right = clues[i + 6];
            state.rows[i].right = right;
            if (right === 1) {
                valuesToSet.push({
                    row: i,
                    col: 5,
                    value: 6
                });
            } else if (right === 6) {
                for (let j = 0; j < 6; j++) {
                    valuesToSet.push({
                        row: i,
                        col: j,
                        value: 6 - j
                    });
                }
            }

            const left = clues[23 - i];
            state.rows[i].left = left;
            if (left === 1) {
                valuesToSet.push({
                    row: i,
                    col: 0,
                    value: 6
                });
            } else if (left === 6) {
                for (let j = 0; j < 6; j++) {
                    valuesToSet.push({
                        row: i,
                        col: j,
                        value: j + 1
                    });
                }
            }
        }
        applyValues(state, valuesToSet);
    } else {
        for (let i = 0; i < 6; i++) {
            state.rows[i].left = 0;
            state.rows[i].right = 0;
            state.cols[i].top = 0;
            state.cols[i].bottom = 0;
        }
    }
    return state;
}

function applyValues(state, valuesToSet) {
    const undoStack = [];
    try {
        for (const params of valuesToSet) {
            const currentValue = state.squares[params.row][params.col].value;
            if (currentValue === params.value) {
                continue;
            } else if (currentValue != null) {
                throw new Error(`Attempting to set square (${params.row}, ${params.col}) to ${params.value} when it is already ${currentValue}`);
            }

            state.squares[params.row][params.col].value = params.value;
            undoStack.push(() => { state.squares[params.row][params.col].value = null });
            if (!testRowClues(params.row) || !testColClues(params.col)) {
                throw new Error(`Clue violation`);
            }

            for (let i = 0; i < 6; i++) {
                if (i !== params.col) {
                    // remove 'params.value' as a possible value for all other squares in row 'params.row'
                    removeSquareValue(params.row, i, params.value);
                    // in column 'i', remove row 'params.row' as a possible location for value 'params.value'
                    removeColValuePlacement(i, params.value - 1, params.row);
                }

                if (i !== params.row) {
                    // remove 'params.value' as a possible value for all other squares in column 'params.col'
                    removeSquareValue(i, params.col, params.value);
                    // in row 'i', remove column 'params.col' as a possible location for value 'params.value'
                    removeRowValuePlacement(i, params.value - 1, params.col)
                }

                if (i !== params.value - 1) {
                    // in row 'params.row', remove column 'params.col' as a possible location for values other than 'params.value'
                    removeRowValuePlacement(params.row, i, params.col);
                    // in column 'params.col', remove row 'params.row' as a possible location for values other than 'params.value'
                    removeColValuePlacement(params.col, i, params.row);
                }
            }
        }
    } catch (error) {
        return {
            undoStack,
            error
        }
    }

    return {
        undoStack
    };

    function removeSquareValue(row, col, value) {
        const pushUndo = state.squares[row][col].values.delete(value);
        if (pushUndo) {
            undoStack.push(() => state.squares[row][col].values.add(value));
            const newSize = state.squares[row][col].values.size;
            if (newSize === 0) {
                throw new Error('Square out of values');
            } else if (newSize === 1) {
                valuesToSet.push({
                    row, col,
                    value: state.squares[row][col].values.values().next().value
                });
            }
        }
    }

    function removeRowValuePlacement(row, value, pos) {
        const pushUndo = state.rows[row].values[value].delete(pos);
        if (pushUndo) {
            undoStack.push(() => state.rows[row].values[value].add(pos));
            const newSize = state.rows[row].values[value].size;
            if (newSize === 0) {
                throw new Error(`Value ${value} has no remaining locations in row ${row}`);
            } else if (newSize === 1) {
                valuesToSet.push({
                    row,
                    col: state.rows[row].values[value].values().next().value,
                    value: value + 1
                })
            }
        }
    }

    function removeColValuePlacement(col, value, pos) {
        const pushUndo = state.cols[col].values[value].delete(pos);
        if (pushUndo) {
            undoStack.push(() => state.cols[col].values[value].add(pos));
            const newSize = state.cols[col].values[value].size;
            if (newSize === 0) {
                throw new Error(`Value ${value} has no remaining locations in col ${col}`);
            } else if (newSize === 1) {
                valuesToSet.push({
                    row: state.cols[col].values[value].values().next().value,
                    col,
                    value: value + 1
                })
            }
        }
    }

    function testRowClues(row) {
        const line = new Array(6);
        for (let i = 0; i < 6; i++) {
            line[i] = state.squares[row][i].value;
            if (!line[i]) {
                // wait until the line is full
                return true;
            }
        }
        return testClues(line, state.rows[row].left, state.rows[row].right);
    }

    function testColClues(col) {
        const line = new Array(6);
        for (let i = 0; i < 6; i++) {
            line[i] = state.squares[i][col].value;
            if (!line[i]) {
                // wait until the line is full
                return true;
            }
        }
        return testClues(line, state.cols[col].top, state.cols[col].bottom);
    }
}

function findLineWithMRV(state) {
    let res = null;
    let resCount = 0;
    for (let i = 0; i < 6; i++) {
        let rowCount = 0;
        let colCount = 0;
        for (let j = 0; j < 6; j++) {
            if (!state.squares[i][j].value) {
                rowCount += state.squares[i][j].values.size;
            }
            if (!state.squares[j][i].value) {
                colCount += state.squares[j][i].values.size;
            }
        }
        const rowCountWithClues = rowCount - state.rows[i].left - state.rows[i].right;
        if (rowCount && (!res || rowCountWithClues < resCount)) {
            res = {
                type: 'row',
                index: i
            };
            resCount = rowCountWithClues;
        }
        const colCountWithClues = colCount - state.cols[i].top - state.cols[i].bottom;
        if (colCount && (!res || colCountWithClues < resCount)) {
            res = {
                type: 'col',
                index: i
            };
            resCount = colCountWithClues;
        }
    }
    return res;
}

function generatePossibleSuccessors(state, { type, index: i }) {
    const squareValues = {
        1: true, 2: true, 3: true, 4: true, 5: true, 6: true
    };
    // remove already set square values
    for (let j = 0; j < 6; j++) {
        const square = type === 'row' ? state.squares[i][j] : state.squares[j][i];
        if (square.value) {
            squareValues[square.value] = false;
        }
    }
    return generateRecursively([], 0);

    function generateRecursively(partial, j) {
        const res = [];
        if (j >= 6) {
            const [fromStart, fromEnd] = getClues();
            if (testClues(partial, fromStart, fromEnd)) {
                res.push(partial.map(valueToInstruction));
            }
        } else {
            const square = type === 'row' ? state.squares[i][j] : state.squares[j][i];
            if (square.value) {
                partial.push(square.value);
                res.push(...generateRecursively(partial, j + 1));
            } else {
                for (const val of square.values) {
                    if (squareValues[val]) {
                        squareValues[val] = false;
                        const newPartial = partial.concat(val);
                        res.push(...generateRecursively(newPartial, j + 1));
                        squareValues[val] = true;
                    }
                }
            }
        }
        return res;
    }

    function getClues() {
        if (type === 'row') {
            return [state.rows[i].left, state.rows[i].right];
        } else {
            return [state.cols[i].top, state.cols[i].bottom];
        }
    }

    function valueToInstruction(value, j) {
        return type === 'row' ? {
            row: i,
            col: j,
            value
        } : {
            row: j,
            col: i,
            value
        };
    }
}

function testClues(values, fromStart, fromEnd) {
    if (fromStart !== 0) {
        let greatestHeight = 0;
        let numVisible = 0;
        for (let i = 0; i < 6; i++) {
            if (values[i] > greatestHeight) {
                greatestHeight = values[i];
                numVisible++;
            }
        }
        if (numVisible !== fromStart) {
            return false;
        }
    }

    if (fromEnd !== 0) {
        let greatestHeight = 0;
        let numVisible = 0;
        for (let i = 5; i >= 0; i--) {
            if (values[i] > greatestHeight) {
                greatestHeight = values[i];
                numVisible++;
            }
        }
        if (numVisible !== fromEnd) {
            return false;
        }
    }

    return true;
}

module.exports = {
    solvePuzzle,
    createInitialState,
    applyValues,
    findLineWithMRV,
    generatePossibleSuccessors,
    testClues
};