/* User数据模型 */

/* 方法
	@save(callback) 			-存储一个新用户
	@User.auth(name, callback)  		-用户登陆验证
	@User.delete(name, callback) 		-删除用户
	@User.control(name, user, callback) 	-信息更新
*/

var mongodb = require('./db');
var createVerifyToken = require('../ctrlfunc/createVerifyToken.js');

function User (user) {
	this.name = user.name;
	this.pwd = user.pwd || '';
	this.email = user.email;
	this.job = user.job || [''];
	this.info = user.info || '';
	this.headimg = user.headimg;
}

module.exports = User;

//-----------------------------------------------------------

User.prototype.save = function(callback) {                   //注册用户信息
	var user = {};
	user.name = this.name;
	user.pwd = this.pwd;
	user.email = this.email;
	user.job = this.job;
	user.info = this.info;
	user.headimg = this.headimg;
	user.verify = false;
	user.verifyToken = createVerifyToken(user.name + Math.random().toString().split('.')[1]);

	function openDb (err, db) {
		if (err) return callback(err);
		db.collection('users', insertNew);
	}

	function insertNew (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.insert(user, {safe: true}, insertNewCallback); //insert返回的是个数组！
	}

	function insertNewCallback (err, user) {	
		mongodb.close();
		callback(null, user);
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('users', insertNew);
};

//-----------------------------------------------------------

User.auth = function (user, callback) {                      //验证
	function openDb (err, db) {
		if (err) return callback(err);

		db.collection('users', findOne);
	}

	function findOne (err, collection) {		
		if (err) {			
			mongodb.close();			
			return callback(err);
		}
		collection.findOne(user, findOneCallback);
	}

	function findOneCallback (err, user) {
		mongodb.close();
		if (err)
			callback(err, null);
		else
			callback(null, user);
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('users', findOne);
};

//-----------------------------------------------------------

User.delete = function (name, callback) {                    //删除用户
	function openDb (err, db) {
		if (err) return callback(err);
		db.collection('users', remove);
	}

	function remove (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		var query = {};
		if (name) {
			query.name = name;
		}
		collection.remove(query, removeCallback);
	}

	function removeCallback (err) {
		mongodb.close();
		if (err) return callback(err);
		callback(null);
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('users', remove);
};

//-----------------------------------------------------------

User.control = function (name, user, callback) {            //用户信息修改
	function openDb (err, db) {
		if (err) return callback(err);
		db.collection('users', updatePro);
	}

	function updatePro (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		//更新用户信息
		collection.update({"name": name}, {$set: user}, updateProCallback);   
	}

	function updateProCallback (err) {
		mongodb.close();
		if (err) return callback(err);
		callback(null);
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('users', updatePro);
};

//-----------------------------------------------------------

User.verify = function (token, callback) {        //用户邮箱验证
	var user = {};
	user.verifyToken = token;
	function openDb(err, db) {
		if (err) return callback(err);
		db.collection('users', verfiyUpdate);
	}
	function verfiyUpdate(err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		collection.update(user, {$set: {verify: true}}, updateCallback);
	}
	function updateCallback(err) {
		mongodb.close();
		if (err) return callback(err);
		callback(null);
	}

	if (!mongodb.openCalled)
		mongodb.open(openDb);
	else
		mongodb.collection('users', verfiyUpdate);
}