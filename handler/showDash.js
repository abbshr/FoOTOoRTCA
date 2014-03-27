
var Room = require('../models/room.js');

module.exports = showDash;

function showDash(req, res) {
	var currentUser = req.session.user;
	function callback(err, rooms) {
		var passObj = {
			title: 'Hi~' + currentUser.name,
			rooms: rooms,
			user: currentUser,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		};
		res.render("dash", passObj);
	}
	if (!currentUser) {
		res.render('dash', {
			title: 'TeamChat—the best way to project communicate',
			user: currentUser
		});
	} else {
		Room.getRoom({"admin": currentUser.name}, callback);
	}
};