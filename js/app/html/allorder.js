! function() {
	"use strict";
	var allorderVue = new Vue({
		el: "#allordervue",
		data: {
			orderList: null,
			orderStatus: '',
			orderTotal: null,
			pageNum: 1,
			ordertype: false
		},
		filters: {
			dealWithDate: function(value) {
				var time = value;
				var Time = time.replace(/\-/g, "/");
				var time_c = Date.parse(Time);
				var date = new Date(time_c);
				var Y = date.getFullYear() + '/';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
				var D = date.getDate() + ' ';
				var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
				var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
				var str = (Y + M + D + h + m).toString();
				return str;
			},
			dealWithType: function(value) {
				if(value == 'WAIT_PAY') {
					return '待支付';
				} else if(value == 'PAY_SUCCESS') {
					return '已支付';
				} else if(value == 'USER_NO_PAY') {
					return '未支付';
				} else if(value == 'SELLER_NO_ACCEPT') {
					return '未接单';
				} else if(value == 'ARTIFICER_NO_ACCEPT') {
					return '技师未接单';
				} else if(value == 'APPLY_REFUND') {
					return '申请退款中';
				} else if(value == 'SUCCESS_REFUND') {
					return '退款成功';
				} else if(value == 'SUCCESS_ORDER') {
					return '已完成';
				} else if(value == 'FAILURE_ORDER') {
					return '已失效';
				} else if(value == 'ARTIFICER_YES_ACCEPT') {
					return '已接单';
				}
				return '退款失败';
			}
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getAllorder();
				//				var postData = {
				//					"orderSign": _this.orderInfo.orderSign
				//					"orderSign": '3H9NTClPXDCDKiyLlP9'
				//				}
				//				app.post(kdcommon.URL.restful, '/artificerOrder/updateOrPushOrder', app.requestHeadersByToken(), postData, function(data, textStaus) {
				//					console.log(data)
				//					if(data.code == 0) {}
				//					app.loginhide();
				//				});
			},
			//获得服务订单
			getAllorder: function() {
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": 10,
					"isFinish": _this.orderStatus
				}
				app.post(kdcommon.URL.restful, "/sellerOrder/getSellerAllOrder", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.orderList = data.data;
						_this.orderTotal = data.total;
						//获得当前时间戳
						var timestamp = Date.parse(new Date());
						//获得订单时间戳
						for(var i = 0; i < _this.orderList.length; i++) {
							if(_this.orderList[i].service_type == 'DOOR') {
								_this.orderList[i].order_status = 'ARTIFICER_YES_ACCEPT';
							};
							if(_this.orderList[i].is_finish == true && _this.orderList[i].seller_orders_status == 'REFUSE_ORDERS') {
								_this.orderList[i].order_status = 'SUCCESS_ORDER';
							};
							if(_this.orderList[i].order_status == 'PAY_SUCCESS' && _this.orderList[i].seller_orders_status == 'REFUSE_ORDERS') {
								_this.orderList[i].order_status = 'ARTIFICER_YES_ACCEPT';
							};
							var etime = Date.parse(_this.orderList[i].created_time);
							var usedTime = timestamp - etime;
							var days = Math.floor(usedTime / (24 * 3600 * 1000));
							//计算出小时数  
							var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数  
							var hours = Math.floor(leave1 / (3600 * 1000));
							//计算相差分钟数  
							var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数  
							var minutes = Math.floor(leave2 / (60 * 1000));
							var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  
							var seconds = Math.round(leave3 / 1000);
							//							if(days > 0 || hours > 0 || minutes > 15 && _this.orderList[i].order_status == 'PAY_SUCCESS' && _this.orderList[i].seller_orders_status == 'SELLER_NO_ACCEPT') {
							//								_this.orderList[i].order_status = 'FAILURE_ORDER';
							//							}
						}
					} else if(data.code == '30008') {
						_this.ordertype = true
						app.loginhide();
					} else {
						app.loginhide();
					}
					app.loginhide();
				});
			},
			//更多
			getMore: function() {
				_this.pageNum = _this.pageNum + 1;
				app.loginshow();
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": 10,
					"isFinish": _this.orderStatus
				}
				app.post(kdcommon.URL.restful, "/sellerOrder/getSellerAllOrder", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						var List = data.data;
						//获得当前时间戳
						var timestamp = Date.parse(new Date());
						//获得订单时间戳
						for(var i = 0; i < List.length; i++) {
							if(List[i].service_type == 'DOOR') {
								List[i].order_status = 'ARTIFICER_YES_ACCEPT';
							};
							if(List[i].is_finish == true && List[i].seller_orders_status == 'REFUSE_ORDERS') {
								List[i].order_status = 'SUCCESS_ORDER';
							};
							if(List[i].order_status == 'PAY_SUCCESS' && List[i].seller_orders_status == 'REFUSE_ORDERS') {
								List[i].order_status = 'ARTIFICER_YES_ACCEPT';
							};
							var etime = Date.parse(List[i].created_time);
							var usedTime = timestamp - etime;
							var days = Math.floor(usedTime / (24 * 3600 * 1000));
							//计算出小时数  
							var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数  
							var hours = Math.floor(leave1 / (3600 * 1000));
							//计算相差分钟数  
							var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数  
							var minutes = Math.floor(leave2 / (60 * 1000));
							var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数  
							var seconds = Math.round(leave3 / 1000);
							_this.orderList.push(List[i]);
						}
						app.loginhide();
					}
				});
			},
			//类型选择
			typeSelect: function(e, value) {
				_this.orderStatus = value;
				_this.orderList = null;
				_this.orderTotal = null;
				_this.ordertype = false;
				app.loginshow();
				_this.getAllorder();
			},
			//订单操作
			orderOperation: function(e, sign, type, ordertype, ordersign) {
				app.loginshow();
				var postData = {
					"orderSign": sign,
					"sellerOrderServiceType": type
				}
				app.post(kdcommon.URL.restful, "/order/sellerOrders", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						if(ordertype == 'STORE') {
							app.toast("接单成功，跳转订单中...");
							window.location.href = 'order-details.html?sign=' + ordersign + '&show=sned';
						} else {
							app.toast("接单成功");
							location.reload();
						}

					} else {
						app.toast(data.message);
					}
					app.loginhide();
				});
			},
			orderDetails: function(e, status, number) {
				console.log(status)
				if(status == 'WAIT_SERVICE') {
					window.location.href = 'order-select.html?sign=' + number;
				} else {
					window.location.href = 'order-details.html?sign=' + number;
				}
			}
		},
		updated: function() {

			//这两种都能用, 一个是在form上加id 一个是在input元素加id
			//对于苹果手机添加一个form元素是必要的,否则只能实现功能但是键盘的文字不能变成搜索字样
			$('#myform').bind('search', function() {
				//coding
				alert(1);
			});
			//			$('#myinput').bind('search', function() {
			//				//coding
			//				alert(1);
			//			});
			//时间选择
			//			var timetype = true;
			//			$("#z_order_time")[0].addEventListener("tap", function() {
			//				if(timetype) {
			//					$(".order-time-box").show();
			//					$(".order-time").css({
			//						"margin-top": "44px",
			//						"transition": "0.5s"
			//					});
			//					timetype = false;
			//				} else {
			//					$(".order-time").css({
			//						"margin-top": "-11px",
			//						"transition": "0.5s"
			//					});
			//					setTimeout(function() {
			//						$(".order-time-box").hide();
			//					}, 500);
			//					timetype = true;
			//				}
			//			});
		}
	});
	var _this = allorderVue;
	_this.init();
}();