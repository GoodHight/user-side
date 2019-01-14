! function() {
	var serviceDetails = new Vue({
		el: "#servicedetails",
		data: {
			sign: kdcommon.getQueryString("sign"),
			detailsList: null,
			name: new app.storage().get("SELLER_USER_NAME"),
			technician:[]
		},
		filters: {
			dateFormatting: function(value) {
				if(!value) return ''
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
				console.log(str)
				return str;
			}
		},
		methods: {
			init: function() {
				_this.getServiceMan();
				app.loginshow();
				var postData = {
					"serviceSign": _this.sign
				}
				app.post(kdcommon.URL.restful, "/service/getServiceDetail", null, postData, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.detailsList = data.data;
						var arrays = _this.detailsList.img_url.substring(0, _this.detailsList.img_url.length - 1);
						_this.detailsList.img_url = arrays.split(',');
					}
					app.loginhide();
				});
				
			},
			//上下架操作
			shelvesBtn:function(e, type){
				console.log(type)
				if(type){
					if(_this.detailsList.audit_status == 'WAIT_AUDIT' || _this.detailsList.audit_status =='NOT_THROUGH'){
						app.toast("当前服务不可上架")
						return false
					}
					app.loginshow();
					app.post(kdcommon.URL.restful, '/service/updateServiceIsShelves', null, {'sign':_this.sign,'isShelves':true}, function(data, textStaus){
						if(data.code == 0){
							app.toast("上架成功");
							_this.detailsList.is_shelves = true;
						}
						app.loginhide();
					});
				} else {
					app.loginshow();
					//执行下架操作
					app.post(kdcommon.URL.restful, '/service/updateServiceIsShelves', null, {'sign':_this.sign,'isShelves':false}, function(data, textStaus){
						if(data.code == 0){
							app.toast("下架成功");
							_this.detailsList.is_shelves = false;
						}
						app.loginhide();
					});
				}
			},
			//技师展开
			expansion:function(e){
				$(e.currentTarget).children(".technician-details").toggleClass("technician-details-c");
			},
			//获得服务技师
			getServiceMan:function(){
				var postData = {
					"serviceSign": _this.sign
				}
				app.post(kdcommon.URL.restful, "/service/getServiceArtificerItem", app.requestHeadersByToken(), postData, function(data, textStaus) {
					if(data.code == 0) {
						var list = data.data;
						for(var i = 0;i<list.length;i++) {
							_this.technician.push(list[i])
						}
						console.log(_this.technician)
					}
					app.loginhide();
				});
			},
			//查看更多评价
			lookMore: function() {

			}
		},
		updated: function() {
			this.$nextTick(function() {
				var gallery = mui('.mui-slider');
				gallery.slider({
					interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
				});
				var nodeing_A = $(".technician-p3>span");
				for(var i = 0; i < nodeing_A.length; i++) {
					var nodeing = $(nodeing_A[i]).attr("data-star");
					score(nodeing, $(nodeing_A[i]));
				};
				var nodeing_B = $(".user-score>a");
				for(var i = 0; i < nodeing_B.length; i++) {
					var nodeing = $(nodeing_B[i]).attr("data-star");
					score(nodeing, $(nodeing_B[i]));
				};
				var nodeing_C = $(".details-score>a")[0]
				var nodeung = $(nodeing_C).attr("data-star");
				score(nodeung, $(nodeing_C)[0]);
				//等比例
				$(".technician-icon").css("height", $(".technician-icon").width() + "px");
				$(".user-img").css("height", $(".user-img").width() + "px");
				$(".entity-img").css("height", $(".entity-img").width() + "px");
				//回复
				$(".reply").on("click", function() {
					$(".input-box").show();
					//触发键盘
					document.getElementById('z_reply').focus()
					//				$("#z_reply").trigger("click").focus();
				});
			});
		}
	});
	var _this = serviceDetails;
	_this.init();
}();