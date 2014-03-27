/* Room数据模型 */

/* 方法
	@set(callback)  				-创建聊天室
	@static control(keyword, room, callback)	-聊天室设置
	@static delete(room, callback)			-删除聊天室
	@static addMember(room, userList, callback)	-添加用户防重
	@static delMember(room, userList, callback)	-剔除用户
	@static getRoom(room, callback)			-获取房间
*/

var mongodb = require('./db'),
	History = require('./history.js'),
	User = require('./user.js');

function Room (room) {
	this.title = room.title;
	this.admin = room.admin.name;
	this.isPrivate = room.isPrivate;
	this.onceMember = [room.admin.name];
	this.member = [room.admin.name];
}

module.exports = Room;

//------------------------------------------

Room.prototype.set = function (callback) {   //新建一个聊天室
	var date = new Date(),
	    year = date.getFullYear(),
	    month = year + '-' + (date.getMonth() + 1),
	    day = month + '-' + date.getDate(),
	    minute = day + ' ' 
		   + date.getHours() + ':' 
		   + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" 
		   + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());	
		/*milminute = minute + ':' + date.getMilliseconds()*/
	var time = {
		year: year,
		month: month,
		day: day,
		minute: minute,
		/*milminute: milminute*/
	};
	/*,
	    roomflag = this.admin + '-' + this.title + '-' + milminute;*/

	var room = {};
	room.title = this.title;
	room.settime = time.minute;
	room.admin = this.admin;
	room.isPrivate = this.isPrivate;
	room.onceMember = this.onceMember;
	room.member = this.member;
	/*room.flag = roomflag;*/
	
	function openDb (err, db) {
		if (err) return callback(err);
		db.collection('rooms', insertNew);
	}

	function insertNew (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.insert(room, {safe: true}, insertNewCallback);
	}

	function insertNewCallback (err, roomArray) {
		mongodb.close();
		if (err) 
			return callback(err);
	//console.log(roomArray[0]);
		callback(null, roomArray[0]);
	}

	if(!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('rooms', insertNew);
};

//------------------------------------------

Room.control = function (keyword, room, callback) {   //修改聊天室
	function openDb (err, db) {
		if (err) return callback(err);
		db.collection('rooms', updateRoom);
	}

	function updateRoom (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.update(keyword, {$set: room}, updateRoomCallback);
	}

	function updateRoomCallback (err) {
		mongodb.close();
		if (err) 
			callback(err);
		else
			callback(null);
	}

	if(!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('rooms', updateRoom);
};

//------------------------------------------

Room.delete = function (room, callback) {   //删除聊天室
	function openDb (err, db) {
		if (err) return callback(err);
		db.collection('rooms', remove);
	}

	function remove (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.remove(room, removeCallback);
	}

	function removeCallback (err) {
		mongodb.close();
		if (err)
			callback(err);
		else 
			callback(null);
	}

	if(!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('rooms', remove);
};

//------------------------------------------

Room.addMember = function (room, userList, callback) {  //添加聊天成员
	function openDb (err, db) {
		if (err) return callback(err);
		db.collection('rooms', addMember);
	}

	function addMember (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.update(room, {
			$addToSet: {"member": {$each: userList}}   //将一组数据更新到member列表中
		}, addMemberCallback);
	}

	function addMemberCallback(err) {
		mongodb.close();
		if (err) 
			callback(err);
		else
			callback(null);
	}

	if(!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('rooms', addMember);
};

//------------------------------------------

Room.delMember = function (room, userList, callback) {  //剔除聊天成员
	function openDb(err, db) {
		if (err) return callback(err);
		db.collection('rooms', delMember);
	}

	function delMember(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.update(room, {
			$pullAll: {"member": userList}   //将一组数据从member列表移除
		}, delMemberCallback);
	}

	function delMemberCallback(err) {
		mongodb.close();
		if (err) 
			callback(err);
		else
			callback(null);
	}

	if(!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('rooms', delMember);
};

//------------------------------------------

Room.getRoom = function (room, callback) {
	var room = room || {};
	function openDb(err, db) {
		if (err) return callback(err);
		db.collection('rooms', getRoom);
	}

	function getRoom(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.find(room).sort({time: -1}).toArray(getRoomCallback);
	}

	function getRoomCallback(err, rooms) {
		mongodb.close();
		if (err) 
			callback(err, null);
		else
			callback(null, rooms);
	}

	if(!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('rooms', getRoom);
};
