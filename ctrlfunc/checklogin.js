function checkLogin(req, res, next) {   //登录之后才能继续操作
	if (!req.session.user) {
		req.flash('error', '请登录！');
		return res.redirect('/signin');
	}
	next();
}

module.exports = checkLogin;
