/* Db数据模型 */

/*
	该模型用于获取一个MongoDb的实例,以便其他模型的数据I/O
*/
var settings = require('../settings').dbSettings,
	Db = require('mongodb').Db,
	Server = require('mongodb').Server;
	
module.exports = new Db(settings.db, new Server(settings.host, settings.port, {}), {safe:true}); 