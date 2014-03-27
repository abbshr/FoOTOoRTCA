
var User = require('../models/user.js');
module.exports = showSignPage;

function showSignPage(req, res) {
	var currentUser = req.session.user;
	var passObj = {
		title: 'TeamChat-SignIn',
		user: currentUser,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	};
	res.render('signPage', passObj);
}