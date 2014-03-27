
module.exports = delRoom;

var Room = require('../models/room.js'),
	History = require('../models/history.js');

var ObjectID = require('mongodb').ObjectID;

function delRoom(req, res) {
	var roomId = decodeURIComponent(req.params.roomId);
	var currentUser = req.session.user;
	function getCallback(err, rooms) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/room/get/' + req.params.roomId);
		}
		if (rooms[0].admin !== currentUser.name) {
			req.flash('error', '你无权删除该Room');
			return res.redirect('/room/get/' + req.params.roomId);
		}
		Room.delete({_id: ObjectID(roomId)}, callback);
	}
	function callback(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/room/get/' + req.params.roomId);
		}
		History.deleteHistory({roomId: roomId}, delCallback);
	}
	function delCallback(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/room/get/' + req.params.roomId);
		}
		req.flash('success', 'delete success');
		res.redirect('/');
	}

	Room.getRoom({_id: ObjectID(roomId)}, getCallback);
}