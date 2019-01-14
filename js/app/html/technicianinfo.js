! function() {
	var technicianInfo = new Vue({
		el: "#technicianinfo",
		data: {
			sign: kdcommon.getQueryString('sign'),
			type: kdcommon.getQueryString('type'),
			pagetype: true,
			infoList: []
		},
		filters: {
			serviceText: function(value) {
				if(!value) return '';
				var arrays = value.split(" ");
				var str = '';
				for(var i = 0; i < arrays.length; i++) {
					str += arrays[i] + "/";
				}
				str = str.substring(0, str.length - 2);
				console.log(str)
				return str;
			}
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getchnicianinfo();
			},
			//获得技师信息
			getchnicianinfo: function() {
				if(_this.type == 'apply') { //申请技师详情
					_this.pagetype = false;
					app.post(kdcommon.URL.restful, "/seller/getArtificerApplyDetail", app.requestHeadersByToken(), {
						'sign': _this.sign
					}, function(data, textStaus) {
						console.log(data)
						if(data.code == 0) {
							_this.infoList = data.data;
						} else {
							app.toast(message)
						}
						app.loginhide();
					});
				} else {
					app.post(kdcommon.URL.restful, "/seller/getSellerArtificerDetail", app.requestHeadersByToken(), {
						'sign': _this.sign
					}, function(data, textStaus) {
						console.log(data)
						if(data.code == 0) {
							_this.infoList = data.data;
						} else {
							app.toast(message)
						}
						app.loginhide();
					});
				}

			}

		}
	});
	var _this = technicianInfo;
	_this.init();
}();