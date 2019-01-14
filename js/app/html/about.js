! function() {
	var indexVue = new Vue({
		el: "#about",
		data: {
			findPlatform:null
		},

		methods: {
			init: function() {
				_this.getFindPlatform();
			},
			getFindPlatform: function() {
				var getData = {
					
				}
				app.get(kdcommon.URL.restful, '/platform/findPlatform', null, getData, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						_this.findPlatform = data.data;
					}
				});
			},
		}
	});
	var _this = indexVue;
	_this.init();
}();