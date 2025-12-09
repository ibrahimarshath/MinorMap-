const fs = require('fs');
const path = require('path');

// We use debug_cleaned.txt as source because it has the basic syntax layout (quotes etc) correct, 
// just missing the structural braces.
const sourcePath = path.join(__dirname, 'debug_cleaned.txt');
const destPath = path.join(__dirname, '../controllers/quizBankController.js');

try {
    let content = fs.readFileSync(sourcePath, 'utf8');

    console.log('Starting Corrected Final Migration...');

    // 1. Fix "set": { [ pattern -> "set": [
    // (This handles the multiline set start issue)
    content = content.replace(/("set\w*"\s*:\s*)\{\s*\[/g, '$1[');

    // 2. Fix the closing ] } pattern -> ]
    content = content.replace(/]\s*}/g, ']');

    // 3. Fix Missing Object Closures BETWEEN questions
    // Pattern:  ] , {   OR   ] {
    // We want:  ] }, {
    // We match the ] that ends "options", followed by optional comma/space, then { that starts next "id"
    content = content.replace(/\]\s*(,)?\s*\{/g, '] }, {');

    // 4. Fix Missing Object Closure at END of set
    // Pattern:  ] ]
    // We want:  ] } ]
    // We match ] ending "options", followed by ] ending "set"
    content = content.replace(/\]\s*\]/g, '] } ]');

    // 5. Cleanup double commas if any were introduced
    content = content.replace(/,(\s*,)+/g, ',');

    // 6. Final check: remove trailing comma before } or ]
    content = content.replace(/,\s*}/g, '}');
    content = content.replace(/,\s*]/g, ']');

    // 7. Name Mapping (Safe re-application)
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
        // Replace key only
        content = content.replace(new RegExp(`"${oldKey}"\\s*:`, 'g'), `"${newKey}":`);
    }

    // Attempt Parse
    let parsed;
    try {
        parsed = eval('(' + content + ')');
    } catch (e) {
        console.error("Parse failed. Writing debug_final_v2.txt");
        fs.writeFileSync(path.join(__dirname, 'debug_final_v2.txt'), content, 'utf8');
        throw e;
    }

    console.log("Successfully parsed:", Object.keys(parsed));

    // Verify some counts
    Object.keys(parsed).forEach(k => {
        const sets = parsed[k].sets;
        const setKeys = sets ? Object.keys(sets) : [];
        console.log(`- ${k}: ${setKeys.length} sets`);
    });

    const outputContent = `// Populated from questions.txt
// Exposes endpoints to list minors and fetch questions for a minor

const quizBank = ${JSON.stringify(parsed, null, 2)};

exports.quizBank = quizBank;
`;

    fs.writeFileSync(destPath, outputContent, 'utf8');
    console.log("Migration Success!");

} catch (e) {
    console.error("Migration failed:", e.message);
}
