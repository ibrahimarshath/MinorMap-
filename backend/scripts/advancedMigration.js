const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../../questions.txt');
const destPath = path.join(__dirname, '../controllers/quizBankController.js');

try {
    let content = fs.readFileSync(sourcePath, 'utf8');

    console.log('Starting advanced migration...');

    // 1. Remove export statement
    content = content.replace(/export const MINOR_QUESTIONS\s*=\s*/, '');

    // 2. Fix specific known structural errors

    // Fix "set1": { [ ... ] } -> "set1": [ ... ]
    // Pattern: "set1": {\s*\[ -> "set1": [
    content = content.replace(/"set\d+":\s*{\s*\[/g, (match) => {
        return match.replace(/{/, '');
    });

    // Fix the closing } ] } -> ] } (This is tricky, simplistic approach: replace ]\s*} with ])
    // Actually, if we remove the opening {, the closing } will be extra.
    // The previous structure was likely "set": { method: [ ... ] } or just a typo.
    // Let's assume it was a typo where they wrapped the array in an object.

    // Let's try to normalize by ensuring all keys are quoted
    content = content.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');

    // 3. Fix syntax errors
    // Remove "set1": { [ ... ] } artifacts. 
    // If we replaced "set1": { [ with "set1": [, we have an unmatched }.
    // It's probably safer to parse this 'loosely' or fix specifically.

    // Let's look at the specific error in data-science set1:
    // "set1": {
    //  [
    // ...
    //  ]
    // }
    // We need to remove that wrapping {}

    // Strategy: Replace "setX": { [ with "setX": [ and the corresponding closing ] } with ]

    // However, keeping it simple: use Function constructor to evaluate loose JS object text
    // But first, we MUST fix invalid syntax that even JS eval can't handle.
    // arrays inside objects without keys? { [ ... ] } is invalid in JS object literal unless it's a computed property key which [ ... ] isn't here.

    // Fix: "set": { [ ... ] } -> "set": [ ... ]
    content = content.replace(/:\s*{\s*\[/g, ': [');
    content = content.replace(/]\s*}/g, ']');

    // Fix stray commas like `,\n ,` or `,\n }`
    // Convert multiple commas to one
    content = content.replace(/,(\s*,)+/g, ',');

    // Remove trailing commas before closing braces
    content = content.replace(/,\s*}/g, '}');
    content = content.replace(/,\s*]/g, ']');

    // Fix: line 118 in original file `,\n \n ,`
    content = content.replace(/,\s*,/g, ',');

    // Fix variable names for Minors
    const nameMapping = {
        'ai_and_ml': 'ai-ml',
        'data_science': 'data-science',
        'iot': 'iot',
        'product_management_and_desgin': 'pm-design',
        'product_management': 'pm-design',
        'fintech_blockchain': 'fintech',
        'blockchain_and_cybersecurity': 'cybersecurity',
        'life_sciences': 'life-sci',
        'life_science': 'life-sci',
        'energy_sciences': 'energy',
        'enterentrepreneurship': 'entrepreneurship'
    };

    // Apply name mapping
    for (const [oldKey, newKey] of Object.entries(nameMapping)) {
        // Look for the key at the start of the object definition
        const regex = new RegExp(`"${oldKey}"\\s*:\\s*{`, 'g');
        content = content.replace(regex, `"${newKey}": {`);

        // Also handling unquoted keys if they exist
        const regexUnquoted = new RegExp(`\\b${oldKey}\\b\\s*:\\s*{`, 'g');
        content = content.replace(regexUnquoted, `"${newKey}": {`);
    }

    // Evaluate
    // We wrap in parentheses to evaluate as expression
    let parsedData;
    try {
        // Clean up trailing semicolon
        content = content.trim().replace(/;$/, '');
        parsedData = eval('(' + content + ')');
    } catch (e) {
        console.error("Eval failed. Dumping snippet around error...");
        // simple error check
        throw e;
    }

    console.log("Parsed Minors:", Object.keys(parsedData));

    // Normalize Data Structure
    // Ensure "sets" exists and "minor" name exists
    // The frontend expects keys like 'ai-ml', 'data-science'.
    // The previous mapping handles renaming, but let's check content.

    const outputContent = `// Populated from questions.txt
// Exposes endpoints to list minors and fetch questions for a minor

const quizBank = ${JSON.stringify(parsedData, null, 2)};

exports.quizBank = quizBank;
`;

    fs.writeFileSync(destPath, outputContent, 'utf8');

    console.log("Migration successful!");

} catch (e) {
    console.error("Migration failed:", e);
    process.exit(1);
}
