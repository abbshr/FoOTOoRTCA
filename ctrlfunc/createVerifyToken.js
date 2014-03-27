
var crypto = require('crypto');

module.exports = createVerifyToken;

function createVerifyToken(base) {
	var md5 = crypto.createHash('md5');
	return md5.update(base).digest('hex');
}