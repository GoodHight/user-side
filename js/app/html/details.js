! function() {
	var detailsVue = new Vue({
		el: "#detailsvue",
		data: {
			details: null,
			sign: kdcommon.getQueryString("sign")
		},
		methods: {
			init: function() {
				app.loginshow();
				var postData = {
					"sign": _this.sign
				}
				app.post(kdcommon.URL.restful, '/headline/getHeadlineDetail', null, postData, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.details = data.data;
						var time = _this.details.created_time;
						var time_c = Date.parse(time);
						var date = new Date(time_c);
						M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
						D = date.getDate() + ' ';
						h = date.getHours() + ':';
						m = date.getMinutes();
						_this.details.created_time = M + D + h + m;
						console.log(_this.details)
					}
					app.loginhide();
				});
  
			}
		}
	});
	var _this = detailsVue;
	_this.init();
}();