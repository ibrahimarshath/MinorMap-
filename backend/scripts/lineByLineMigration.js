const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../../questions.txt');
const destPath = path.join(__dirname, '../controllers/quizBankController.js');

try {
    const rawLines = fs.readFileSync(sourcePath, 'utf8').split('\n');
    let output = '';

    // Name mapping table
    const keyMap = {
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

    let insideSet = false;

    for (let i = 0; i < rawLines.length; i++) {
        let line = rawLines[i].trim();

        // Skip Comments or Export
        if (line.startsWith('export const')) {
            output += '{\n'; // Start JSON object
            continue;
        }

        // Fix Keys: key: -> "key":
        // But ignore URLs or text inside quotes. 
        // Simple regex for keys at start of line
        line = line.replace(/^([a-zA-Z0-9_]+)\s*:/, '"$1":');

        // Apply Name Mapping
        for (const [oldKey, newKey] of Object.entries(keyMap)) {
            if (line.includes(`"${oldKey}"`)) {
                line = line.replace(`"${oldKey}"`, `"${newKey}"`);
            }
        }

        // Fix "setX": { [ -> "setX": [
        if (/"set\d+"\s*:\s*\{\s*\[/.test(line)) {
            line = line.replace(/:\s*\{\s*\[/, ': [');
            insideSet = true;
        }
        // Handling the split line case where { is on one line and [ on next is hard line-by-line
        // So we will do a second pass on the full string for that.

        // Accumulate
        output += line + '\n';
    }

    // Second pass: full string corrections
    let content = output;

    // 1. Fix "set": { [ ... ] } pattern across lines
    // Transform "set": { [  --> "set": [
    // We match "set...": \s* \{ \s* \[
    content = content.replace(/("set\d+")\s*:\s*\{\s*\[/g, '$1: [');

    // 2. Fix the closing brace for that pattern: ] } --> ]
    // This is risky if strict, but in this file, sets end with ] } or ],
    // We'll replace ]\s*} with ]
    content = content.replace(/]\s*}/g, ']');

    // 3. Fix double commas or stray commas
    content = content.replace(/,(\s*,)+/g, ',');
    content = content.replace(/,\s*}/g, '}');
    content = content.replace(/,\s*]/g, ']');

    // 4. Quote unquoted keys deep in objects (id: type: question: options:)
    // We can run specific replaces for known keys
    content = content.replace(/([{,]\s*)id\s*:/g, '$1"id":');
    content = content.replace(/([{,]\s*)type\s*:/g, '$1"type":');
    content = content.replace(/([{,]\s*)question\s*:/g, '$1"question":');
    content = content.replace(/([{,]\s*)options\s*:/g, '$1"options":');

    // 5. Cleanup start/end
    content = content.trim();
    if (content.endsWith(';')) content = content.slice(0, -1);

    // Validate JSON
    let parsed;
    try {
        parsed = eval('(' + content + ')');
    } catch (e) {
        console.error("Eval failed on cleaned content. Writing debug_cleaned.txt");
        fs.writeFileSync(path.join(__dirname, 'debug_cleaned.txt'), content, 'utf8');
        throw e;
    }

    console.log("Successfully parsed minors:", Object.keys(parsed));

    const finalFile = `// Populated from questions.txt
// Exposes endpoints to list minors and fetch questions for a minor

const quizBank = ${JSON.stringify(parsed, null, 2)};

exports.quizBank = quizBank;
`;

    fs.writeFileSync(destPath, finalFile, 'utf8');
    console.log("Migration complete.");

} catch (e) {
    console.error("Migration script failed:", e);
}
