! function() {
	var informationVue = new Vue({
		el: "#informationvue",
		data: {
			info: null
		},
		filters:{
			dealWithType:function(value) {
				if (!value) return ''
				if(value == 'WAIT_AUDIT'){
					return '待审核'
				} else if (value == 'PASS_THROUGH'){
					return '已通过'
				} else {
					return '未通过'
				}
			}
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getInfo();
			},
			getInfo: function() {
				app.post(kdcommon.URL.restful, '/seller/getSellerDetail', app.requestHeadersByToken(), {}, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						_this.info = data.data;
						app.loginhide();
					}
				});
			}
		}
	});
	var _this = informationVue
	_this.init();
}()