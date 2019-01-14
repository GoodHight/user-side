! function() {
	var registeredVue = new Vue({
		el: "#registeredvue",
		data: {
			phone: null,
			nickname: null,
			countdown: 60,
			smscode: null,
			headerImg:null,
			pushInfo: null,
			typeC:true
		},
		methods: {
			init: function() {
				push.getPushInfo(function(info) {
					_this.pushInfo = info;
				});
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
						'sendSmsType': 'SELLER_REGISTER'
					}
					app.post(kdcommon.URL.restful, '/global/sms', null, postData, function(data, textStatus) {
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
			typeBtn:function(e) {
				var type = e.currentTarget;
				if($(type).hasClass("agreed-c")){
					_this.typeC = false
				} else {
					_this.typeC = true
				}
			},
			submitBtn: function() {
				if(_this.nickname == null || _this.nickname == '') {
					app.toast("请输入昵称");
					return false;
				}
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
				if(!_this.typeC){
					app.toast("请先阅读注册协议")
				}
				app.loginshow();
				var postform = new FormData;
				postform.append('nickname', _this.nickname);
				postform.append('phone', _this.phone);
				postform.append('smsCode', _this.smscode);
				postform.append('headerFile',_this.headerImg);
				postform.append('clientId', _this.pushInfo.clientid);
				postform.append('clientToken', _this.pushInfo.token);
				app.postForm(kdcommon.URL.restful, '/seller/register', null, postform, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						app.loginhide();
						app.toast("注册成功跳转认证中..");
						//保存注册token
						new app.storage("session").set("RSD_TOKEN", data.token);
						setTimeout(function(){
							window.location.href = "real-name.html";
						},1500);
					} else {
						app.toast(data.message);
						app.loginhide();
					}
				});
			},
			filechange: function(event) {
				var files = event.target.files,
					file;
				if(files && files.length > 0) {
					// 获取目前上传的文件
					file = files[0];
					_this.headerImg = file;
					// 获取 window 的 URL 工具
					var URL = window.URL || window.webkitURL;
					// 通过 file 生成目标 url
					var imgURL = URL.createObjectURL(file);
					//用attr将img的src属性改成获得的url
					$(event.currentTarget).siblings("img").attr("src", imgURL);
					// 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
					// URL.revokeObjectURL(imgURL);
					event.target.value = '' //避免同名文件不能上传
				}
			}, checkPlusEnv: function() {
				mui.plusReady(function() {
					var info = plus.push.getClientInfo();
					_this.pushInfo = info;
					console.log(info);
				});
			}
		}
	});
	var _this = registeredVue;
	_this.init();
}();