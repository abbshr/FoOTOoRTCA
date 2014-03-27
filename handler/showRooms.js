
var Room = require('../models/room.js');
module.exports = showRoom;

function showRoom(req, res) {
	var currentUser = req.session.user;
	var queryStr = req.query.roomtitle,
		queryRoom = queryStr ? {title: unescape(queryStr)} : {};
	queryStr = queryStr ? unescape(queryStr) : 'All';
	function callback(err, rooms) {
		var passObj = {
			title: 'Room-' + queryStr,
			rooms: rooms,
			user: currentUser,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		};
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('roomsPage', passObj);
	}
	Room.getRoom(queryRoom, callback);
}