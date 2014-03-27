
module.exports = userPanel;

var User = require('../models/user.js');

function userPanel(req, res) {
	var currentUser = req.session.user;
	var passObj = {
		title: '个人信息中心',
		user: currentUser,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	};
	res.render('panelPage', passObj);
}