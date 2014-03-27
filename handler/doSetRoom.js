
var Room = require('../models/room.js'),
	History = require('../models/history.js');

var socketIO = require('../routes/socketio.js');

var filter = require('../ctrlfunc/filter.js'),
	ObjectID = require('mongodb').ObjectID;

module.exports = doSetRoom;

function doSetRoom(req, res) {
console.log(req.body.isPrivate);
	if (filter.isSpace(req.body.title)) {
		req.flash('error', '请填写Topic');
		return res.redirect('back');
	}
	var currentUser = req.session.user;
	var private = {
		yes: true,
		no: false
	};
	var room = {
		title: filter.removeSpace(req.body.title),
		admin: currentUser,
		isPrivate: private[req.body.isPrivate] || false
	};
	function callback(err, room) {
		if (err) {
			req.flash('error', err);
			return res.redirect('back');
		}
		var history = new History(room._id.toHexString());
		history.save(historyCallback);
	}
	function historyCallback(err, roomId) {
		if (err) {
			req.flash('error', err);
			return res.redirect('back');
		}
		socketIO.create(roomId, function () {
			res.redirect('/room/get/' + encodeURIComponent(roomId));
		}); 
	}

	room = new Room(room);
	room.set(callback);
}