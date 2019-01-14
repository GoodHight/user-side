! function() {
	var loginVue = new Vue({
		el: "#loginvue",
		data: {
			phone: null,
			countdown: 60,
			smscode: null,
			ReaLname: false
		},
		methods: {
			init: function() {
				_this.getReaLname();
//				_this.realErr()
			},
			//获得实名认证的状态
			getReaLname: function() {

			},
			getCode: function(e) {
				if(_this.phone == null || _this.phone == '') {
					app.toast("请输入手机号");
					return false;
				}
				if(!Regs.mobile.test(_this.phone)) { 
					app.toast("手机号码有误");
					return false;
				}
				if(_this.countdown >= 60) {
					var buttons = e.currentTarget;
					$(buttons).text(_this.countdown + "s");
					$(buttons).css("color", "#c3b8b8");
					var postData = {
						'phone': _this.phone,
						'sendSmsType': 'SELLER_LOGIN'
					}
					app.post(kdcommon.URL.restful, '/global/sms', null, postData, function(data, textStatus) {
						console.log(data)
						if(data.code == 0) {
							app.toast("验证码已发送")
						}
					});
					var setint = setInterval(function() {
						_this.countdown--;
						if(_this.countdown <= 0) {
							$(buttons).text("发送验证码")
							clearInterval(setint);
							_this.countdown = 60;
							$(buttons).css("color", "#555")
						} else {
							$(buttons).text(_this.countdown + "s");
						}
					}, 1000);
				}
			},
			submitBtn: function() {
				if(_this.smscode == null || _this.smscode == '') {
					app.toast("请输入验证码");
					return false;
				}
				if(_this.phone == null || _this.phone == '') {
					app.toast("请输入手机号");
					return false;
				}
				if(!Regs.mobile.test(_this.phone)) {
					app.toast("手机号码有误");
					return false;
				}
				app.loginshow();
				var postData = {
					'phone': _this.phone,
					"smsCode": _this.smscode
				}
				app.post(kdcommon.URL.restful, '/seller/login', null, postData, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						app.loginhide();
						//保存用户信息
						new app.storage().set("SELLER_USER_NICK", data.data.nickname);
						new app.storage().set(app.ACCESS_TOKEN, data.token);
						new app.storage().set("SELLER_USER_SIGN", data.data.sign);
						new app.storage().set("SELLER_USER_NAME",data.data.name);
						window.location.href = 'index.html'
					} else {
						app.toast(data.message);
						app.loginhide();
					}
				});
			},
			realErr: function() {
				var btnArray = ['是', '否'];
				mui.confirm('您的实名认证没有通过，是否重新认证？', '提示', btnArray, function(e) {
					if(e.index == 0) {
						window.location.href = 'real-name.html'
					} else {
						window.location.href = 'index.html'
					}
				}, 'div')
			}
		}
	});
	var _this = loginVue;
	_this.init();
}();