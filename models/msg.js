/* Msg数据模型 */

/* 方法
	@save(callback)			-保存消息
	@pick(pattern, callback)	-比History更细致的消息搜索,需要提供自定义pattern
*/

var mongodb = require('./db'),
	History = require('./history.js');

function Msg (roomId, from, to, time, context) {
	this.from = from;
	this.to = to;
	this.time = time;
	this.context = context;
	this.roomId = roomId;
}

module.exports = Msg;

//------------------------------------------

Msg.prototype.save = function (callback) {
	var msgbox = {};
	msgbox.from = this.from;
	msgbox.to = this.to;
	msgbox.time = this.time;
	msgbox.context = this.context;
	roomId = this.roomId;

	function openDb(err, db) {
		if (err) return callback(err);
		db.collection('history', insertMsg);
	}

	function insertMsg(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.update({roomId: roomId}, 
			{$addToSet: {"info": msgbox}}, insertMsgCallback);
	}

	function insertMsgCallback(err) {
		mongodb.close();
		if (err)
			callback(err);
		else 
			callback(null);
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('history', insertMsg);
};

//------------------------------------------

Msg.pick = function (pattern, callback) {
	function openDb(err, db) {
		if (err) return callback(err);
		db.collection('history', pickUp);
	}

	function pickUp(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.find(pattern).sort({time: -1}).toArray(pickUpCallback);
	}

	function pickUpCallback(err, msgs) {
		mongodb.close();
		if (err)
			callback(err, null);
		else
			callback(null, msgs);
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('history', pickUp);
};
