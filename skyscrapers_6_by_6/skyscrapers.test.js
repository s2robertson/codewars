const { 
    solvePuzzle,
    createInitialState,
    applyValues
} = require('./skyscrapers');

describe('Initial state generation', () => {
    test('No clues provided', () => {
        const testSetOneToSix = new Set([1, 2, 3, 4, 5, 6]);
        const testSetZeroToFive = new Set([0, 1, 2, 3, 4, 5]);
        const state = createInitialState();
        expect(state.squares).toBeArrayOfSize(6);
        expect(state.rows).toBeArrayOfSize(6);
        expect(state.cols).toBeArrayOfSize(6);
        for (let i = 0; i < 6; i++) {
            expect(state.squares[i]).toBeArrayOfSize(6);
            expect(state.rows[i].values).toBeArrayOfSize(6);
            expect(state.cols[i].values).toBeArrayOfSize(6);
            for (let j = 0; j < 6; j++) {
                expect(state.squares[i][j].value).toBeNil();
                expect(state.squares[i][j].values).toBeSetMatching(testSetOneToSix);
                expect(state.rows[i].values[j]).toBeSetMatching(testSetZeroToFive);
                expect(state.cols[i].values[j]).toBeSetMatching(testSetZeroToFive);
            }
        }
    })

    test('Clue provided: Column 0 top = 1', () => {
        const clues = new Array(24);
        clues.fill(0);
        clues[0] = 1;
        const state = createInitialState(clues);

        const testSetZeroToFive = new Set([0, 1, 2, 3, 4, 5]);
        const testSetOneToFive = new Set([1, 2, 3, 4, 5]);
        const testSetOneToSix = new Set([1, 2, 3, 4, 5, 6]);

        // row and column clues
        for (let i = 0; i < 6; i++) {
            expect(state.rows[i].left).toBe(0);
            expect(state.rows[i].right).toBe(0);
        }
        expect(state.cols[0].top).toBe(1);
        expect(state.cols[0].bottom).toBe(0);
        for (let i = 1; i < 6; i++) {
            expect(state.cols[i].top).toBe(0);
            expect(state.cols[i].bottom).toBe(0);
        }

        // square values
        expect(state.squares[0][0].value).toBe(6);
        for (let i = 1; i < 6; i++) {
            expect(state.squares[0][i].value).toBeNil();
            expect(state.squares[0][i].values).toBeSetMatching(testSetOneToFive);
            expect(state.squares[i][0].value).toBeNil();
            expect(state.squares[i][0].values).toBeSetMatching(testSetOneToFive);
            for (let j = 1; j < 6; j++) {
                expect(state.squares[i][j].value).toBeNil();
                expect(state.squares[i][j].values).toBeSetMatching(testSetOneToSix);
            }
        }

        // row/column value placements
        for (let i = 0; i < 5; i++) {
            expect(state.rows[0].values[i]).toBeSetMatching(testSetOneToFive);
            expect(state.cols[0].values[i]).toBeSetMatching(testSetOneToFive);
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                expect(state.rows[i].values[j]).toBeSetMatching(testSetZeroToFive);
                expect(state.cols[i].values[j]).toBeSetMatching(testSetZeroToFive);
            }
            expect(state.rows[i].values[5]).toBeSetMatching(testSetOneToFive);
            expect(state.cols[i].values[5]).toBeSetMatching(testSetOneToFive);
        }
    })

    test('Clue provided: Column 0 top = 6', () => {
        const clues = new Array(24);
        clues.fill(0);
        clues[0] = 6;
        const state = createInitialState(clues);

        // row and column clues
        for (let i = 0; i < 6; i++) {
            expect(state.rows[i].right).toBe(0);
            expect(state.rows[i].left).toBe(0);
        }
        expect(state.cols[0].top).toBe(6);
        expect(state.cols[0].bottom).toBe(0);
        for (let i = 1; i < 6; i++) {
            expect(state.cols[i].top).toBe(0);
            expect(state.cols[i].bottom).toBe(0);
        }

        const testSetOneToFive = new Set([1, 2, 3, 4, 5]);
        
        // square values
        const testSetValues = new Set([1, 2, 3, 4, 5, 6]);
        for (let i = 0; i < 6; i++) {
            expect(state.squares[i][0].value).toBe(i + 1);
            testSetValues.delete(i + 1);
            for (let j = 1; j < 6; j++) {
                expect(state.squares[i][j].value).toBeNil();
                expect(state.squares[i][j].values).toBeSetMatching(testSetValues);
            }
            testSetValues.add(i + 1);
        }

        // row value placements
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if (i !== j) {
                    expect(state.rows[i].values[j]).toBeSetMatching(testSetOneToFive);
                }
            }
        }

        // column value placements
        const testSetRows = [
            new Set([1, 2, 3, 4, 5]),
            new Set([0, 2, 3, 4, 5]),
            new Set([0, 1, 3, 4, 5]),
            new Set([0, 1, 2, 4, 5]),
            new Set([0, 1, 2, 3, 5]),
            new Set([0, 1, 2, 3, 4]),
        ];
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                if (i !== j) {
                    expect(state.cols[i].values[j]).toBeSetMatching(testSetRows[j]);
                }
            }
        }
    })

    test('Clue provided: Column 0 bottom = 1', () => {
        const clues = new Array(24);
        clues.fill(0);
        clues[17] = 1;
        const state = createInitialState(clues);

        const testSetZeroToFour = new Set([0, 1, 2, 3, 4]);
        const testSetZeroToFive = new Set([0, 1, 2, 3, 4, 5]);
        const testSetOneToFive = new Set([1, 2, 3, 4, 5]);
        const testSetOneToSix = new Set([1, 2, 3, 4, 5, 6])

        // row and column clues
        for (let i = 0; i < 6; i++) {
            expect(state.rows[i].right).toBe(0);
            expect(state.rows[i].left).toBe(0);
        }
        expect(state.cols[0].top).toBe(0);
        expect(state.cols[0].bottom).toBe(1);
        for (let i = 1; i < 6; i++) {
            expect(state.cols[i].top).toBe(0);
            expect(state.cols[i].bottom).toBe(0);
        }

        // square values
        expect(state.squares[5][0].value).toBe(6);
        for (let i = 0; i < 5; i++) {
            expect(state.squares[i][0].value).toBeNil();
            expect(state.squares[i][0].values).toBeSetMatching(testSetOneToFive);
            for (let j = 1; j < 6; j++) {
                expect(state.squares[i][j].value).toBeNil();
                expect(state.squares[i][j].values).toBeSetMatching(testSetOneToSix);
            }
        }
        for (let i = 1; i < 6; i++) {
            expect(state.squares[5][i].value).toBeNil();
            expect(state.squares[5][i].values).toBeSetMatching(testSetOneToFive);
        }

        // row value placements
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                expect(state.rows[i].values[j]).toBeSetMatching(testSetZeroToFive);
            }
            // value 5 can't be in column 0
            expect(state.rows[i].values[5]).toBeSetMatching(testSetOneToFive);
            expect(state.rows[5].values[i]).toBeSetMatching(testSetOneToFive);
        }

        // column value placements
        for (let i = 0; i < 5; i++) {
            expect(state.cols[0].values[i]).toBeSetMatching(testSetZeroToFour);
        }
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                expect(state.cols[i].values[j]).toBeSetMatching(testSetZeroToFive);
            }
            // value 5 can't be in row 5
            expect(state.cols[i].values[5]).toBeSetMatching(testSetZeroToFour);
        }
    })

    test('Clue provided: column 5 bottom = 6', () => {
        const clues = new Array(24);
        clues.fill(0);
        clues[12] = 6;
        const state = createInitialState(clues);

        // clues
        for (let i = 0; i < 6; i++) {
            expect(state.rows[i].left).toBe(0);
            expect(state.rows[i].right).toBe(0);
        }
        expect(state.cols[5].top).toBe(0);
        expect(state.cols[5].bottom).toBe(6);
        for (let i = 0; i < 5; i++) {
            expect(state.cols[i].top).toBe(0);
            expect(state.cols[i].bottom).toBe(0);
        }

        // square values
        const testSetValues = [
            new Set([1, 2, 3, 4, 5]),
            new Set([1, 2, 3, 4, 6]),
            new Set([1, 2, 3, 5, 6]),
            new Set([1, 2, 4, 5, 6]),
            new Set([1, 3, 4, 5, 6]),
            new Set([2, 3, 4, 5, 6])
        ];
        for (let i = 0; i < 6; i++) {
            expect(state.squares[i][5].value).toBe(6 - i)
            for (let j = 0; j < 5; j++) {
                expect(state.squares[i][j].value).toBeNil();
                expect(state.squares[i][j].values).toBeSetMatching(testSetValues[i]);
            }
        }
    })

    test('Clue provided: row 0 left = 1', () => {
        const clues = new Array(24);
        clues.fill(0);
        clues[23] = 1;
        const state = createInitialState(clues);

        // clues
        expect(state.rows[0].left).toBe(1);
        expect(state.rows[0].right).toBe(0);
        for (let i = 1; i < 6; i++) {
            expect(state.rows[i].left).toBe(0);
            expect(state.rows[i].right).toBe(0);
        }
        for (let i = 0; i < 6; i++) {
            expect(state.cols[i].top).toBe(0);
            expect(state.cols[i].bottom).toBe(0);
        }

        const testSetOneToFive = new Set([1, 2, 3, 4, 5]);
        const testSetOneToSix = new Set([1, 2, 3, 4, 5, 6]);

        // square values
        expect(state.squares[0][0].value).toBe(6);
        for (let i = 1; i < 6; i++) {
            expect(state.squares[0][i].value).toBeNil();
            expect(state.squares[0][i].values).toBeSetMatching(testSetOneToFive);
            for (let j = 1; j < 6; j++) {
                expect(state.squares[i][j].value).toBeNil();
                expect(state.squares[i][j].values).toBeSetMatching(testSetOneToSix);
            }
        }
    })

    test('Clue provided: row 5 right = 6', () => {
        const clues = new Array(24);
        clues.fill(0);
        clues[11] = 6;
        const state = createInitialState(clues);

        // clues
        expect(state.rows[5].left).toBe(0);
        expect(state.rows[5].right).toBe(6);
        for (let i = 0; i < 5; i++) {
            expect(state.rows[i].left).toBe(0);
            expect(state.rows[i].right).toBe(0);
        }
        for (let i = 0; i < 6; i++) {
            expect(state.cols[i].top).toBe(0);
            expect(state.cols[i].bottom).toBe(0);
        }

        // square values
        for (let i = 0; i < 6; i++) {
            expect(state.squares[5][i].value).toBe(6 - i);
        }
        const testSetValues = [
            new Set([1, 2, 3, 4, 5]),
            new Set([1, 2, 3, 4, 6]),
            new Set([1, 2, 3, 5, 6]),
            new Set([1, 2, 4, 5, 6]),
            new Set([1, 3, 4, 5, 6]),
            new Set([2, 3, 4, 5, 6])
        ];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 6; j++) {
                expect(state.squares[i][j].value).toBeNil();
                expect(state.squares[i][j].values).toBeSetMatching(testSetValues[j]);
            }
        }
    })
})

