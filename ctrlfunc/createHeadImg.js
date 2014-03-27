var crypto = require('crypto');

function createHeadImg(email, size) {
	var md5 = crypto.createHash('md5'),
		email_MD5 = md5.update(email.toLowerCase()).digest('hex');
	return "http://www.gravatar.com/avatar/" + email_MD5 + "?s=" + size;
}

module.exports = createHeadImg;