(function () {
  window.onload = loadInit;
})();

function loadInit() {
	var socket = io.connect('http://localhost:3000');
	var from = getUserName(),  //从cookies中读取用户名
		to = 'all';      //默认接受对象为所有人
	
	//发送上线信号
	socket.emit('online', {user: from});
	socket.on('online', function (data) {
		if (data.user !== from) {
			var sys = '系统消息-（' + now() + '）：' + '用户' + data.user + '上线';
		} else {
			var sys = '系统消息-（' + now() + '）：' + '你已进入聊天室~';
		}
		var content = document.getElementById('contents'),
				label = document.createElement('label');
				label.innerHTML = sys + '<br>'; 
				content.appendChild(label);
		//刷新用户在线列表		
		refreshUsers(data.users, from); 
		//显示正在对谁说话
		showSayTo(from, to);
	});	
};

function refreshUsers(users, me) {
	var list = document.getElementById('list');
	for (var i = 0; i <= list.childNodes.length; i++) {
		if (list.childNodes[0] && typeof list.childNodes[0] !== 'function'){
			list.removeChild(list.childNodes[0]);
		}
	}
	var all = document.createElement('li');
	all.title = '双击聊天';
	all.setAttribute('alt', 'all');
	all.className = 'sayingTo';
	all.onselectstart = function () {
		return false;
	};
	all.innerText = '所有人';
	list.appendChild(all);
	var user = [];
	for (var i in users) {
		var list = document.getElementById('list');
		user[i] = document.createElement('li');
		user[i].title = '双击聊天';
		user[i].setAttribute('alt', users[i]);
		user[i].onselectstart = function () {
			return false;
		};
		user[i].innerText = users[i];
		user[i].ondblclick = function () {
			if (!(this.getAttribute('saying')) && this.getAttribute('alt') !== me) {
				to = this.getAttribute('alt');
				for (var j in list) {
					if (list.childNodes[j] && typeof list.childNodes[j] !== 'function') {
						list.childNodes[j].className = '';
						list.childNodes[j].removeAttribute('saying');
					}
				}
				this.className = 'sayingTo';
				this.setAttribute('saying', 'yes');
				showSayTo(me, to);
			}
		};
		list.appendChild(user[i]);
	}
}

function showSayTo(me, you) {
	var from = document.getElementById('from'),
		to = document.getElementById('to');
	from.innerText = me;
	to.innerText = (you == 'all' ? '所有人' : you);
}

function now() {
	var date = new Date(),
		time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
	return time;
}

function getUserName(nameSegment) {
	if (document.cookie.length > 0) {
		start = document.cookie.indexOf(nameSegment + "=");
		if (start !== -1) {
			start += (nameSegment.length + 1); 
			end = document.cookie.indexOf(";", start);
			if (end === -1) 
				end = document.cookie.length;
			return unescape(document.cookie.substring(start, end));
		}
	} 
	return "Ran";
}
