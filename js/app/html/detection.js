//  ========== 
//  = 检测用户登录状态 = 
//  ========== 
! function() {
	var detectionVue = new Vue({
		el: "#detection",
		data: {
			infoType: null
		},
		methods: {
			init: function() {
				//获取后台用户信息
				var storages = new app.storage();
				var userInfo = storages.get(app.ACCESS_TOKEN);
				//判断用户状态
				if(userInfo) {
					//true 发送Token 验证有效期 实现自动登录
					app.post(kdcommon.URL.restful, "/user/validateToken", app.requestHeadersByToken(), {}, function(data, textStatus) {
						console.log(data)
						if(data.code == 0) {
							if(data.token == 'null') {
								app.toast("身份信息过期，请重新登陆");
								setTimeout(function() {
									app.redirect("login.html");
								}, 1500);
							} else {
								app.toast("自动登陆中...");
								setTimeout(function() {
									app.redirect("index.html");
								}, 1500);
							}
						} else {
							app.toast(data.message);
						}
					});
				} else {
					//false 第一次登录 直接跳转至首页
					app.redirect("login.html");
				}
			}
		}
	});
	var _this = detectionVue;
	_this.init();
}();