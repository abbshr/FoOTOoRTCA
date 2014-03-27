
var User = require('../models/user.js');
var checkRegist = require('../ctrlfunc/checkRegist.js');
var createHeadImg = require('../ctrlfunc/createHeadImg.js');
var mailService = require('../routes/mailer.js');

module.exports = doReg;

function doReg(req, res) {
	var currentUser = {
		name: req.body.name,
		pwd: req.body.pwd,
		email: req.body.email,
		job: req.body.job,
		info: req.body.info,
	};
	function authCallback(err, user) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		if (user) {
			req.flash('error', '该用户Id已存在！');
			return res.redirect('/reg');
		}
		var headimg = createHeadImg(currentUser.email, 50);
		currentUser.headimg = headimg;
		currentUser = new User(currentUser);
		currentUser.save(callback);
	}
	function callback(err, user){  //此处返回的user是数组！
		if (err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		function verifyCallback(err) {
			req.flash('success', '注册成功～将会有一封验证邮件发送到你刚才填写的邮箱,注意在24小时内激活你的账户');
			res.redirect('/');
		}
		mailService.verifyMail(user[0].verifyToken, currentUser.email, verifyCallback);
	}
	
	if (checkRegist(currentUser.name, currentUser.pwd, currentUser.email)) {
		User.auth({"name": currentUser.name}, authCallback);
	} else {
		req.flash('error', '注册信息格式有误！');
		res.redirect('/reg');
	}
}