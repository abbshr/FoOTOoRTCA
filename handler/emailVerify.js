
module.exports = emailVerify;

var User = require('../models/user.js');
var mailService = require('../routes/mailer.js');

function emailVerify(req, res) {
	var token = req.params.token;
	function callback(err, user) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		if (!user) {
			req.flash('error', "用户不存在，验证毛线？");
			return res.redirect('/');
		}
		if (user.verify) {
			req.flash('error', "该邮箱已经被验证过了!");
			return res.redirect('/');
		} else {
			User.verify(token, verifyCallback);
		}
		
		function verifyCallback(err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.session.user = user;
			res.cookie('username', user.name, {maxAge:1000*60*60*24*30});
			req.flash('success', "验证完成，欢迎你～");
			res.redirect('/');
			mailService.sendWelcome(user.email, function (err) {
				if (err) console.log(err);
			});
		}
	}

	User.auth({verifyToken: token}, callback);
}