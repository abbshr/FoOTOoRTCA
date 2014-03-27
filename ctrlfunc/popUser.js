function popUser(users, socket) {
	var username = socket.name;
	delete users[username];	
}

module.exports = popUser;