// https://www.codewars.com/kata/5679d5a3f2272011d700000d/javascript
// Create a 6-by-6 grid of skyscrapers.  
// Skyscrapers have heights of 1-6, and each row and column of the grid has one skyscraper of each height.
// The skyscrapers can be viewed from any side of the grid, with the number of visible skyscrapers depending on 
// their arrangement (taller skyscrapers can be seen behind shorter ones, but not the reverse).
// The 'clues' argument has restrictions on how many skyscrapers should be visible from the top/bottom of a column,
// or left/right of a row, or 0 for no restriction.
function solvePuzzle(clues) {
    const state = createInitialState(clues);
    return state.squares.map(row => row.map(square => square.value));
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
}

module.exports = {
    solvePuzzle,
    createInitialState
};