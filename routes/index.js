var checkLogin = require('../ctrlfunc/checklogin.js'),//检测函数
    checkNotLogin = require('../ctrlfunc/checknotlogin.js'),//检测函数

    showDash = require('../handler/showDash.js'),//路径响应函数

    showRegPage = require('../handler/showRegPage.js'),//路径响应函数
    doReg = require('../handler/doReg.js'),//路径响应函数

    showSignPage = require('../handler/showSignPage.js'),//路径响应函数
    doLog = require('../handler/doLog.js'),//路径响应函数

    showRooms = require('../handler/showRooms.js'),//路径响应函数
    enterRoom = require('../handler/enterRoom.js'),//路径响应函数

    setRoomPage = require('../handler/setRoomPage.js'),//路径响应函数
    doSetRoom = require('../handler/doSetRoom.js'),//路径响应函数

    showHistory = require('../handler/showHistory.js'),//路径响应函数

    userPanel = require('../handler/userPanel.js'),
    doUpdate = require('../handler/doUpdate.js'),

    showConfig = require('../handler/showConfig.js'),
    doConfig = require('../handler/doConfig.js'),

    delRoom = require('../handler/delRoom'),

    emailVerify = require('../handler/emailVerify.js'),

    doLogOut = require('../handler/doLogOut.js');

module.exports = routerIndex;

function routerIndex(app) {
	app.get('/', showDash);

	app.get('/reg', checkNotLogin);
	app.get('/reg', showRegPage);

	app.post('/reg', checkNotLogin);
	app.post('/reg', doReg);

	app.get('/signin', checkNotLogin);
	app.get('/signin', showSignPage);

	app.post('/signin', checkNotLogin);
	app.post('/signin', doLog);

	app.get('/logout', checkLogin);
	app.get('/logout', doLogOut);

	app.get('/room', checkLogin);
	app.get('/room', showRooms);

	app.get('/room/get/:roomId', checkLogin);
	app.get('/room/get/:roomId', enterRoom);

	app.get('/room/set', checkLogin);
	app.get('/room/set', setRoomPage);

	app.post('/room/set', checkLogin);
	app.post('/room/set', doSetRoom);

	app.get('/room/history', checkLogin);
	app.get('/room/history', showHistory);

	app.get('/user', checkLogin);
	app.get('/user', userPanel);

	app.post('/user', checkLogin);
	app.post('/user', doUpdate);

	app.get('/room/config/:roomId', checkLogin);
	app.get('/room/config/:roomId', showConfig);

	app.post('/room/config/:roomId', checkLogin);
	app.post('/room/config/:roomId', doConfig);

	app.get('/room/delete/:roomId', checkLogin);
	app.get('/room/delete/:roomId', delRoom);

	app.get('/user/verify/:token', emailVerify);

	app.all('*', function(req, res) {
		req.flash('error', 'Not Founded!');
		res.redirect('/');
	})
};
