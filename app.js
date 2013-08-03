
var express = require('express')
  , routes = require('./routes')
  , socket = require('./routes/socket.js')
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

var users = [];  //存储在线用户

var server = http.createServer(app),
	io = require('socket.io').listen(server);   //Socket绑定至服务器
	
server.listen(app.get('port'), function(){
  	console.log('Chat!~服务器已启动, 正在监听端口：' + app.get('port'));
});

routes(app, users); //路由
socket(io, users);  //Socket的消息操作


