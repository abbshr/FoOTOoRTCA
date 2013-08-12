
module.exports = function (app, users) {

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
		if (users.indexOf(req.body.name) === -1 && req.body.name !== "所有人") {
			res.cookie('user', req.body.name, {maxAge:1000*60*60*24*30});
		}
		res.redirect('/');
	});
};
