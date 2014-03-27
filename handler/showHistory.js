
var History = require('../models/history.js'),
	Room = require('../models/room.js');

var ObjectID = require('mongodb').ObjectID;

module.exports = showHistory;

function showHistory(req, res) {
	var currentUser = req.session.user;
	var queryStr = req.query.roomId,
		unQueryStr = unescape(queryStr),
		room = queryStr ? {_id: ObjectID(unQueryStr)} : {_id: null};
	function roomCallback(err, room) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		if (!room[0]) {
			req.flash('error', '你所查找的记录不存在！');
			return res.redirect('/');
		}
		if (!((room[0].isPrivate && (room[0].member.indexOf(currentUser.name) != -1)) || !room[0].isPrivate)) {
			req.flash('error', '抱歉，你目前不是这个私有Toipc的成员,暂时不能访问!');
			return res.redirect('/');
		}
		History.reviewTopic(unQueryStr, callback);
	}
	function callback(err, history) {
		var passObj = {
			title: '历史记录-TeamChat',
			msgs: history.info,
			user: currentUser,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		};
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('historyPage', passObj);
	}
	Room.getRoom(room, roomCallback);
}