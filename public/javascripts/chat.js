/******* Chat!~ 应用配置 *******/
	var config = {
		proxy: "http",
		host: "localhost",
		port: 3000,
	},
		server = config.proxy
	   	     + "://" + config.host
	     	   + ":" + config.port; 
/******************************/


//初始化应用
(function (link) {
  	window.onload = loadInit(link);
})(server);

function loadInit(link) {              //初始化UI和webSocket连接
	return function () {
		window.socket = io.connect(link);
		window.from = getUserName('user'),  //从cookies中读取用户名
		window.to = 'all';      //默认接受对象为所有人
	
	//发送上线信号
		socket.emit('online', {user: window.from});
	
	//上线响应
		socket.on('online', function (data) {
			if (data.user !== from)
				var sys = '<strong>系统消息（' + now() + '）：</strong>'
								+ '用户' + data.user + '上线';
			else
				var sys = '<strong>系统消息（' + now() + '）：</strong>' + '你已进入聊天室~';
			var content = document.getElementById('contents'),
				sysinfo = document.createElement('div');
				sysinfo.setAttribute('class', "alert alert-success");
			sysinfo.innerHTML = sys + '<br>'; 
			content.appendChild(sysinfo);
			refreshUsers(data.users, window.from);  //刷新用户在线列表	
			showSayTo(window.from, window.to);    //显示正在对谁说话
		});	
	
	//消息响应
		socket.on('say', function (data) {
			var child = document.createElement('div'),
					contents = document.getElementById('contents');
			child.setAttribute('class', 'alert alert-block');
			switch (data.to) {
				case 'all':
					if (data.from !== window.from) {
						child.innerHTML = data.time + data.from +
					 '对大伙说：<br>' + data.msg + '<br>';
					 	contents.appendChild(child);
					}
					break;
				case window.from:
					child.innerHTML = data.time + data.from + 
					 ' 对你说：<br>' + data.msg + '<br>';	
					 contents.appendChild(child);
					break;
			}
		});
		enableSpeak();  //绑定发送消息按钮
	
	//下线响应
		socket.on('offline', function (data) {
			var sys = '<strong>系统消息-（' + data.time + '）：</strong>' 
					+ data.user + '已离开…';
			var content = document.getElementById('contents'),
				sysinfo = document.createElement('div');
				sysinfo.setAttribute('class', "alert alert-info");
			sysinfo.innerHTML = sys + '<br>'; 
			content.appendChild(sysinfo); 	
			refreshUsers(data.users, window.from);  //刷新用户在线列表	
			if (data.user === window.to)
				window.to = 'all';
			showSayTo(window.from, window.to);  //显示正在对谁说话
		});
	
	//丢失连接响应
		socket.on('disconnect', function () {
			var sys = '<strong>系统消息-（' + now() + '）：</strong>' + '连接已断开:(';
			var content = document.getElementById('contents'),
				sysinfo = document.createElement('div');
				sysinfo.setAttribute('class', "alert alert-error");
			sysinfo.innerHTML = sys + '<br>'; 
			content.appendChild(sysinfo);
			disableSpeak();  //与服务器断开连接时禁用发送消息
		});
	
	//重新获取连接响应
		socket.on('reconnect', function () {
			var sys = '<strong>系统消息-（' + now() + '）：</strong>' + '已连接:)';
			var content = document.getElementById('contents'),
				sysinfo = document.createElement('div');
				sysinfo.setAttribute('class', "alert alert-success");
			sysinfo.innerHTML = sys + '<br>'; 
			content.appendChild(sysinfo);
			socket.emit('online', {user: window.from});
			enableSpeak();   //与服务器重新连接时绑定发送消息
		});
	};
};


function refreshUsers(users, me) {       //刷新用户列表并绑定双击事件
	var list = document.getElementById('list');
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
	a = document.createElement('a');
	a.appendChild(text);
	all.appendChild(a);
	list.appendChild(all);
	var user = [];
	for (var i in users) {
		user[i] = document.createElement('li');
		user[i].title = '双击聊天';
		user[i].setAttribute('alt', users[i]);
		user[i].onselectstart = function () {
			return false;
		};
		text = document.createTextNode(users[i]);
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
		a.appendChild(text);
		user[i].appendChild(a);
		list.appendChild(user[i]);
	}
}



function showSayTo(me, you) {     //对话提示
	var from = document.getElementById('from'),
		to = document.getElementById('to');
	from.innerText = me;
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
	var say = document.getElementById('say'),
			input = document.getElementById('input_content');
	say.onclick = function () {
		var time = now();
		var msg = input.childNodes[0];
		if (msg == undefined || msg == '<br>' || (msg.wholeText == 0 && !(/0/i).test(msg.wholeText)))
			return;
		msg = msg.wholeText;
		var child = document.createElement('div');
		child.setAttribute('class', 'alert alert-block');
		if (window.to === 'all')	
			child.innerHTML = time + 
				'你对大伙说：<br>' + 
				msg + '<br>';
		else
			child.innerHTML = time +
				'你对' + window.to +
				'说：<br>' + msg + '<br>'; 
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
	say.setAttribute('class', 'btn btn-danger');
	if (input.getAttribute('contenteditable') === "false")
		input.setAttribute('contenteditable', 'true');
	if (say.getAttribute('disabled'))
		say.removeAttribute('disabled');
}


function disableSpeak() {         //解除发送按钮绑定
	var say = document.getElementById('say'),
			input = document.getElementById('input_content');
	say.onclick = function () {
		return false;
	};
	input.setAttribute('contenteditable', 'fasle');
	say.setAttribute('class', 'btn btn-danger disabled');
	say.setAttribute('disabled', 'disabled');
}

