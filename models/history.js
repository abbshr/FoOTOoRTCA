/* History数据模型 */

/* 方法
	@save(callback)				-创建一个房间的聊天记录
	@static reviewTopic(roomId, callback)  
						-返回一个房间的文字聊天记录数组,数组中每个元素格式如下:
		{
			from: userId,
			to: 'all' || userId[],
			time: time,
			context: msg,
		}
	@static deleteHistory(roomId, callback)-删除指定房间的聊天记录
*/

var mongodb = require('./db'),
	Room = require('./room.js');

function History (roomId) {
	this.roomId = roomId;
}

module.exports = History;

//----------------------------------------------------

History.prototype.save = function (callback) {        //为一个房间创建历史记录
	var history = {};
	history.roomId = this.roomId;
	history.info = [];

	function openDb(err, db) {
		if (err) return callback(err);
		db.collection('history', insertNewHistory);
	}

	function insertNewHistory(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.insert(history, {safe: true}, insertCallback);
	}

	function insertCallback(err, roomArray) {
		mongodb.close();
		if (err) 
			callback(err);
		else
			callback(null, roomArray[0].roomId);  //返回ObjectID串
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('history', insertNewHistory);
};

//----------------------------------------------------

History.reviewTopic = function (roomId, callback) { //获取一个房间的历史记录
	var room = {};
	room.roomId = roomId;
	function openDb(err, db) {
		if (err) return callback(err);
		db.collection('history', getHistory);
	}

	function getHistory(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.findOne(room, getHistoryCallback);
	}

	function getHistoryCallback(err, history) {
		mongodb.close();
		if (err)
			callback(err, null);
		else
			callback(null, history)
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('history', getHistory);
};

//----------------------------------------------------

History.deleteHistory = function (roomId, callback) {
	function openDb(err, db) {
		if (err) return callback(err);
		db.collection('history', deleteHistory);
	}

	function deleteHistory (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.remove(roomId, deleteHistoryCallback);
	}

	function deleteHistoryCallback(err) {
		mongodb.close();
		if (err) 
			callback(err);
		else
			callback(null);
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('history', deleteHistory);
};
