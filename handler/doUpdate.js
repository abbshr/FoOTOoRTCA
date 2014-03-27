
module.exports = doUpdate;

var User = require('../models/user.js');

var checkRegist = require('../ctrlfunc/checkRegist.js'),
	filter = require('../ctrlfunc/filter.js'),
	createHeadImg = require('../ctrlfunc/createHeadImg.js');

function doUpdate(req, res) {
	var currentUser = req.session.user,
		updateInfo = {};
	var regexp = /,|，/;
	var uniq = filter.uniq,
		rspInner = filter.rspInner,
		rspAll = filter.rspAll;
	updateInfo['pwd'] = req.body.pwd;
	updateInfo['email'] = req.body.email;
	updateInfo['name'] = currentUser.name;
	updateInfo['info'] = updateInfo['info'] ? filter.removeSpace(updateInfo['info']) : '';
	updateInfo['job'] = updateInfo['job'] ? String.prototype.split.call(updateInfo['job'], regexp, 10) : [''];
	updateInfo['job'] = uniq(rspInner(rspAll(updateInfo['job'])));
	updateInfo['headimg'] = createHeadImg(req.body.email, 50);
	if (!checkRegist(currentUser.name, updateInfo.pwd, updateInfo.email)) {
		req.flash('error', '信息格式不符！')
		return res.redirect('/user');
	}
	function callback(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/user');
		}
		req.session.user = updateInfo;
		return res.redirect('/user');
	}

	User.control(currentUser.name, updateInfo, callback);
}