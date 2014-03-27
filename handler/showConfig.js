
module.exports = showConfig;

var Room = require('../models/room.js');

var ObjectID = require('mongodb').ObjectID;

function showConfig(req, res) {
	var currentUser = req.session.user;
	var roomId = decodeURIComponent(req.params.roomId),
		room = {
			_id: ObjectID(roomId)
		}; 
	function callback(err, room) {
		if (!room || room == 0) {
			req.flash('error', '该Topic不存在!来创建一个吧!');
			return res.redirect('/room/set');
		}
		if (room[0].admin !== currentUser.name) {
			req.flash('error', '抱歉，你不是这个Toipc的admin,不能执行此操作!');
			return res.redirect('/');
		}
		var cond1 = room[0].isPrivate,
			cond2 = (room[0].member.indexOf(currentUser.name) != -1);
		if (!((cond1 && cond2) || !cond1)) {
			req.flash('error', '抱歉，你目前不是这个私有Toipc的成员,暂时不能访问!');
			return res.redirect('/');
		}
		var passObj = {
			title: 'Topic设置',
			room: room[0],
			user: currentUser,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		};
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('configPage', passObj);
	}
	Room.getRoom(room, callback);
}