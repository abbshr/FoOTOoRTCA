
module.exports = doLogOut;

function doLogOut(req, res) {
	//req.flash('success', "You have log out");
	req.session.user = null;
	res.redirect('/');
}