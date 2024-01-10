// https://www.codewars.com/kata/52dc4688eca89d0f820004c6/javascript
// 'Whitespace' is an esolang that uses only spaces, tabs, and new-lines
// http://compsoc.dur.ac.uk/whitespace/tutorial.php

// to help with debugging
function unbleach (n) {
    if (n) return n.replace(/ /g, 's').replace(/\t/g, 't').replace(/\n/g, 'n');
}

// solution
function whitespace(code, input) {
    var output = '', stack = [], heap = {};
    // ...
    return output;
};

module.exports = whitespace;