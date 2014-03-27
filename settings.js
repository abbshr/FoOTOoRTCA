//应用全局设置

var globalConfig = {};
module.exports = globalConfig;

globalConfig.dbSettings = {
	cookieSecret: 'teamchat',
	db: 'teamchat',
	host: "localhost",
	port: 27017
};

globalConfig.mailConfig = {
	service: "Gmail",
	auth: {
		user: "example@gmail.com",
		pass: "password"
	}
};
