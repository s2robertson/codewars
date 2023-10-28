expect.extend({
    toBeSetMatching(actual, expected) {
        if (!(expected instanceof Set)) {
            throw new Error('\'toBeSetMatching\' must be passed a Set');
        }

        let pass = actual instanceof Set;
        if (pass) {
            for (const val of actual.values()) {
                if (!expected.has(val)) {
                    pass = false;
                    break;
                }
            }
        }
        if (pass) {
            for (const val of expected.values()) {
                if (!actual.has(val)) {
                    pass = false;
                    break;
                }
            }
        }
        return pass ? {
            message: () => `expected ${stringifySet(actual)} not to be a Set matching ${stringifySet(expected)}`,
            pass: true
        } : {
            message: () => `expected ${stringifySet(actual)} to be a Set matching ${stringifySet(expected)}`,
            pass: false
        };
    }
})

function stringifySet(s) {
    return `Set(${s.size})[${Array.from(s)}]`;
}