(function (global) {
    var plugins = {};
    var ChatApp = {
        init: function () {
            ChatApp.loopByTag('input', ['onclick'], ChatApp.bindEvent, function (elem) {
                if (elem.getAttribute('class') === 'search' || elem.getAttribute('name') === 'tags')
                    return true;
            });
            ChatApp.addPlugin('scrollToBottom', function (elem) {
                elem && (elem.scrollTop = elem.scrollHeight);
            });
            delete this.init;
            return this;
        },
		
        standardImage: function (img) {
            var realwidth = img.width,
                realheight = img.height,
                stdwidth = document.getElementsByTagName('header')[0].offsetWidth;
            var limit = stdwidth / realwidth;
            stdheight = realheight * limit;
            img.width = stdwidth;
            img.height = stdheight;
            return img;
        },
		
        loopByTag: function (elementstr, args, callback, relyOn) {
            var ele = document.getElementsByTagName(elementstr),
                elelength = ele.length,
                newele = [];
            for (var i = 0, j = 0; i < elelength; i++) {
                if (relyOn && relyOn(ele[i])) {
                    newele[j] = callback(args, ele[i]) || {};
                    j++;
                }
            }
            return newele;
        },
		
        loopByClass: function (classstr, args, callback, relyOn) {
            var ele = document.getElementsByClassName(classstr),
                elelength = ele.length,
                newele = [];
            for (var i = 0, j = 0; i < elelength; i++) {
                if (relyOn && relyOn(ele[i])) {
                    newele[j] = callback(args, ele[i]) || {};
                    j++;
                }
	    }
	    return newele;	
        },
		
        bindEvent: function (args, elem) {
            var eType = args[0],
                callback = args[1] || null;
            elem[eType] = callback;
        },

        execute: function (arg, callback) {
            (typeof callback === "function") && callback(arg);
            return this;
        },

        addPlugin: function (describe, callback) {
            plugins[describe] = callback;
            return this;
        },

        use: function (describe) {
            return plugins[describe];
        },

        $: function (id) {
            return document.getElementById(id);
        }
    };

    global.ChatApp = ChatApp;
    return ChatApp;
})(this).init();
