
module.exports = showRoomPage;

function showRoomPage(req, res) {
	var currentUser = req.session.user;
	var passObj = {
		title: '新建Topic-TeamChat',
		user: currentUser,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	};
	res.render('newRoom', passObj);
}