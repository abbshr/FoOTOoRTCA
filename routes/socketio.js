
var Room = require('../models/room.js'),
	User = require('../models/user.js'),
	Msg = require('../models/msg.js');

var popUser = require('../ctrlfunc/popUser.js'),
	now = require('../ctrlfunc/now.js');

var socketIO = {};                  //待导出的socketIO对象

socketIO.getIO = getIO;
socketIO.isExist = isExist;
socketIO.create = create;

module.exports = socketIO;


function getIO(io) {
	this.io = io;
}

function isExist(roomId) {
	var io = this.io,
		namespaces = io.namespaces;
	if (namespaces[roomId]) 
		return true;
	else 
		return false;
}

function create(roomId, callback) {
	var io = this.io,
		users = {};   //存储在线用户
	function connectCallback(socket) {
		function onlineCallback(data) {
			function callback(err, user) {
				if (err) console.log(err);
				socket.user = user;  
			//将上线用户存储为socket的属性以区分每个socket对象
				if (!users[data.name]) {
					users[data.name] = user;
					Room.addMember({roomId: data.room}, [data.name], function (err) {
						if (err) console.log(err);
					});
				}
				var passData = {
					onlineUsers: users,
					user: user,
					time: now()
				};
				io.of('/room/get/' + roomId).emit('online', passData);  //向所有用户广播信息
			}
			User.auth({name: data.name}, callback);
		}
		function sayCallback(data) {
			var savemsg = data.msg;
			data.msg = savemsg.replace(/\n/g, '<br>');
			data.user = users[data.from];
			if (data.to === 'all') {
				//向自己之外的所有用户广播信息
				socket.broadcast.emit('say', data);
			} else {
				//向指定用户发送消息
				//所有连接的客户端
				var clients = io.of('/room/get/' + roomId).clients(); 
				clients.forEach(function (client) {
					if (data.to === client.user.name)
						client.emit('say', data);
				});
			}
			var msg = new Msg(decodeURIComponent(roomId), data.from, data.to, data.time, savemsg);
			msg.save(function (err) {
				if (err) console.log(err);
			});
		}
		function disconnectCallback() {
			popUser(users, socket);
			var time = now();
			var passData = {
				name: socket.user.name,
				time: time,
				Onlineusers: users
			};
			socket.broadcast.emit('offline', passData);
		}

		socket.on('online', onlineCallback);
		socket.on('say', sayCallback);
		socket.on('disconnect', disconnectCallback);
	}
	callback();
	return io.of('/room/get/' + roomId).on('connection', connectCallback);
}
