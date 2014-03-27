
module.exports = doConfig;

var Room = require('../models/room.js'),
	User = require('../models/user.js');

var filter = require('../ctrlfunc/filter.js'),
	ObjectID = require('mongodb').ObjectID;

function doConfig(req, res) {
	if (filter.isSpace(req.body.title)) {
		req.flash('error', '请填写Topic');
		return res.redirect('back');
	}
	if (filter.isSpace(req.body.admin)) {
		req.flash('error', '请指定admin');
		return res.redirect('back');
	}
	var currentUser = req.session.user;
	var roomId = req.params.roomId,
		room = {
			_id: ObjectID(roomId)
		};
	var addList = String.prototype.split.call(req.body.newmembers, /,|，/),
		delList = String.prototype.split.call(req.body.delmembers, /,|，/);
	var rspAll = filter.rspAll,
		rspInner = filter.rspInner,
		uniq = filter.uniq;
	function getCallback(err, rooms) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/room/config/' + roomId);
		}
		if (!rooms) {
			req.flash('error', '该Topic不存在!来创建一个吧!');
			return res.redirect('/room/set');
		}
		if (rooms[0].admin !== currentUser.name) {
			req.flash('error', '抱歉，你不是这个Toipc的admin,不能执行此操作!');
			return res.redirect('/');
		}
		var private = {
			yes: true,
			no: false
		};
		var updateInfo = {
			title: filter.removeSpace(req.body.title),
			admin: (req.body.admin).replace(/\u00A0/, '')
		};
		addList.push(updateInfo.admin);
		updateInfo['isPrivate'] = private[req.body.isPrivate] || false;
		Room.control(rooms[0], updateInfo, callback);
	}
	function callback(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/room/config/' + roomId);
		}
		Room.addMember(room, uniq(rspInner(rspAll(addList))), addCallback);      //暂时不会阻止列表中包含数据库中没有的用户!
	}
	function addCallback(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/room/config/' + roomId);
		}
		if (delList == 0)
			return res.redirect('/room/config/' + roomId);
		Room.delMember(room, uniq(rspInner(rspAll(delList))), delCallback);      //暂时不会阻止列表中包含数据库中没有的用户!
	}
	function delCallback(err) {
		if (err)
			req.flash('error', err);
		return res.redirect('/room/config/' + roomId);
	}

	Room.getRoom(room, getCallback);
}