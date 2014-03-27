
var link = location.href;
loadInit(link);

function loadInit(link) {              //初始化UI和webSocket连接
		window.socket = io.connect(link);
		window.from = getUserName('username'),  //从cookies中读取用户名
		window.to = 'all';      //默认接受对象为所有人
		
		disableSpeak();
	
	//发送上线信号
		window.socket.emit('online', {
			name: window.from,
			time: now()
		});
	
	//上线响应
		window.socket.on('online', function (data) {
			if (data.user.name !== window.from) {
				var sys = '<strong>系统消息（' + now() + '）：</strong>'
						+ '用户' + data.user.name + '上线';
			} else {
				var sys = '<strong>系统消息（' + data.time + '）：</strong>' + '你已进入聊天室~';
				enableSpeak();  //绑定发送消息按钮
				window.currentUser = data.user;
			}
			var content = $('contents'),
				sysinfo = document.createElement('div');
				sysinfo.setAttribute('class', "alert alert-success");
			sysinfo.innerHTML = sys + '<br>'; 
			content.appendChild(sysinfo);
			$('contents').scrollTop = $('contents').scrollHeight;
			refreshUsers(data.onlineUsers, window.from);  //刷新用户在线列表	
			showSayTo(window.from, window.to);    //显示正在对谁说话
		});	
	
	//消息响应
		window.socket.on('say', function (data) {
			var child = document.createElement('div'),
					contents = $('contents');
			child.setAttribute('class', 'alert alert-block');
			switch (data.to) {
				case 'all':
					if (data.from !== window.from) {
						child.innerHTML = data.time + data.from +
					 '对大伙说：<br>' + data.msg + '<br>';
					 	contents.appendChild(child);
					 	notifi(data.user.headimg, data.from + 'to all:', data.msg);
					}
					break;
				case window.from:
					child.innerHTML = data.time + data.from + 
					 ' 对你说：<br>' + data.msg + '<br>';	
					 contents.appendChild(child);
					 notifi(data.user.headimg, data.from + 'to you:', data.msg);
					break;
			}
			$('contents').scrollTop = $('contents').scrollHeight;
		});
	
	//下线响应
		window.socket.on('offline', function (data) {
			var sys = '<strong>系统消息-（' + data.time + '）：</strong>' 
					+ data.name + '已离开…';
			var content = $('contents'),
				sysinfo = document.createElement('div');
				sysinfo.setAttribute('class', "alert alert-info");
			sysinfo.innerHTML = sys + '<br>'; 
			content.appendChild(sysinfo);
			$('contents').scrollTop = $('contents').scrollHeight; 	
			refreshUsers(data.onlineUsers, window.from);  //刷新用户在线列表	
			if (data.user === window.to)
				window.to = 'all';
			showSayTo(window.from, window.to);  //显示正在对谁说话
		});
	
	//丢失连接响应
		window.socket.on('disconnect', function () {
			var sys = '<strong>系统消息-（' + now() + '）：</strong>' + '连接已断开:(';
			var content = $('contents'),
				sysinfo = document.createElement('div');
				sysinfo.setAttribute('class', "alert alert-error");
			sysinfo.innerHTML = sys + '<br>'; 
			content.appendChild(sysinfo);
			$('contents').scrollTop = $('contents').scrollHeight;
			disableSpeak();  //与服务器断开连接时禁用发送消息
		});
	
	//重新获取连接响应
		window.socket.on('reconnect', function () {
			var sys = '<strong>系统消息-（' + now() + '）：</strong>' + '已连接:)';
			var content = $('contents'),
				sysinfo = document.createElement('div');
				sysinfo.setAttribute('class', "alert alert-success");
			sysinfo.innerHTML = sys + '<br>'; 
			content.appendChild(sysinfo);
			$('contents').scrollTop = $('contents').scrollHeight;
			window.socket.emit('online', {user: window.from});
		});
};


