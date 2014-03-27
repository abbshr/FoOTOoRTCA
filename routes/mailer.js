var mailer = require('nodemailer');
var config = require('../settings.js').mailConfig;

var mailService = {};
mailService.sendMail = sendMail;
mailService.sendWelcome = sendWelcome;
mailService.verifyMail = verifyMail;

module.exports = mailService;

function sendMail(options, callback) {
    var smtpTransport = mailer.createTransport("SMTP", config);
    smtpTransport.sendMail(options, callback);
}

function sendWelcome(email, callback) {
    var smtpTransport = mailer.createTransport("SMTP", config),
        data = "the best way to work together with TeamChat",
        options = {
	    from: "TeamChat",
	    to: email,
	    subject: "Welcome new chater",
	    html: data
        };
    smtpTransport.sendMail(options, callback);
}

function verifyMail(token, email, callback) {
    var smtpTransport = mailer.createTransport("SMTP", config),
        data = "<p>你刚刚使用该邮箱在TeamChat上注册了帐号，请在24小时内点击下面的链接激活它！</p>"
	     + "<br>"
	     + "<a href=" 
	     + "http://localhost:3000/user/verify/"
	     + token
	     + ">http://localhost:3000/user/verify/"
	     + token
	     + '</a>',
        options = {
	    from: "TeamChat",
	    to: email,
	    subject: "激活你的TeamChat账户",
	    html: data
        };
    smtpTransport.sendMail(options, callback);
}
