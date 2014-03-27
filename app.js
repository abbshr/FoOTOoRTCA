#!/usr/bin/env node

var express = require('express')
  , routes = require('./routes')
  , socketIO = require('./routes/socketio.js')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , settings = require('./settings.js').dbSettings;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(express.session({
	secret: settings.cookieSecret,
	key: settings.db,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	},
	store: new MongoStore({
		db: settings.db
	})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app),
	io = require('socket.io').listen(server);   //Socket绑定至服务器
	
server.listen(app.get('port'), function(){
  	console.log('TeamChat服务器已启动, ' 
  		+ '当前为(' + app.get("env") + ')模式, ' 
  		+ '监听端口：' + app.get("port")
  	);
});

routes(app); //路由
socketIO.getIO(io);  //获取io实例