describe('applyValues tests', () => {
    test('Applying a value in all rows/columns except one should infer the missing one', () => {
        const state = createInitialState();
        applyValues(state, [
            {
                row: 0,
                col: 0,
                value: 1
            }, {
                row: 1,
                col: 1,
                value: 1
            }, {
                row: 2,
                col: 2,
                value: 1
            }, {
                row: 3,
                col: 3,
                value: 1
            }, {
                row: 4,
                col: 4,
                value: 1
            }
        ]);

        expect(state.squares[5][5].value).toBe(1);
    })

    test('Applying all values except one in a row should infer the missing one', () => {
        const state = createInitialState();
        applyValues(state, [
            {
                row: 0,
                col: 0,
                value: 1
            }, {
                row: 0,
                col: 1,
                value: 2
            }, {
                row: 0,
                col: 2,
                value: 3
            }, {
                row: 0,
                col: 3,
                value: 4
            }, {
                row: 0,
                col: 4,
                value: 5
            }
        ]);

        expect(state.squares[0][5].value).toBe(6);
    })

    test('Applying all values except one in a column should infer the missing one', () => {
        const state = createInitialState();
        applyValues(state, [
            {
                row: 0,
                col: 0,
                value: 6
            }, {
                row: 1,
                col: 0,
                value: 1
            }, {
                row: 2,
                col: 0,
                value: 5
            }, {
                row: 3,
                col: 0,
                value: 2
            }, {
                row: 4,
                col: 0,
                value: 4
            }
        ]);

        expect(state.squares[5][0].value).toBe(3);
    })

    test('Applying four values in a row and a fifth value in one of the empty columns should complete the row', () => {
        const state = createInitialState();
        applyValues(state, [
            {
                row: 0,
                col: 0,
                value: 1
            }, {
                row: 0,
                col: 1,
                value: 2
            }, {
                row: 0,
                col: 4,
                value: 5
            }, {
                row: 0,
                col: 5,
                value: 6
            }, {
                row: 1,
                col: 2,
                value: 4
            }
        ]);

        expect(state.squares[0][2].value).toBe(3);
        expect(state.squares[0][3].value).toBe(4);
    })

    test('Applying four values in a column and a fifth value in one of the empty rows should complete the column', () => {
        const state = createInitialState();
        applyValues(state, [
            {
                row: 0,
                col: 0,
                value: 1
            }, {
                row: 1,
                col: 0,
                value: 2
            }, {
                row: 4,
                col: 0,
                value: 5
            }, {
                row: 5,
                col: 0,
                value: 6
            }, {
                row: 2,
                col: 1,
                value: 4
            }
        ]);

        expect(state.squares[2][0].value).toBe(3);
        expect(state.squares[3][0].value).toBe(4);
    })
})

