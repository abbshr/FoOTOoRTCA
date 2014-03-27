
var User = require('../models/user.js');

module.exports = doLog;

function doLog(req, res) {
	var user = {
		name: req.body.name,
		pwd: req.body.pwd,
	};
	function authCallback(err, user) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/signin');
		}
		if (user) {
			req.flash('success', '登录成功！');
			req.session.user = user;
			res.cookie('username', req.body.name, {maxAge:1000*60*60*24*30});
			res.redirect('/');
		} else {
			req.flash('error', '用户名或密码错误！');
			res.redirect('/signin');
		}
	}
	User.auth(user, authCallback);
}