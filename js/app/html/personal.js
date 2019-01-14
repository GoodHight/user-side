! function() {
	var personalVue = new Vue({
		el: "#personalvue",
		data: {
			info: null,
			title: null,
			userHerder: null
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getInfo();
			},
			getInfo: function() {
				app.post(kdcommon.URL.restful, '/seller/getSellerDetail', app.requestHeadersByToken(), {}, function(data, textStatus) {
					if(data.code == 0) {
						app.loginhide();
						_this.info = data.data;
						_this.title = data.data.name;
						_this.userHerder = data.data.ad_head_url;
					}
				});
			},
			//申请兼职
			applyPartTime: function() {
				var btnArray = ['是', '否'];
				mui.confirm('是否申请兼职技师', '提示', btnArray, function(e) {
					if(e.index == 0) {
						app.post(kdcommon.URL.restful, '/seller/updateApplyJob', app.requestHeadersByToken(), {}, function(data, textStatus) {
							console.log(data)
							if(data.code == 0) {
								app.toast("申请成功，请耐心等待审核。")
								app.loginhide();
							} else {
								app.toast(data.message);
							}
						});
					}
				},'div');
			},
			//退出登录
			exit: function() {
				var storage = new app.storage();
				var btnArray = ['是', '否'];
				mui.confirm('确定退出吗？', '提示', btnArray, function(e) {
					if(e.index == 0) {
						localStorage.clear();
						sessionStorage.clear();
						window.location.href = "../../login.html"
					}
				},'div');
			}
		}
	});
	var _this = personalVue;
	_this.init();
}();