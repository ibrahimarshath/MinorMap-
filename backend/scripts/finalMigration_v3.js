const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'debug_final_v2.txt');
const destPath = path.join(__dirname, '../controllers/quizBankController.js');

try {
    let content = fs.readFileSync(sourcePath, 'utf8');

    console.log('Starting Final Migration V3...');

    // Fix "set": 1, [ pattern -> "set1": [
    // This addresses the fintech anomaly
    content = content.replace(/"set"\s*:\s*(\d+)\s*,\s*\[/g, '"set$1": [');

    // Attempt Parse
    let parsed;
    try {
        parsed = eval('(' + content + ')');
    } catch (e) {
        console.error("Parse failed. Writing debug_final_v3.txt");
        fs.writeFileSync(path.join(__dirname, 'debug_final_v3.txt'), content, 'utf8');
        throw e;
    }

    console.log("Successfully parsed:", Object.keys(parsed));

    // Validate counts
    let totalQuestions = 0;
    Object.keys(parsed).forEach(k => {
        const sets = parsed[k].sets;
        let count = 0;
        if (sets) {
            Object.values(sets).forEach(s => count += s.length);
        }
        console.log(`- ${k}: ${count} questions`);
        totalQuestions += count;
    });
    console.log(`Total questions migrated: ${totalQuestions}`);

    const outputContent = `// Populated from questions.txt
// Exposes endpoints to list minors and fetch questions for a minor

const quizBank = ${JSON.stringify(parsed, null, 2)};

exports.quizBank = quizBank;
`;

    fs.writeFileSync(destPath, outputContent, 'utf8');


} catch (e) {
    console.error("Migration failed:", e.message);
    process.exit(1);
}
