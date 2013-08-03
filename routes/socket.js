
function popUser(users, socket) {
	var index = users.indexOf(socket.name);
	if (index === -1)
		return;
	if (users[index] === socket.name) {
		users.splice(index, 1);
		return;
	} else {
		popUser(users, socket);
	}
}

function now() {
	var date = new Date(),
		time = date.getFullYear() + '-' 
		+ (date.getMonth() + 1) + '-' 
		+ date.getDate() + ' ' 
		+ date.getHours() + ':' 
		+ (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" 
		+ (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
	return time;
}


module.exports = function (io, users) {

	io.sockets.on('connection', function (socket) {
		
		socket.on('online', function (data) {
		//将上线用户名存储为socket的属性以区分每个socket对象
			socket.name = data.user;
			if (users.indexOf(data.user) === -1) 
				users.unshift(data.user);
		//向所有用户广播信息
			io.sockets.emit('online', {
				users: users,
				user: data.user
			});
		});
		
		socket.on('say', function (data) {
			if (data.to === 'all') {
				//向所有用户广播信息
				io.sockets.emit('say', data);
			} else {
				//向指定用户发送消息
				//所有连接的客户端
				var clients = io.sockets.clients(); 
				clients.forEach(function (client) {
					if (data.to === client.name)
						client.emit('say', data);
				});
			}
		});
		
		socket.on('disconnect', function () {
			popUser(users, socket);
			var time = now();
			socket.broadcast.emit('offline', {
				user: socket.name,
				time: time,
				users: users
			});
		});
	});
};
