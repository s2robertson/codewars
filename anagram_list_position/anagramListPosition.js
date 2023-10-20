// https://www.codewars.com/kata/53e57dada0cb0400ba000688/javascript
// Find the position of 'word' in a sorted list of all its possible anagrams
// N.B. 'word' needs to be all in one case
function listPosition(word) {
    const letterCounts = {};
    for (const letter of word) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
    const letters = Object.keys(letterCounts).sort();

    // find all factorials up to (word.length - 1)!
    const factorials = new Array(word.length);
    factorials[0] = 1;
    for (let i = 1; i < word.length; i++) {
        factorials[i] = i * factorials[i - 1];
    }

    // if any letters occur more than once, then we need to divide by the number of duplicate permutations
    // (e.g. the string 'AA' only counts as one anagram, not two)
    let overallDivisor = 1;
    for (const letter of letters) {
        overallDivisor *= factorials[letterCounts[letter]];
    }

    // recalculate divisor with one fewer of a letter
    function getDivisorForLetter(letter) {
        const letterCount = letterCounts[letter];
        return (overallDivisor / factorials[letterCount]) * factorials[letterCount - 1];
    }

    let res = 1;
    // step through 'word' letter by letter
    for (let i = 0; i < word.length; i++) {
        const letterI = word[i];

        // if there are unaccounted-for letters that come before letterI, find the number
        // of anagrams beginning with each of them
        for (let j = 0; letters[j] < letterI; j++) {
            if (letterCounts[letters[j]] > 0) {
                res += factorials[word.length - i - 1] / getDivisorForLetter(letters[j]);
            }
        }

        // now exclud letterI from future loops
        overallDivisor = getDivisorForLetter(letterI);
        letterCounts[letterI] -= 1;
    }
    return res;
}

module.exports = listPosition;