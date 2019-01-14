! function() {
	var withdrawalVue = new Vue({
		el: "#withdrawal",
		data: {
			account: '',
			name: '',
			money: '',
			phone: '',
			countdown: '发送验证码',
			smscode: '',
			submitType: true,
			codeType:true
		},
		methods: {
			init: function() {
				_this.getPhone()
			},
			getPhone: function() {
				app.post(kdcommon.URL.restful, '/seller/getSellerBase', app.requestHeadersByToken(), {}, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						_this.phone = data.data.phone;
					}
				});
				app.post(kdcommon.URL.restful, '/sellerIncome/getAccount', app.requestHeadersByToken(), {}, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						_this.name = data.data.user_name;
						_this.account = data.data.account_num;
					}
				});
			},
			getCode: function(e) {
				if(!_this.codeType){
					return false;
				};
				_this.codeType = false;
				_this.countdown = 60;
				if(_this.countdown >= 60) {
					var buttons = e.currentTarget;
					$(buttons).val(_this.countdown + "s");
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
							clearInterval(setint);
							_this.countdown = "发送验证码";
							_this.codeType =true;
							$(buttons).css("color", "#019Eff")
						} else {
							$(buttons).val(_this.countdown + "s");
						}
					}, 1000);
				}
			},
			submitOrder: function() {
				if(!_this.submitType) {
					return false;
				};
				if(_this.name == '') {
					app.toast("请输入姓名");
					return false;
				};
				if(_this.account == '') {
					app.toast("请输入支付宝账号");
					return false
				} else {
					var p = Regs.mobile.test(_this.account);
					var m = Regs.email.test(_this.account);
					if(p == false && m == false) {
						app.toast("支付宝账号有误");
						return false;
					}
				};
				if(_this.money == '') {
					app.toast("请输入提现金额");
					return false;
				} else if(!Regs.posiFloat.test(_this.money)) {
					app.toast("金额有误")
					return false;
				};
				if(_this.smscode == '') {
					app.toast("请输入验证码");
					return false
				};
				var postData = {
					"userName": _this.name,
					"accountNum": _this.account,
					"money": _this.money,
					"smsCode": _this.smscode,
					"phone": _this.phone
				};
				app.loginshow();
				_this.submitType = false;
				app.toast("正在提交请稍后...");
				app.post(kdcommon.URL.restful, '/sellerIncome/insertApplyCash', app.requestHeadersByToken(), postData, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						app.toast("提现申请已提交");
					}
					app.loginhide();
				});
			}
		}
	});
	var _this = withdrawalVue;
	_this.init();
}();