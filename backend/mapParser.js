const fs = require('fs');

function parseMap(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // to avoid parsing errors, here i filter the empty lines
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const grid = lines.map(line => line.split(''));
    return grid;
}

module.exports = { parseMap };