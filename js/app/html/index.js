! function() {
	var indexVue = new Vue({
		el: "#indexvue",
		data: {
			bannerlist: [],
			headerList: null,
			pagetotal: null,
			HdList: null,
			pageNum: 1,
			refreshBtn: null,
			sign: '',
			type: true
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getBanner();
				_this.getHeader();
				_this.getHdList()
			},
			getBanner: function() {
				var getData = {
					"type": "SELLER"
				}
				app.get(kdcommon.URL.restful, '/global/banners', null, getData, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						var banner = data.data;
						for (var i = 0 ; i < banner.length ; i++) {
							console.log(banner[i])
							_this.bannerlist.push(banner[i])
						}
					console.log(_this.bannerlist)	
					}
				});
			},
			//获得头条
			getHeader: function() {
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": 20,
					"headLineTypeSign": _this.sign
				};
				app.post(kdcommon.URL.restful, '/headline/getAllHeadlines', null, postData, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.headerList = data.data_list;
						_this.pagetotal = data.total;
						for(var i = 0, len = _this.headerList.length; i < len; i++) {
							var time = _this.headerList[i].created_time;
							var Time = time.replace(/\-/g, "/");
							console.log(Time)
							var time_c = Date.parse(Time);
							var date = new Date(time_c);
							//							Y = data.getYear()+'/';
							M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
							D = date.getDate() + ' ';
							h = date.getHours() + ':';
							m = date.getMinutes();
							_this.headerList[i].created_time = M + D + h + m;
						}
						if(_this.refreshBtn) {
							$(_this.refreshBtn).removeClass("rotation");
						}

					} else {
						app.toast(data.message)
					}
					app.loginhide()
				});
			},
			//加载更多
			getMoreHeader: function() {
				_this.pageNum = _this.pageNum + 1;
				app.loginshow();
				var postData = {
					"pageNum": _this.pageNum,
					"pageSize": 20,
					"headLineTypeSign": _this.sign
				};
				app.post(kdcommon.URL.restful, '/headline/getAllHeadlines', null, postData, function(data, textStaus) {
					console.log(data)
					if(data.code = 0) {
						var headerList = data.data_list;
						_this.pagetotal = data.total;
						for(var i = 0, len = headerList.length; i < len; i++) {
							var time = headerList[i].created_time;
							var Time = time.replace(/\-/g, "/"); 
							console.log(Time)
							var time_c = Date.parse(Time);
							var date = new Date(time_c);
							var m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
							var d = date.getDate() + ' ';
							var h = date.getHours() + ':';
							var m = date.getMinutes();
							var str = (m + d + h + m).toString();
							headerList[i].created_time = str ;
							_this.headerList.push(headerList[i])
						}
					}
					app.loginhide();
				});
			},
			//按钮刷新
			getNewheader: function(e) {
				var btn = e.currentTarget;
				_this.refreshBtn = e.currentTarget;
				$(btn).addClass("rotation");
				_this.pageNum = 0;
				_this.getHeader();
			},
			//查看全文
			fullText: function(e, sign) {
				window.location.href = 'html/headlines/headlines-details.html?sign=' + sign;
			},
			//获得类型
			getHdList: function() {
				app.post(kdcommon.URL.restful, "/headlineType/getAllHeadlineType", null, {}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.HdList = data.data_list
					} else {
						app.toast(data.message)
					}
				});
			},
			//类型切换
			typeSelect: function(e, sign) {
				_this.sign = sign;
				_this.getHeader();
				app.loginshow();
			}
		},
		updated: function() {
			//获得slider插件对象
			var gallery = mui('.mui-slider');
			gallery.slider({
				interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
			});
			$(".info-type").on("tap", "li", function() {
				$(this).siblings("li").removeClass("info-type-c");
				$(this).addClass("info-type-c");
			});
			//模拟下拉
			var tops, score, touchpros1;
			$(".graphic-box").on("touchstart", function(event) { //手指按下
				touchpros1 = event.touches[0].clientY; //得到手指按下的坐标
				score = $(window).scrollTop(); //得到当前滚动条位置
			});
			//手指滑动
			$(".graphic-box").on("touchmove", function(event) {
				var touchpros2 = event.touches[0].clientY;
				var top = touchpros2 - touchpros1; //得到滑动的值
				tops = top;
				if(top > 1 && score == 0) { //判断是不是往下滑
					$(".graphic-box").css("margin-top", top / 3 + "px");
					if(tops >= 200) {
						$("#z_refresh>img").css({
							"transform": "rotateZ(180deg)",
							"transition": "0.5s"
						});
						$("#z_refresh>span").text("松开立即刷新");
					}
				}
			});

			$(".graphic-box").on("touchend", function(event) {
				if(tops < 200 && score == 0) {
					$(".graphic-box").css("margin-top", "5px");
				} else if(tops >= 200 && score == 0) {
					$("#z_img").hide();
					$("#z_gif").show();
					$("#z_refresh>span").text("正在刷新");
					$(".graphic-box").css("margin-top", "50px");
					if(_this.type) {
						var postData = {
							"pageNum": _this.pageNum,
							"pageSize": 20,
							"headLineTypeSign": _this.sign
						};
						app.post(kdcommon.URL.restful, '/headline/getAllHeadlines', null, postData, function(data, textStaus) {
							if(data.code == 0) {
								_this.headerList = data.data_list;
								_this.pagetotal = data.total;
								for(var i = 0, len = _this.headerList.length; i < len; i++) {
									var time = _this.headerList[i].created_time;
									var time_c = Date.parse(time);
									var date = new Date(time_c);
									M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
									D = date.getDate() + ' ';
									h = date.getHours() + ':';
									m = date.getMinutes();
									_this.headerList[i].created_time = M + D + h + m;
								}
								if(_this.refreshBtn) {
									$(_this.refreshBtn).removeClass("rotation");
								}
								$("#z_refresh>img").css({
									"transform": "rotateZ(0deg)",
									"transition": "0.5s"
								});
								$(".graphic-box").css("margin-top", "5px");
								$("#z_img").show();
								$("#z_gif").hide();
								$("#z_refresh>span").text("下拉刷新");
								_this.type = true;
							}
						});
						_this.type = false;
					}
				}
			});
		}
	});
	var _this = indexVue;
	_this.init();
	
	var headerVue = new Vue({
		el: "#header",
		data: {
			searchText: ''
		},
		methods: {
			searchBtn: function() {
				//头部搜索
				if(!_this.searchText == '') {
					app.toast("请输入要搜索的内容")
				} else {
					app.loginshow();
					var postData = {
						'pageNum': 1,
						'pageSize': 20,
						'content': _thing.searchText
					}
					app.post(kdcommon.URL.restful, "/headline/queryByContent", null, postData, function(data, textStaus) {
						console.log(data)
						if(data.code == 0) {
							_this.headerList = data.data_list;
							_this.pagetotal = data.total;
							for(var i = 0, len = _this.headerList.length; i < len; i++) {
								var time = _this.headerList[i].created_time;
								var time_c = Date.parse(time);
								var date = new Date(time_c);
								//Y = data.getYear()+'/';							
								M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
								D = date.getDate() + ' ';
								h = date.getHours() + ':';
								m = date.getMinutes();
								_this.headerList[i].created_time = M + D + h + m;
							}
							if(_this.refreshBtn) {
								$(_this.refreshBtn).removeClass("rotation");
							}
							app.loginhide();
						}
					});
				}
			}
		}
	});
	var _thing = headerVue;
}();