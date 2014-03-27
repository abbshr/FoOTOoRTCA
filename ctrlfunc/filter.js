
var filter = {};
filter.rspAll = rspAll;
filter.rspInner = rspInner;
filter.uniq = uniq;
filter.removeSpace = removeSpace;
filter.isSpace = isSpace;

module.exports = filter;

function rspInner(items) {
	return items.map(function (item) {
		return item = item.replace(/\u00A0|\s/ig, '');
	});
}

function rspAll(items) {
	return items.filter(function (item) {
		if (item == 0 && !(/0/i).test(item))
			return false;
		return true;
	});
}

function uniq(arr) {
    var newarr = [];
    var hash = {};
    for (var i = 0; arr[i]; i++) {
    	var item = arr[i];
        if (!hash[item]) {
            newarr.push(item);
            hash[item] = true;
        }
    }
	return newarr;
}

function removeSpace(str) {
    for(var i = str.replace(/^(\s|\u00A0)+/,'').length-1; i >= 0; i--)
        if(/\S/.test(str.charAt(i))){
            str = str.substring(0, i+1);
            break;
        }
    return str;
}

function isSpace(str) {
	if (str == 0 && !(/0/i).test(str))
		return true;
}