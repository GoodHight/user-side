! function() {
	var orderDetails = new Vue({
		el: "#v_app",
		data: {
			serviceWay: {
				door: 'DOOR',
				store: 'STORE'
			},
			couponType: {
				cash_bonus: 'CASH_BONUS',
				deductible_bonus: 'DEDUCTIBLE_BONUS',
				deductible_card: 'DEDUCTIBLE_CARD'
			},
			orderStatus: {
				WAIT_PAY: 'WAIT_PAY', // 等待用户支付
				PAY_SUCCESS: 'PAY_SUCCESS', // 已支付，等待商家接单
				USER_NO_PAY: 'USER_NO_PAY', // 用户未支付
				SELLER_NO_ACCEPT: 'SELLER_NO_ACCEPT', // 商家过时未接单 
				ARTIFICER_NO_ACCEPT: 'ARTIFICER_NO_ACCEPT', // 技师过时未接单
				APPLY_REFUND: 'APPLY_REFUND', // 申请退款
				SUCCESS_REFUND: 'SUCCESS_REFUND', // 退款成功
				FAIL_REFUND: 'FAIL_REFUND' // 退款失败
			},
			sellerOrderStatus: {
				WAIT_PAY: 'WAIT_PAY', // 等待用户支付
				WAIT_ORDERS: 'WAIT_ORDERS', // 等待接单
				REFUSE_ORDERS: 'REFUSE_ORDERS', // 已接单
				ALREADY_ORDERS: 'ALREAD_ORDERS', // 已拒绝
			},
			artificerOrderStatus: {
				WAIT_PAY: 'WAIT_PAY', // 等待商家接单
				WAIT_ORDERS: 'WAIT_ORDERS', // 等待接单
				REFUSE_ORDERS: 'REFUSE_ORDERS', // 已接单
				ALREADY_ORDERS: 'ALREAD_ORDERS', // 已拒绝
			},
			sign: kdcommon.getQueryString("sign"),
			details: null,
			technician: null,
			name: new app.storage().get("SELLER_USER_NAME"),
			show: null,
			Technician:[],
			tecType:true,
			chooseTec:null
		},
		filters: {
			serviceWayFilter: function(wayStr) {
				if(wayStr == _this.serviceWay.door) {
					return "上门服务";
				}
				return "到店服务";
			},
			couponTypeFilter: function(conponStr) {
				if(conponStr == _this.couponType.cash_bonus) {
					return "现金";
				} else if(conponStr == _this.couponType.deductible_bonus) {
					return "抵扣红包";
				} else if(conponStr == _this.couponType.deductible_card) {
					return "折扣券";
				} else {
					return "";
				}
			},
			preferentialAmountFilter: function([conponType, money]) {
				if(conponType == _this.couponType.cash_bonus) {
					return money + "元现金红包";
				} else if(conponType == _this.couponType.deductible_bonus) {
					return money + "元抵用红包";
				} else if(conponType == _this.couponType.deductible_card) {
					return money + "折折扣券";
				} else {
					return "";
				}
			},
			orderStatusFilter: function(orderInfo) {
				if(orderInfo.is_finish == false) {
					if(orderInfo.order_status == _this.orderStatus.WAIT_PAY) {
						return "等待用户支付";
					} else if(orderInfo.order_status == _this.orderStatus.USER_NO_PAY) {
						return "已失效(未支付)";
					} else if(orderInfo.order_status == _this.orderStatus.SELLER_NO_ACCEPT) {
						return "超时未接单";
					} else if(orderInfo.order_status == _this.orderStatus.APPLY_REFUND) {
						return "用户申请退款";
					} else if(orderInfo.order_status == _this.orderStatus.SUCCESS_REFUND) {
						return "用户已退款";
					} else if(orderInfo.order_status == _this.orderStatus.FAIL_REFUND) {
						return "用户退款失败";
					} else if(orderInfo.seller_orders_status == _this.sellerOrderStatus.WAIT_ORDERS) {
						return "等待接单";
					} else if(orderInfo.seller_orders_status == _this.sellerOrderStatus.REFUSE_ORDERS) {
						return "已接单";
					} else if(orderInfo.seller_order_status == _this.sellerOrderStatus.ALREADY_ORDERS) {
						return "已拒单";
					}
				} else {
					return "已完成";
				}
			}
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getOrderinfo();
//				_this.getTechnician();
				var send = kdcommon.getQueryString("show");
				if(send) {
					_this.show = 'send';
				}
			},
			//获得基础信息
			getOrderinfo: function() {
				app.post(kdcommon.URL.restful, "/sellerOrder/getSellerOrderDetail", app.requestHeadersByToken(), {
					"orderSign": _this.sign
				}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.details = data.data;
						var type = data.data.service_type;
						if(type == 'STORE'){
							_this.show = 'send';
						} else {
							_this.show = 'true';
						}
						if(_this.show == 'send'){
							_this.availableTechnician(data.data.order_service_detail_vo.service_sign);
						}
						_this.getTechnician(data.data.artificer_sign);
						console.log(_this.details);
						app.loginhide();
					} else {
						app.handleReqeustError(data, textStaus);
						app.loginhide();
					}
				});
			},
			//获得可选技师
			availableTechnician:function(sign) {
				app.post(kdcommon.URL.restful, "/sellerOrder/getArtificerItems", app.requestHeadersByToken(), {
					"serviceSign": sign
				}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.Technician = data.data;
						console.log(_this.Technician);
					}
				});
			},
			//查询技师
			getTechnician: function(sign) {
				app.post(kdcommon.URL.restful, "/sellerOrder/getArtificer", app.requestHeadersByToken(), {
					"artificerSign": sign
				}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.chooseTec = data.data;
						_this.show = 'true';
					} else {
						_this.show = 'send';
					}
				});
			},
			//选择技师
			selectTechnician: function(e, sign) {
				if(!_this.tecType){
					return false;
				}
				$(e.currentTarget).addClass("select-technician-c");
				app.loginshow();
				_this.tecType = false;
				app.post(kdcommon.URL.restful, "/order/assignArtificer", app.requestHeadersByToken(), {
					"orderSign": _this.sign,
					"artificerSign": sign
				}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						app.toast("派单成功");
					} else {
						app.toast(data.message);
					}
					app.loginhide();
					_this.tecType = true;
				});
			},
		},
		updated: function() {
			$(".user-img").css("height", $(".user-img").width() + "px");
			$(".entity-img").css("height", $(".entity-img").width() + "px");
			//技师展开
			$("#z_technician").on("click", function() {
				$(this).children(".technician-details").toggleClass("technician-details-c");
			});
//			$("#z_order_ul").on("click", ".select-technician", function() {
//				$(this).parents("li").siblings("li").children(".technician-introduce").children(".select-technician").removeClass("select-technician-c");
//				$(this).toggleClass("select-technician-c");
//				event.stopPropagation();
//			});
		}
	});
	var _this = orderDetails;
	_this.init();
}();