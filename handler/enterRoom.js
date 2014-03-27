
var Room = require('../models/room.js');

var socketIO = require('../routes/socketio.js');

var ObjectID = require('mongodb').ObjectID;

module.exports = enterRoom;

function enterRoom(req, res) {
	var currentUser = req.session.user;

	if (req.params.roomId.length != 24) {
		req.flash('error', '该Topic不存在!来创建一个吧!')
		return res.redirect('/room/set');
	}
	var roomId = decodeURIComponent(req.params.roomId),
		encodeRoomId = encodeURIComponent(req.params.roomId),
		room = {
			_id: ObjectID(roomId)  //以roomId查询获得唯一的房间
		};
	function callback(err, room) {
		if (room[0]) {
			var cond1 = room[0].isPrivate,
				cond2 = (room[0].member.indexOf(currentUser.name) != -1);
			if (!((cond1 && cond2) || !cond1)) {
				req.flash('error', '抱歉，你目前不是这个私有Toipc的成员,暂时不能访问!');
				return res.redirect('/');
			}
		} else {
			req.flash('error', '该Topic不存在!来创建一个吧!');
			return res.redirect('/room/set');
		}
		//room[0].roomId = roomId;  //在返回的模型中添加roomId信息
		var passObj = {
			title: room[0].title + '-TeamChat',
			room: room[0],
			user: currentUser,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		};
		function enter() {
			res.render('chatRoom', passObj);
		}
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		if (!socketIO.isExist('/room/get/' + encodeRoomId))
			socketIO.create(encodeRoomId, enter);
		else
			enter();
	}
	Room.getRoom(room, callback);
}