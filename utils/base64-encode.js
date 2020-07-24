const { readFile } = require('fs').promises;

module.exports = (filepath) => readFile(filepath, { encoding: 'base64' });
