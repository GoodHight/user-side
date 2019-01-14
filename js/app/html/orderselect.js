! function() {
	var orderSelect = new Vue({
		el: "#orderselect",
		data: {
			sign: kdcommon.getQueryString("sign"),
			orederInfo: null,
			name:new app.storage().get("SELLER_USER_NAME")
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getOrderinfo()
			},
			getOrderinfo: function() {
				var token = {
					"X-Auth-Token": "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJadDdXaG80UmJEN3ozeG5OT2IzIiwiaXNzIjoid3d3Lmt1ZGFpaXQuY29tIiwic3ViIjoie1wic2lnblwiOlwiMTIzaHh5XCIsXCJ1aWRcIjpcIlwifSIsImlhdCI6MTUyMTY1ODQ4NywiZXhwIjoxNTIxNjg4NDg3fQ.EzgS66Aiy4IDXIPaCS_2tgCKNW2vjKdvto8mQqskX6A"
				};
				app.post(kdcommon.URL.restful, "/order/getSellerOrderDetail", token, {
					"orderSign": _this.sign
				}, function(data, textStaus) {
					console.log(data) 
					if(data.code == 0) {
						_this.orederInfo = data.data;
						app.loginhide();
					}
				});
			}
		},
		updated: function() {
			var gallery = mui('.mui-slider');
			gallery.slider({
				interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
			});
			//技师展开
			$("#z_technician").on("tap", function() {
				$(this).children(".technician-details").toggleClass("technician-details-c");
			});
		}
	});
	var _this = orderSelect;
	_this.init();
}();