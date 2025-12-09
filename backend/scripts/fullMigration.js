const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../../questions.txt');
const destPath = path.join(__dirname, '../controllers/quizBankController.js');

try {
    let content = fs.readFileSync(sourcePath, 'utf8');

    console.log('Starting migration...');

    // Remove export statement
    content = content.replace(/export const MINOR_QUESTIONS\s*=\s*/, '');

    // Fix common syntax issues
    // 1. Remove standalone commas (like line 118)
    content = content.replace(/\n\s*,\s*\n/g, '\n');

    // 2. Fix double commas
    content = content.replace(/,,+/g, ',');

    // 3. Fix trailing commas before closing braces/brackets
    content = content.replace(/,(\s*[}\]])/g, '$1');

    // 4. Fix minor key naming
    const nameMapping = {
        'ai_and_ml': 'ai-ml',
        'data_science': 'data-science',
        'iot': 'iot',
        'product_management_and_desgin': 'product-management-and-desgin',
        'fintech_blockchain': 'fintech-Block-chain',
        'blockchain_and_cybersecurity': 'blockchain-and-cybersecurity',
        'life_sciences': 'life-sciences',
        'energy_sciences': 'energy-sciences',
        'enterentrepreneurship': 'enterentrepreneurship'
    };

    for (const [oldKey, newKey] of Object.entries(nameMapping)) {
        const regex = new RegExp(`"${oldKey}"\\s*:\\s*{`, 'g');
        content = content.replace(regex, `"${newKey}": {`);
    }

    // Remove trailing semicolon
    content = content.trim().replace(/;$/, '');

    // Try to parse
    let parsedData;
    try {
        parsedData = JSON.parse(content);
    } catch (e) {
        console.error('JSON parse failed, trying eval...');
        try {
            parsedData = eval('(' + content + ')');
        } catch (e2) {
            console.error('Eval also failed:', e2.message);
            console.error('Saving intermediate content for debugging...');
            fs.writeFileSync(path.join(__dirname, 'debug_content.txt'), content, 'utf8');
            throw e2;
        }
    }

    console.log('Successfully parsed data');
    console.log('Found minors:', Object.keys(parsedData));

    // Write to destination
    const outputContent = `// Populated from questions.txt
// Exposes endpoints to list minors and fetch questions for a minor

const quizBank = ${JSON.stringify(parsedData, null, 2)};

exports.quizBank = quizBank;
`;

    fs.writeFileSync(destPath, outputContent, 'utf8');

    console.log("✓ Successfully migrated all minors from questions.txt");
    console.log("✓ Total minors:", Object.keys(parsedData).length);

} catch (e) {
    console.error("✗ Migration failed:", e.message);
    process.exit(1);
}
