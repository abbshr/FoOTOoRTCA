function now() {
	var date = new Date(),
		time = date.getFullYear() + '-' 
		+ (date.getMonth() + 1) + '-' 
		+ date.getDate() + ' ' 
		+ date.getHours() + ':' 
		+ (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) 
		+ ":" 
		+ (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
	return time;
}

module.exports = now;