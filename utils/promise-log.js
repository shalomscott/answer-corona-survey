module.exports = (message) => (result) => {
	console.log(message.replace('%s', result));
	return result;
};