describe('Provided tests', () => {
    test.failing('Puzzle 1', () => {
        const clues =  [3, 2, 2, 3, 2, 1, 1, 2, 3, 3, 2, 2, 5, 1, 2, 2, 4, 3, 3, 2, 1, 2, 2, 4];
        const expected = [
            [ 2, 1, 4, 3, 5, 6],
            [ 1, 6, 3, 2, 4, 5],
            [ 4, 3, 6, 5, 1, 2],
            [ 6, 5, 2, 1, 3, 4],
            [ 5, 4, 1, 6, 2, 3],
            [ 3, 2, 5, 4, 6, 1]
        ];
        expect(solvePuzzle(clues)).toEqual(expected);
    })

    test.failing('Puzzle 2', () => {
        const clues = [0, 0, 0, 2, 2, 0, 0, 0, 0, 6, 3, 0, 0, 4, 0, 0, 0, 0, 4, 4, 0, 3, 0, 0];
        const expected = [
            [ 5, 6, 1, 4, 3, 2 ], 
            [ 4, 1, 3, 2, 6, 5 ], 
            [ 2, 3, 6, 1, 5, 4 ], 
            [ 6, 5, 4, 3, 2, 1 ], 
            [ 1, 2, 5, 6, 4, 3 ], 
            [ 3, 4, 2, 5, 1, 6 ]
        ];
        expect(solvePuzzle(clues)).toEqual(expected);
    })

    test.failing('Puzzle 3', () => {
        const clues = [0, 3, 0, 5, 3, 4, 0, 0, 0, 0, 0, 1, 0, 3, 0, 3, 2, 3, 3, 2, 0, 3, 1, 0];
        const expected = [
            [ 5, 2, 6, 1, 4, 3 ], 
            [ 6, 4, 3, 2, 5, 1 ], 
            [ 3, 1, 5, 4, 6, 2 ], 
            [ 2, 6, 1, 5, 3, 4 ], 
            [ 4, 3, 2, 6, 1, 5 ], 
            [ 1, 5, 4, 3, 2, 6 ]
        ];
        expect(solvePuzzle(clues)).toEqual(expected);
    })
})