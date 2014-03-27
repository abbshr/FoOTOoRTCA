function checkRegist(id, pwd, email) {   //检测注册信息格式
	var patternId = /\u00A0|\\|\/|\=|\^|\s|\@|\`|\$|\.|\?|\,|\<|\>|\;|\:|\'|\"/,
	    patternPwd = /\s/g,
	    patternEmail = /(\w+)@[\w.]+/;
	if (!patternId.test(id) && !patternPwd.test(pwd) && patternEmail.test(email)) 
		return true;    //格式正确返回true
	return false;       //错误返回false
}

module.exports = checkRegist;