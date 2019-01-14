! function() {
	var texhnicianList = new Vue({
		el: "#texhnicianlist",
		data: {
			texhnicianList: [],
			showType: true,
			pageNum: 0,
			total: null
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
				var postdata = {
					'pageNum': _this.pageNum,
					'pageSize': 2
				}
				app.post(kdcommon.URL.restful, "/seller/getSellerArtificerView", app.requestHeadersByToken(), postdata, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						var list = data.data;
						_this.total = data.data.total;
						for(var i = 0; i < list.length; i++) {
							_this.texhnicianList.push(list[i]);
						}
						if(_this.texhnicianList.length == 0) {
							_this.showType = false;
						}
					} else {
						app.toast(data.message)
					}
					app.loginhide();
				});
			},
			//获取更多
			getmoreInfo: function() {
				app.loginshow();
				_this.pageNum = _this.pageNum + 1;
				var postdata = {
					'pageNum': _this.pageNum,
					'pageSize': 2
				}
				app.post(kdcommon.URL.restful, "/seller/getSellerArtificerView", app.requestHeadersByToken(), postdata, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						var list = data.data;
						for(var i = 0; i < list.length; i++) {
							_this.texhnicianList.push(list[i]);
						}
						if(_this.texhnicianList.length == 0) {
							_this.showType = false;
						}
					} else {
						app.toast()
					}
					app.loginhide();
				});
			},
			//删除技师
			deleteTechnician: function(e, sign) {
				var btnArray = ['是', '否'];
				mui.confirm('确定删除此技师吗？', '提示', btnArray, function(e) {
					if(e.index == 0) {
						app.loginshow();
						app.post(kdcommon.URL.restful, "/seller/deleteArtificer", app.requestHeadersByToken(), {
							"artificerSign": sign
						}, function(data, textStaus) {
							console.log(data);
							if(data.code == 0) {
								app.toast("删除成功")
							} else {
								app.toast(data.message);
							}
							app.loginhide();
						});
					}
				},'div');
			},
			//查看技师详情
			lookTechnician: function(e, sign) {
				window.location.href = 'technician-info.html?sign=' + sign + "&type=technician";
			}
		}
	});
	var _this = texhnicianList;
	_this.init();
}();