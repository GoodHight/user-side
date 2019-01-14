! function() {
	var servicelistVue = new Vue({
		el: "#servicelist",
		data: {
			pageNum: 1,
			HdList: null,
			servicelist: null,
			sign: '',
			total: null,
			pageType: kdcommon.getQueryString("type"),
			storages:new app.storage('session'),
			pageClass: null,
			currNum: 1,
			cardList: null,
			service: false,
			codec: false,
			reviewstatus: null
		},
		methods: {
			init: function() {
				//展示内容
				_this.pageClass = _this.storages.get("PAGE_TYPE");
				if(_this.pageClass == null) {
					_this.pageClass = 'list';
					_this.storages.set("PAGE_TYPE","list");
					app.loginshow();
					_this.getAllService();
					_this.getHdList();
				} else if(_this.pageClass == 'card') {
					_this.pageClass = 'card';
					_this.storages.set("PAGE_TYPE","card");
					app.loginshow();
					_this.getCardList();
					_this.getListCont();
				} else {
					_this.pageClass = 'list';
					_this.storages.set("PAGE_TYPE","list");
					app.loginshow();
					_this.getAllService();
					_this.getHdList();
				}
				_this.reviewStatus();
			},
			getAllService: function() {
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": 20,
					"serviceTypeSign": _this.sign
				}
				app.post(kdcommon.URL.restful, "/service/getAllService", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.servicelist = data.data_list;
						_this.total = data.total;
					} else if(data.code == 200004) {
						_this.service = true;
					}
					app.loginhide();
				});
			},
			//查询审核状态
			reviewStatus: function() {
				app.post(kdcommon.URL.restful, "/seller/checkSellerRight", app.requestHeadersByToken(), {}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.reviewstatus = data.data;
					}
				});
			},
			//获取更多
			getMore: function() {
				app.loginshow();
				_this.pageNum = _this.pageNum + 1;
				_this.getAllService();
			},
			//获得类型
			getHdList: function() {
				app.post(kdcommon.URL.restful, "/SysCatalogSub/getAllServiceType", null, {}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.HdList = data.data;
					}
				});
			},
			//获取服务详情
			getService: function(e, sign) {
				window.location.href = 'service-details.html?sign=' + sign;
			},
			//删除服务
			deleteService: function(e, sign) {
				var btnArray = ['是', '否'];
				mui.confirm('确认删除这个服务吗？', '提示', btnArray, function(e) {
					if(e.index == 0) {
						app.loginshow();
						var postData = {
							"sign": sign
						};
						app.post(kdcommon.URL.restful, "/service/deleteServiceBySign", app.requestHeadersByToken(), postData, function(data, textStaus) {
							console.log(data)
							if(data.code == 0) {
								for(var i = 0; i < _this.servicelist.length; i++) {
									if(_this.servicelist[i].sign == sign) {
										_this.servicelist.splice(i, 1);
									}
								}
								app.toast("删除成功");
							}
							app.loginhide();
						});
					}
				}, 'div')
			},
			//类型查询
			typeSelect: function(e, sign) {
				app.loginshow();
				_this.sign = sign;
				_this.service = false;
				_this.servicelist = null;
				_this.getAllService();
			},
			//______________________________________________卡券_________________________________________________
			//获得卡券列表
			getCardList: function() {
				var postData = {
					"currNum": _this.currNum,
					"start": '',
					"end": '',
					"couponType": 4,
					"publisherType": 1,
					"pageSizeStr": 10
				};
				app.post(kdcommon.URL.restful, "/apiCoupon/findCouponByS", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.cardList = data.data;
						for(var i = 0; i < _this.cardList.length; i++) {
							//处理时间
							var time = _this.cardList[i].validity_time;
							var Time = time.replace(/\-/g, "/"); 
							var time_c = Date.parse(time);
							var date = new Date(time_c);
							Y = date.getFullYear() + '/';
							M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
							D = date.getDate() + ' ';
							h = date.getHours() + ':';
							m = date.getMinutes();
							_this.cardList[i].validity_time = Y + M + D + h + m;
							//处理条件
							var cts = _this.cardList[i].conditions;
							if(cts == '0') {
								_this.cardList[i].conditions = "无"
							} else if(cts == '1') {
								_this.cardList[i].conditions = "最低消费" + _this.cardList[i].consume_range + "元";
							} else if(cts == '2') {
								_this.cardList[i].conditions = "累计消费" + _this.cardList[i].consume_range + "元";
							} else if(cts == '3') {
								_this.cardList[i].conditions = "首次消费"
							} else if(cts == '4') {
								_this.cardList[i].conditions = "二次消费"
							}
						}
					} else if(data.code == 50001) {
						_this.codec = true;
					}
					app.loginhide();
				})
			},
			//获得卡券数量
			getListCont: function() {
				var postData = {
					"start": "",
					"end": "",
					"couponType": 4,
					"publisherType": 1
				}
				app.post(kdcommon.URL.restful, "/apiCoupon/findCount", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data)
				});
			},
			//删除卡券
			deleteCard: function(e, sign) {
				console.log(e)
				var fu = $(e.currentTarget).parents('li');
				var btnArray = ['是', '否'];
				mui.confirm('确认删除这个卡券吗？', '提示', btnArray, function(e) {
					if(e.index == 0) {
						var postData = {
							"sign": sign
						};
						app.post(kdcommon.URL.restful, "/apiCoupon/delCoupon", app.requestHeadersByToken(), postData, function(data, textStaus) {
							console.log(data)
							if(data.code == 0) {
								app.toast("删除成功");
								$(fu).remove();
							} else {
								app.toast(data.message);
							}
						});
					} else {

					}
				}, 'div')
			}

		},
		updated: function() {
			this.$nextTick(function() {
				var star = $(".service-score>span")
				for(var i = 0; i < star.length; i++) {
					var str = $(star[i]).attr("data-star");
					if(str == null) {
						str = 0;
					}
					console.log(str)
					$(star[i]).siblings("img").remove();
					score(str, $(star[i]));
				}
			})
		}

	});
	var _this = servicelistVue;
	_this.init();
	var headerVue = new Vue({
		el: "#headervue",
		data: {
			pageType: kdcommon.getQueryString("type"),
			pageClass: null
		},
		methods: {
			init: function() {
				_thing.pageClass = _this.storages.get("PAGE_TYPE");
				if(_thing.pageClass == null) {
					_this.storages.set("PAGE_TYPE","list");
					_thing.pageClass = "list";
				} else if(_thing.pageClass == 'card'){
					_this.storages.set("PAGE_TYPE","card");
					_thing.pageClass = "card";
				} else {
					_this.storages.set("PAGE_TYPE","list");
					_thing.pageClass = "list";
				}
			},
			headerCut: function(e, type) {
				_this.pageClass = type;
				_thing.pageClass = type;
				_this.storages.set("PAGE_TYPE",type);
				if(_this.pageClass == 'list') {
					app.loginshow();
					_this.getAllService();
					_this.getHdList();
				} else {
					app.loginhide();
					app.loginshow();
					_this.getCardList()
				}

			},
			jumpCreate: function(e) {
				if(_this.reviewstatus == null){
					app.toast("正在检测商家信息...")
					return false;
				}
				console.log(_this.reviewstatus)
				if(_this.reviewstatus == "NULL_AUDIT" || _this.reviewstatus == 'null') {
					var btnArray = ['是', '否'];
					mui.confirm('您尚未实名认证，是否认证？', '提示', btnArray, function(e) {
						if(e.index == 0) {
							app.redirect("../../real-name.html");
						}
					},'div');
					return false;
				} else if(_this.reviewstatus == "WAIT_AUDIT") {
					mui.alert('您的实名认证尚未审核，请耐心等待', '提示', function() {}, 'div');
					return false;
				} else if(_this.reviewstatus == "NOT_THROUGH") {
					var btnArray = ['是', '否'];
					mui.confirm('您的实名认证未通过，是否重新认证？', '提示', btnArray, function(e) {
						if(e.index == 0) {
							app.redirect("../../real-name.html");
						}
					},'div');
					return false;
				};
				if(_thing.pageClass == 'list') {
					window.location.href = "create-service.html"
				} else {
					window.location.href = "create-card.html"
				};
			}
		}
	});
	var _thing = headerVue;
	_thing.init();
}();