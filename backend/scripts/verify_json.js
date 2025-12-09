const fs = require('fs');
const vm = require('vm');
const path = require('path');

const filePath = path.join(__dirname, 'debug_final_v5.txt');
const content = fs.readFileSync(filePath, 'utf8');

try {
    const sandbox = { result: null };
    vm.runInNewContext('result = ' + content, sandbox);
    console.log("Valid JS Object!");
} catch (e) {
    console.log("Syntax Error:", e.message);
    if (e.stack) {
        // Try to find line number in stack or just use primitive check
        // Node's SyntaxError stack usually contains line:col
        console.log(e.stack.split('\n')[0]);
    }
}
