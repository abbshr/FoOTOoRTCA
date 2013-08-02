
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var users = [];  //在线用户

app.get('/', function (req, res) {
	if (!req.cookies.user) {
		return res.redirect('/signin');
	}
	res.render('index', {
		title: 'Chat!~',
		user: req.cookies.user,
	});
});

app.get('/signin', function (req, res) {
	if (req.cookies.user) {
		return res.redirect('back');
	}
	res.render('signin', {
		title: '登录-Chat!~',
	});
});

app.post('/signin', function (req, res) {
	//检测用户名是否已存在users数组中
	if (users.indexOf(req.body.name) === -1) {
		res.cookie('user', req.body.name, {maxAge:1000*60*60*24*30});
	}
	res.redirect('/');
});

var server = http.createServer(app),
	io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	socket.on('online', function (data) {
		//将上线用户名存储为socket的属性以区分每个socket对象
		socket.name = data.user;
		if (users.indexOf(data.user) === -1) 
			users.unshift(data.user);
		io.sockets.emit('online', {
			users: users,
			user: data.user
		});
	});
});
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


