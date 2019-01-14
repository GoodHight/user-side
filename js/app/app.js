/**
 * 
 */
;
(function($, doc) {

	var app = {};

	app.USER_SETTING = "$setting_kudai_rrd_merchant";
	app.ACCESS_TOKEN = "$seller_user_token";

	app.storage = function(type) {
		this.storage = null;
		if(typeof(type) === 'undefined' || type === 'local') {
			this.storage = window.localStorage;
		} else if(type === 'session') {
			this.storage = window.sessionStorage;
		}
	}

	app.storage.prototype = {
		set: function(key, value) {
			//this.storage.setItem(key, escape(value));
			this.storage.setItem(key, JSON.stringify(value));
		},
		get: function(key) {
			//return unescape(this.storage.getItem(key));
			return JSON.parse(this.storage.getItem(key));
		},
		remove: function(key) {
			this.storage.removeItem(key);
		},
		clear: function() {
			this.storage.clear();
		},
		key: function(index) {
			return this.storage.key(index);
		},
		hasKey: hasKey = function(key) {
			for(var i in this.storage) {
				if(i === key) {
					return true;
				}
			}
			return false;
		},
		hasVal: function(value) {
			for(var i in this.storage) {
				if(unescape(this.storage[i]) === value) {
					return true;
				}
			}
			return false;
		},
		stringify: function(data) {
			return JSON.stringify(data);
		},
		parse: function(data) {
			return JSON.parse(data);
		},
		support: function() {
			if(window.localStorage && window.sessionStorage) return true;
			return false;
		}
	};

	var send = function(reqUrl, method, headers, postData, callback, dataType) {
		console.log(postData);
		console.log(reqUrl);
		// 需要判断postData是否为null、{}、有数据
		dataType = dataType || 'JSON';
		$.ajax({
			url: reqUrl,
			headers: headers,
			type: method,
			dataType: dataType,
			contentType: "application/x-www-form-urlencoded; charset=utf-8",
			data: postData,
			traditional: true,
			statusCode: {
				400: function(XMLHttpRequest, textStatus, errorThrown) {},
				401: function() {},
				404: function() {

				}
			},
			success: function(data, textStatus, jqXHR) {
				data = eval("(" + data + ")");
				callback(data, textStatus);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//字符串转对象
				var test = XMLHttpRequest.response;
				var responseData = eval("(" + test + ")");
				callback(responseData, textStatus);
			}
		});
	};
	var send2 = function(reqUrl, method, headers, postData, callback, dataType) {
		console.log(postData);
		console.log(reqUrl);
		// 需要判断postData是否为null、{}、有数据
		dataType = dataType || 'JSON';
		$.ajax({
			url: reqUrl,
			headers: headers,
			type: method,
			dataType: dataType,
			contentType: "application/json; charset=utf-8",
			data: postData,
			traditional: true,
			statusCode: {
				400: function(XMLHttpRequest, textStatus, errorThrown) {},
				401: function() {},
				404: function() {

				}
			},
			success: function(data, textStatus, jqXHR) {
				callback(data, textStatus);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				var responseData = JSON.parse(XMLHttpRequest.responseJSON);
				callback(responseData, textStatus);
			}
		});
	};
	var postForm = function(reqUrl, headers, postData, callback) {
		console.log(postData);
		console.log(reqUrl);
		$.ajax({
			type: "POST",
			headers: headers,
			url: reqUrl,
			data: postData,
			dataType: 'json', //服务器返回json格式数据
			cache: false,
			processData: false,
			contentType: false,
			success: function(data, textStatus, jqXHR) {
				callback(data, textStatus);
			},
			error: function(XMLHttpRequest, textStatus, errorThorown) {
				var responseData = JSON.parse(XMLHttpRequest.responseText);
				callback(responseData, textStatus);
			}
		});
	};

	var requestUrlHandler = function(host, queryString) {
		var reqUrl = null;
		for(var o in kdcommon.URL) {
			var t = kdcommon.URL[o];
			if(t.key === host.key) {
				reqUrl = host.reqUrl + queryString;
				return reqUrl;
			}
		}
		if(!reqUrl) {
			throw '请求的主机地址为空';
		}
	}
	var serialize = function(prefix) {
		var str = ''
		for(var i in prefix) {
			str += '/' + prefix[i];
		}
		return str;
	}
	app.post = function(host, queryString, headers, postData, callback, json) {
		if(!headers || !typeof(headers) == 'object') {
			//throw "headers not json object";
			headers = {};
		}
		if(json) {
			send2(requestUrlHandler(host, queryString), 'POST', headers, postData, callback);
		} else {
			send(requestUrlHandler(host, queryString), 'POST', headers, postData, callback);
		}
	}

	app.get = function(host, queryString, headers, postData, callback, dataType) {
		if(!headers || !typeof(headers) == 'object') {
			//throw "headers not json object";
			headers = {};
		}
		queryString += serialize(postData);
		var postData = {};
		send(requestUrlHandler(host, queryString), 'GET', headers, postData, callback, dataType);
	};

	app.postForm = function(host, queryString, headers, postData, callback) {
		if(!headers || !typeof(headers) == 'object') {
			headers = {};
		}
		postForm(requestUrlHandler(host, queryString), headers, postData, callback);
	}

	app.getUserInfo = function(field) {
		var storage = new app.storage();
		var user = null;
		if(!storage.hasKey(app.USER_SETTING)) {
			return null;
		}

		user = storage.get(app.USER_SETTING);
		if(user == null || !user.userid) {
			return null;
		}

		if(!user.hasOwnProperty(field)) {
			return null;
		}
		return user[field];
	}
	/**
	 * 
	 */
	app.requestHeadersByToken = function() {
		var storage = new app.storage('local');
		if(!storage.hasKey(app.ACCESS_TOKEN)) {
			app.toast('token丢失,请重新登录');
			return;
		}
		return {
			"X-Auth-Token": new app.storage('local').get(app.ACCESS_TOKEN)
		};
	}

	/**
	 * 页面重定向
	 * @param {Object} url
	 */
	app.redirect = function(url) {
		location.href = url;
	}
	/**
	 * 页面重定向(替换当前URL)
	 * @param {Object} url
	 */
	app.replace = function(url) {
		location.replace(url);
	}
	/**
	 * 处理http请求错误
	 * @param {Object} data
	 * @param {Object} status
	 */
	app.handleReqeustError = function(data, status) {
			if(status == 'success' && data.code != '0') {
				mui.toast(data.message);
				return;
			}
			if(status == "error") {
				if(data.message == 'ParamValidException') {
					var errorMsgs = data.data;
					var msg = "";
					for(var i = 0; i < errorMsgs.length; i++) {
						msg += ((i + 1) + '、' + errorMsgs[i].message + ' \n ');
					}
					mui.toast(msg);
				} else {
					mui.toast(data.message);
				}
			}
		},
		/**
		 * loging动画
		 */
		app.loginshow = function() {
			var longingmodel = '<div class="spinner-box" id="spinner-box"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div>';
			$("body").append(longingmodel);
		},
		app.loginhide = function() {
			$("body").children(".spinner-box").remove();
		},
		app.blocaked = function() {
			mui.alert('功能封测中，即将上线', '提示', function() {}, 'div');
		}
	/**
	 * 自动消失的提示框
	 * @param {String} msg 显示的字符串
	 * @param {Object} duration true：长显示， false：短显示
	 */
	app.toast = function(msg, duration) {
		if(duration) {
			mui.toast(msg, {
				duration: 'long'
			});
		} else {
			mui.toast(msg);
		}
	}

	window.app = app;
})(Zepto, document);