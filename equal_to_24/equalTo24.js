// https://www.codewars.com/kata/574e890e296e412a0400149c/javascript
// Given four numbers, determine if they can be combined (with +, -, *, and /) to make 24.
function equalTo24(a, b, c, d) {
    return equalToTarget(a, b, c, d, 24);
}

function equalToTarget(a, b, c, d, target) {
    for (const { ordering, groupSecondPair } of getOrderings(a, b, c, d)) {
        for (const x of combine2(ordering[0], ordering[1])) {
            // combine2(combine2(combine2(ordering[0], ordering[1]), ordering[2]), ordering[3])
            for (const y of combine2(x, ordering[2])) {
                for (const z of combine2(y, ordering[3])) {
                    if (isClose(z)) {
                        return getValStringPair(getValStringPair(getValStringPair(ordering[0], ordering[1], x), ordering[2], y), ordering[3], z)[1];
                    }
                }
            }

            // combine2(combine2(combine2(ordering[0], ordering[1]), ordering[3]), ordering[2])
            for (const y of combine2(x, ordering[3])) {
                for (const z of combine2(y, ordering[2])) {
                    if (isClose(z)) {
                        return getValStringPair(getValStringPair(getValStringPair(ordering[0], ordering[1], x), ordering[3], y), ordering[2], z)[1];
                    }
                }
            }

            // grouping the second pair will only yield new results for the first half of the orderings
            if (groupSecondPair) {
                // combine2(combine2(ordering[0], ordering[1]), combine2(ordering[2], ordering[3]))
                for (const y of combine2(ordering[2], ordering[3])) {
                    for (const z of combine2(x, y)) {
                        if (isClose(z)) {
                            return getValStringPair(getValStringPair(ordering[0], ordering[1], x), getValStringPair(ordering[2], ordering[3], y), z)[1];
                        }
                    }
                }
            }
        }
    }
    return "It's not possible!";

    // account for rounding errors
    function isClose(val) {
        return Math.abs(val - target) < 0.0000000001;
    }
}

function* getOrderings(a, b, c, d) {
    yield { ordering: [a, b, c, d], groupSecondPair: true };
    yield { ordering: [a, c, b, d], groupSecondPair: true };
    yield { ordering: [a, d, b, c], groupSecondPair: true };
    yield { ordering: [b, c, a, d], groupSecondPair: false };
    yield { ordering: [b, d, a, c], groupSecondPair: false };
    yield { ordering: [c, d, a, b], groupSecondPair: false };
}

function* combine2(x, y) {
    yield x + y;
    yield x - y;
    yield y - x;
    yield x * y;
    yield x / y;
    yield y / x;
}

function getValStringPair(val1, val2, target) {
    let x, xStr, y, yStr;
    if (Array.isArray(val1)) {
        [x, xStr] = val1;
    } else {
        x = val1;
        xStr = val1;
    }
    if (Array.isArray(val2)) {
        [y, yStr] = val2;
    } else {
        y = val2;
        yStr = val2;
    }

    if (x + y === target) {
        return [target, `(${xStr}+${yStr})`];
    } else if (x - y === target) {
        return [target, `(${xStr}-${yStr})`];
    } else if (y - x === target) {
        return [target, `(${yStr}-${xStr})`];
    } else if (x * y === target) {
        return [target, `(${xStr}*${yStr})`];
    } else if (x / y === target) {
        return [target, `(${xStr}/${yStr})`];
    } else if (y / x === target) {
        return [target, `(${yStr}/${xStr})`];
    }
    throw new Error(`getString called with bad arguments: ${val1}, ${val2}, ${target}`);
}

module.exports = equalTo24;