function refreshUsers(users, me) {       //刷新用户列表并绑定双击事件
	var list = $('list');
	for (var i in list.childNodes) {
		if (list.childNodes[0] && list.childNodes[0].removeChild)
			list.removeChild(list.childNodes[0]);
	}
	var all = document.createElement('li'),
		text = document.createTextNode('所有人');
	all.className = 'active';
	all.title = '双击聊天';
	all.setAttribute('alt', 'all');
	if (!all.getAttribute('saying'))
		all.setAttribute('saying', 'yes');
	all.onselectstart = function () {
		return false;
	};
	all.ondblclick = function () {
		if (!all.getAttribute('saying')) {
			window.to = all.getAttribute('alt');
			for (var j in list.childNodes) {
				list.childNodes[j].className = '';
				if (list.childNodes[j] && list.childNodes[j].removeAttribute)
					list.childNodes[j].removeAttribute('saying');
			}
			all.className = 'active';
			all.setAttribute('saying', 'yes');
			showSayTo(me, window.to);
		}
	};
	var a = document.createElement('a');
	a.appendChild(text);
	all.appendChild(a);
	list.appendChild(all);
	var user = [];
	for (var i in users) {
		user[i] = document.createElement('li');
		user[i].title = '双击聊天';
		user[i].setAttribute('alt', i);
		user[i].onselectstart = function () {
			return false;
		};
		text = document.createTextNode(i);
		user[i].ondblclick = (function (element) {   //未使用事件授权~下一版本大换血整改
			return function () {
				if (!(element.getAttribute('saying')) && element.getAttribute('alt') !== me) {
					window.to = element.getAttribute('alt');
					for (var j in list.childNodes) {
						list.childNodes[j].className = '';
						if (list.childNodes[j] && list.childNodes[j].removeAttribute)
							list.childNodes[j].removeAttribute('saying');
					}
					element.className = 'active';
					element.setAttribute('saying', 'yes');
					showSayTo(me, window.to);
				}
			}
		})(user[i]);
		a = document.createElement('a');
		var headimg = document.createElement('img');
		headimg.setAttribute('src', window.currentUser.headimg);
		a.appendChild(text);
		user[i].appendChild(headimg);
		user[i].appendChild(a);
		list.appendChild(user[i]);
	}
}



function showSayTo(me, you) {     //对话提示
	var to = $('to');
	to.innerText = (you == 'all' ? '大伙' : you);
}



function now() {        //当前时间
	var date = new Date(),
		time = date.getFullYear() + '-' 
		+ (date.getMonth() + 1) + '-' 
		+ date.getDate() + ' ' 
		+ date.getHours() + ':' 
		+ (date.getMinutes() < 10 ? 
		  ('0' + date.getMinutes()) : date.getMinutes()) + ":" 
		+ (date.getSeconds() < 10 ? 
		  ('0' + date.getSeconds()) : date.getSeconds());
	return time;
}



function getUserName(nameSegment) {       //从cookies中获取用户名
	if (document.cookie.length > 0) {
		start = document.cookie.indexOf(nameSegment + "=");
		if (start !== -1) 
			start += (nameSegment.length + 1); 
		end = document.cookie.indexOf(";", start);
		if (end === -1) 
			end = document.cookie.length;
		return unescape(document.cookie.substring(start, end));
	} 
	return "newer";
}



function enableSpeak() {        //绑定发送消息事件到按钮
	var say = $('say'),
			input = $('input_content');
	say.addEventListener('click', function () {
		window.webkitNotifications.requestPermission();
	});
	say.removeEventListener('click', function () {
		window.webkitNotifications.requestPermission();
	});
	say.addEventListener('click', function () {
		var time = now();
		var msg = input.value;
		if (msg == 0 && !(/0/i).test(msg))
			return;
		sendmsg = msg.replace(/\n/g, '<br>');
		var child = document.createElement('div');
		child.setAttribute('class', 'alert alert-block');
		if (window.to === 'all')	
			child.innerHTML = time + 
				'你对大伙说：<br>' + 
				sendmsg + '<br>';
		else
			child.innerHTML = time +
				'你对' + window.to +
				'说：<br>' + sendmsg + '<br>'; 
		var contents = $('contents');
		contents.appendChild(child);
		$('contents').scrollTop = $('contents').scrollHeight;
		window.socket.emit('say', {
			from: window.from,
			to: window.to,
			msg: msg,
			time: time
		});
		
		//清空输入框并获得焦点
		input.value = '';
		input.focus();
	});
	say.setAttribute('class', 'btn btn-danger');
	if (input.getAttribute('disabled'))
		input.removeAttribute('disabled');
	if (say.getAttribute('disabled'))
		say.removeAttribute('disabled');
}


function disableSpeak() {         //解除发送按钮绑定
	var say = $('say'),
			input = $('input_content');
	say.onclick = function () {
		return false;
	};
	input.setAttribute('disabled');
	say.setAttribute('class', 'btn btn-danger disabled');
	say.setAttribute('disabled', 'disabled');
}

function $(id) {
	return document.getElementById(id);
}

function notifi(img, title, content) {
	document.hasFocus() || 
	!window.webkitNotifications.checkPermission() &&
	window
		.webkitNotifications
		.createNotification(img, title, content)
		.show();
}