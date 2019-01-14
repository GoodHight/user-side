/**
 * 
 */
!(function() {
	var kdcommon = {};
	kdcommon.URL = {
		restful: {
			reqUrl: 'http://hxy.frps.zoudongjun.cn',
			//reqUrl: 'http://192.168.0.116:8080',
//		    reqUrl: 'http://api.cqnanlin.com'
//			reqUrl: 'http://192.168.0.116:8080',
		    //reqUrl: 'http://api.cqnanlin.com',
			key: 'restful'
		},
		baiduMap: {
			reqUrl: 'http://api.map.baidu.com',
			key: 'baiduMap'
		}
	};
	/**
	 * 从URI中获取查询串
	 */
	kdcommon.getQueryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) {
			return unescape(r[2]);
		}
		return null;
	}
	/**
	 * 当值只为null时返回true
	 * @param {Object} obj
	 */
	kdcommon.isNull = function(obj) {
		if(!obj && typeof(obj) != 'undefined' && obj != 0)
			return true;
		return false;
	}

	/**
	 * 判断json对象是否为null
	 * @param {Object} jsonObj
	 */
	kdcommon.isNullByJSON = function(jsonObj) {
		// 判断类型是不是对象
		if(typeof(jsonObj) != 'object')
			return true;
		for(var key in jsonObj) {
			return false;
		}
		return true;
	}

	kdcommon.isNaN = function(val) {
		return isNaN(val);
	}

	/**
	 * 获取字符串的长度
	 * @param {Object} text
	 */
	kdcommon.getStrLength = function(text) {
		var len = 0;
		for(var i = 0; i < text.length; i++) {
			var a = text.charAt(i);
			if(a.match(/[^\x00-\xff]/ig) != null) {
				len += 2;
			} else {
				len += 1;
			}
		}
		return len;
	}
	/**
	 * 以Unicode的方式获取字符串的实际长度，中文占2个字节
	 * @param {Object} text
	 */
	kdcommon.getStrLengthByUnicode = function(text) {
		var len = 0;
		for(var i = 0; i < text.length; i++) {
			var length = text.charCodeAt(i);
			if(length >= 0 && length <= 128) {
				len += 1;
			} else {
				len += 2;
			}
		}
		return len;
	}

	/**
	 * 限定字符长度，字符串长度 >limitLength返回true，否则返回false，表示不超过
	 * @param {Object} text 字符串
	 * @param {Object} limitLength 限定的长度
	 */
	kdcommon.limitText = function(text, limitLength) {
		var strLen = kdcommon.getStrLength(text);
		if(strLen > limitLength) {
			return true;
		}
		return false;
	}

	kdcommon.dateFormat = function(format, val) {

		var date = new Date();
		var dt = new Date(val);
		// 解决ios date不兼容的问题
		var msgDate = dt.getFullYear() > 0 ? dt : new Date(Date.parse(val.replace(/-/g, "/")));
		return msgDate.format(format);
	}
	window.kdcommon = kdcommon;
})();

var url = location.href;

if(url.indexOf("index.html") != -1) {
	document.write('<script src="js/app/plusUtils.js"></script>');
} else {
	document.write('<script src="../js/app/plusUtils.js"></script>');
}
