

var User = require('../models/user.js');
module.exports = showRegPage;

function showRegPage(req, res) {
	var currentUser = req.session.user; 
	var passObj = {
		title: "TeamChat-Regist",
		user: currentUser,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	};
	res.render('regPage', passObj);
};