const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../../questions.txt');
const destPath = path.join(__dirname, '../controllers/quizBankController.js');

try {
    let content = fs.readFileSync(sourcePath, 'utf8');

    console.log('Starting Final Migration V4...');

    // 0. Remove export
    content = content.replace(/export const MINOR_QUESTIONS\s*=\s*/, '');

    // 1. Basic JSON hygiene
    // Quote keys
    content = content.replace(/^([a-zA-Z0-9_]+)\s*:/gm, '"$1":');
    // spaces cleanup? Nah.

    // 2. Fix "set": { [ pattern -> "set": [
    // Covers "set1": { [ or "set": 1, [ (fintech case)
    content = content.replace(/"set\w*"\s*:\s*\{\s*\[/g, match => match.replace('{', ''));
    content = content.replace(/"set"\s*:\s*1\s*,\s*\[/g, '"set1": [');

    // 3. Fix Missing Object Closure: Transition between questions
    // Pattern:  options: [...] , {
    // We match the ] that ends "options", followed by optional comma/space, then { that starts next "id"
    // We replace ] ... { with ] }, {
    content = content.replace(/\]\s*(,)?\s*\{/g, '] }, {');

    // 4. Fix Missing Object Closure: End of Set
    // Pattern: options: [...] ]
    // We match ] ending "options", followed by ] ending "set"
    // We replace ] ] with ] } ]
    content = content.replace(/\]\s*\]/g, '] } ]');

    // 5. Fix double commas
    content = content.replace(/,(\s*,)+/g, ',');

    // 6. Name Mapping
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
        'enterentrepreneurship': 'entrepreneurship',
        'blockchain_cybersecurity': 'cybersecurity'
    };
    for (const [oldKey, newKey] of Object.entries(keyMap)) {
        content = content.replace(new RegExp(`"${oldKey}"\\s*:`, 'g'), `"${newKey}":`);
    }

    // 7. Fix trailing semicolon
    content = content.trim().replace(/;$/, '');

    // Attempt Parse
    let parsed;
    try {
        parsed = eval('(' + content + ')');
    } catch (e) {
        console.error("Parse failed. Writing debug_final_v4.txt");
        fs.writeFileSync(path.join(__dirname, 'debug_final_v4.txt'), content, 'utf8');
        // Analyze error position
        if (e.message.includes('position')) {
            const pos = parseInt(e.message.match(/position (\d+)/)[1]);
            console.error("Context:", content.substring(pos - 50, pos + 50));
        }
        throw e;
    }

    // Post-processing to normalize structure if needed (e.g. check if sets are ok)
    // Fintech check:
    if (parsed.fintech && parsed.fintech.sets && parsed.fintech.sets.set) {
        // Should act on this if set1 is missing
        if (!parsed.fintech.sets.set1) {
            parsed.fintech.sets.set1 = parsed.fintech.sets.set; // or parsed.fintech.sets[1] if array?
            // Wait, our regex replaced 'set': 1, [ with 'set1': [
            // So it should be fine.
        }
        delete parsed.fintech.sets.set;
    }

    console.log("Successfully parsed:", Object.keys(parsed));

    // Write
    const outputContent = `// Populated from questions.txt
// Exposes endpoints to list minors and fetch questions for a minor

const quizBank = ${JSON.stringify(parsed, null, 2)};

exports.quizBank = quizBank;
`;

    fs.writeFileSync(destPath, outputContent, 'utf8');
    console.log("Migration Success!");

} catch (e) {
    console.error("Migration failed:", e.message);
    process.exit(1);
}
