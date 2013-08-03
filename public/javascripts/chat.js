
//初始化应用
(function () {
  	window.onload = loadInit;
})();


//初始化UI和webSocket连接
function loadInit() {
	window.socket = io.connect('http://192.168.1.16:3000');
	window.from = getUserName('user'),  //从cookies中读取用户名
	window.to = 'all';      //默认接受对象为所有人
	
	//发送上线信号
	socket.emit('online', {user: from});
	socket.on('online', function (data) {
		if (data.user !== from)
			var sys = '系统消息-（' + now() + '）：' + '用户' + data.user + '上线';
		else
			var sys = '系统消息-（' + now() + '）：' + '你已进入聊天室~';
		var content = document.getElementById('contents'),
			sysinfo = document.createElement('div');
			sysinfo.setAttribute('style', "color:#f00");
		sysinfo.innerHTML = sys + '<br>'; 
		content.appendChild(sysinfo);
		//刷新用户在线列表		
		refreshUsers(data.users, window.from); 
		//显示正在对谁说话
		showSayTo(window.from, window.to);
	});	
	socket.on('say', function (data) {
		var child = document.createElement('div');
		if (data.to === 'all' && data.from !== window.from)	
			child.innerHTML = data.time + data.from + '对所有人说：<br>' + data.msg + '<br>';
		else if (data.to === window.from)
			child.innerHTML = data.time + data.from + ' 对你说：<br>' + data.msg + '<br>'; 
		var contents = document.getElementById('contents');
		contents.appendChild(child);
	});
	enableSpeak();  //绑定发送消息按钮
	socket.on('offline', function (data) {
		var sys = '系统消息-（' + data.time + '）：' + data.user + '已离开…';
		var content = document.getElementById('contents'),
			sysinfo = document.createElement('div');
			sysinfo.setAttribute('style', "color:#f00");
		sysinfo.innerHTML = sys + '<br>'; 
		content.appendChild(sysinfo); 
		//刷新用户在线列表		
		refreshUsers(data.users, window.from); 
		if (data.user === window.to)
			window.to = 'all';
		//显示正在对谁说话
		showSayTo(window.from, window.to);
	});
	socket.on('disconnect', function () {
		var sys = '系统消息-（' + now() + '）：' + '连接已断开:(';
		var content = document.getElementById('contents'),
			sysinfo = document.createElement('div');
			sysinfo.setAttribute('style', "color:#f00");
		sysinfo.innerHTML = sys + '<br>'; 
		content.appendChild(sysinfo);
		disableSpeak();  //与服务器断开连接时禁用发送消息
	});
	socket.on('reconnect', function () {
		var sys = '系统消息-（' + now() + '）：' + '已连接:)';
		var content = document.getElementById('contents'),
			sysinfo = document.createElement('div');
			sysinfo.setAttribute('style', "color:#f00");
		sysinfo.innerHTML = sys + '<br>'; 
		content.appendChild(sysinfo);
		enableSpeak();   //与服务器重新连接时绑定发送消息
	});
};


//刷新用户列表并绑定双击事件
function refreshUsers(users, me) {
	var list = document.getElementById('list');
	for (var i = 0; i <= list.childNodes.length; i++) {
		if (list.childNodes[0] /*&& typeof list.childNodes[0] !== 'function'*/) {
			list.removeChild(list.childNodes[0]);
		}
	}
	var all = document.createElement('li');
	all.title = '双击聊天';
	all.setAttribute('alt', 'all');
	if (!all.getAttribute('saying'))
		all.setAttribute('saying', 'yes');
	all.className = 'sayingTo';
	all.onselectstart = function () {
		return false;
	};
	all.innerText = '所有人';
	all.ondblclick = function () {
		if (!all.getAttribute('saying')) {
			window.to = all.getAttribute('alt');
			for (var j in list) {
				if (list.childNodes[j] /*&& typeof list.childNodes[j] !== 'function'*/) {
					list.childNodes[j].className = '';
					list.childNodes[j].removeAttribute('saying');
				}
			}
			all.className = 'sayingTo';
			all.setAttribute('saying', 'yes');
			showSayTo(me, window.to);
		}
	};
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
			if (!(user[i].getAttribute('saying')) && user[i].getAttribute('alt') !== me) {
				window.to = user[i].getAttribute('alt');
				for (var j in list) {
					if (list.childNodes[j] /*&& typeof list.childNodes[j] !== 'function'*/) {
						list.childNodes[j].className = '';
						list.childNodes[j].removeAttribute('saying');
					}
				}
				user[i].className = 'sayingTo';
				user[i].setAttribute('saying', 'yes');
				showSayTo(me, window.to);
			}
		};
		list.appendChild(user[i]);
	}
}


//对话提示
function showSayTo(me, you) {
	var from = document.getElementById('from'),
		to = document.getElementById('to');
	from.innerText = me;
	to.innerText = (you == 'all' ? '所有人' : you);
}


//当前时间
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


//从cookies中获取用户名
function getUserName(nameSegment) {
	if (document.cookie.length > 0) {
		start = document.cookie.indexOf(nameSegment + "=");
		if (start !== -1) 
			start += (nameSegment.length + 1); 
		end = document.cookie.indexOf(";", start);
		if (end === -1) 
			end = document.cookie.length;
		return unescape(document.cookie.substring(start, end));
	} 
	return "";
}


//绑定发送消息事件到按钮
function enableSpeak() {
	var say = document.getElementById('say');
	say.onclick = function () {
		var time = now();
		var input = document.getElementById('input_content'),
			msg = input.childNodes[0];
		if (msg == undefined || msg.wholeText == 0)
			return;
		msg = msg.wholeText;
		var child = document.createElement('div');
		if (window.to === 'all')	
			child.innerHTML = time + '你对所有人说：<br>' + msg + '<br>';
		else
			child.innerHTML = time + '你对' + window.to + '说：<br>' + msg + '<br>'; 
		var contents = document.getElementById('contents');
		contents.appendChild(child);
		
		window.socket.emit('say', {
			from: window.from,
			to: window.to,
			msg: msg,
			time: time
		});
		
		//清空输入框并获得焦点
		input.innerHTML = '';
		input.focus();
	};
}


//解除发送按钮绑定
function disableSpeak() {
	var say = document.getElementById('say');
	say.onclick = function () {
		return false;
	};
}
