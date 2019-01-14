! function() {
	var applylist = new Vue({
		el: "#applylist",
		data: {
			applylist: [],
			listtype: false
		},
		filters: {
			dateformatting: function(value) {
				if(!value) {
					return ''
				}
				var time = value;
				var time_c = Date.parse(time);
				var date = new Date(time_c);
				Y = date.getFullYear() + '/';
				M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
				D = date.getDate() + ' ';
				h = date.getHours() + ':';
				m = date.getMinutes();
				return Y + M + D + h + m;
			},
			serviceText: function(value) {
				if(!value) return '';
				var arrays = value.split(" ");
				var str = '';
				for(var i = 0; i < arrays.length; i++) {
					str += arrays[i] + "/";
				}
				str = str.substring(0, str.length - 2);
				return str;
			}
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getApplylist();
			},
			getApplylist: function() {
				app.post(kdcommon.URL.restful, '/seller/getSellerArtificerApplys', app.requestHeadersByToken(), {}, function(data, textStatus) {
					if(data.code == 0) {
						var list = data.data;
						for(var i = 0; i < list.length; i++) {
							_this.applylist.push(list[i])
						}
					} else {
						app.toast(message);
					}
					if(_this.applylist.length == 0) {
						_this.listtype = true;
					}
					app.loginhide();
				});
			},
			//user操作
			userOperation: function(e, type, sign) {
				//同意true 拒绝false
				if(type) {
					var btnArray = ['是', '否'];
					mui.confirm('确定通过此申请吗？', '提示', btnArray, function(e) {
						if(e.index == 0) {
							app.loginshow();
							var postdata = {
								"auditStatus": 'PLATFORM_AUDIT',
								"artificerSign": sign
							}
							app.post(kdcommon.URL.restful, '/seller/updateArtificerStatus', app.requestHeadersByToken(), postdata, function(data, textStatus) {
								if(data.code == 0) {
									app.toast("操作成功，等待平台二次审核！");
									setTimeout(function() {
										window.location.reload();
									}, 500);
								}
								app.loginhide();
							});
						}
					},'div');
				} else {
					var btnArray = ['是', '否'];
					mui.confirm('确定拒绝此申请吗？', '提示', btnArray, function(e) {
						if(e.index == 0) {
							app.loginshow();
							var postdata = {
								"auditStatus": 'SELLER_NOT',
								"artificerSign": sign
							}
							app.post(kdcommon.URL.restful, '/seller/updateArtificerStatus', app.requestHeadersByToken(), postdata, function(data, textStatus) {
								alert(data.code)
								if(data.code == 0) {
									app.toast("操作成功");
									setTimeout(function() {
										window.location.reload();
									}, 500);
								};
								app.loginhide();
							});
						}
					},'div');
				}
			},
			//查看详情
			detailedInfo: function(e, sign) {
				window.location.href = 'technician-info.html?sign=' + sign + "&type=apply";
			}
		}
	});
	var _this = applylist;
	_this.init();
}();