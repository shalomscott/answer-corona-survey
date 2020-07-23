const { readFile } = require('fs').promises;

module.exports = async (filepath) => {
	const bitmap = await readFile(filepath);
	return new Buffer(bitmap).toString('base64');
};
