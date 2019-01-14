! function() {
	var businessVue = new Vue({
		el: "#business",
		data: {
			currNum:1,
			serviceTypeSign: '',
			startTimeStr: '',
			endTimeStr: '',
			HdList: [],
			waterInfo: null,
			waterIist: [],
			show: false,
			total:0
		},
		filters: {
			moneyType: function(income_expend_type) {
				if(income_expend_type == 'INCOME_TYPE') {
					return '收入';
				} else if(income_expend_type == 'EXPEND_TYPE') {
					return '提现';
				} else {
					return '退款';
				}
			},
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.selectWater();
				_this.getHdList();
			},
			//查询流水
			selectWater: function() {
				var postData = {
					"serviceTypeSign": _this.serviceTypeSign,
					"startTimeStr": _this.startTimeStr,
					"endTimeStr": _this.endTimeStr,
					"currNum": _this.currNum,
					"pageSize": 20
				}
				_this.getNumber();
				app.post(kdcommon.URL.restful, "/sellerIncome/findStreamByService", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.waterInfo = data.data;
						_this.waterIist = data.data.income_item_query_list;
						if(data.data.income_item_query_list.length == 0) {
							_this.show = true;
						}
						console.log(_this.show)
					}
					app.loginhide();
				});
			},
			//获得数量
			getNumber:function(){
				var postData = {
					"serviceTypeSign": _this.serviceTypeSign,
					"startTimeStr": _this.startTimeStr,
					"endTimeStr": _this.endTimeStr
				}
				app.post(kdcommon.URL.restful, "/sellerIncome/findCount", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.total = data.data;
					}
				});
			},
			//查看更多
			lookMore:function(){
				_this.currNum = _this.currNum+1;
				app.loginshow();
				var postData = {
					"serviceTypeSign": _this.serviceTypeSign,
					"startTimeStr": _this.startTimeStr,
					"endTimeStr": _this.endTimeStr,
					"currNum": _this.currNum,
					"pageSize": 20
				}
				_this.getNumber();
				app.post(kdcommon.URL.restful, "/sellerIncome/findStreamByService", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						var list = data.data.income_item_query_list;
						for (var i = 0 ; i < list.length; i++) {
							_this.waterIist.push(list[i]);
						}
					}
					app.loginhide();
				});
			},
			//获得类型
			getHdList: function() {
				app.post(kdcommon.URL.restful, "/SysCatalogSub/getAllServiceType", null, {}, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						_this.HdList = data.data;
					}
				});
			},
			//显示时间
			showTime: function(e) {
				$(e.currentTarget).parent("div").siblings(".time-top").toggle();
			},
			//选择类型
			selectType: function(e, sign) {
				$(e.currentTarget).toggleClass("business-type-c");
				$(e.currentTarget).siblings("div").removeClass("business-type-c");
				_this.show = false;
				app.loginshow();
				_this.serviceTypeSign = sign;
				_this.selectWater();
			},
			//时间操作
			selectTime: function(e, type) {
				(function($) {
					var year = new Date().getFullYear();
					var month = new Date().getMonth();
					var day = new Date().getDate();
					var dtpicker = new mui.DtPicker({
						type: "date", //设置日历初始视图模式 
						beginDate: new Date(2012, 12, 31), //设置开始日期 
						endDate: new Date(year, month, day), //设置结束日期 
						labels: ['年', '月', '日'], //设置默认标签区域提示语 
					})
					dtpicker.show(function(e) {
						console.log(type)
						if(type == 'start') {
							_this.startTimeStr = e.text;
						} else {
							_this.endTimeStr = e.text;
						}
						_this.timeValidation();
					})
				})(mui);
			},
			//时间验证
			timeValidation: function() {
				var startTime = _this.startTimeStr;
				var endTime = _this.endTimeStr;
				var start = Date.parse(new Date(startTime));
				start = start / 1000;
				var end = Date.parse(new Date(endTime));
				end = end / 1000;
				console.log(start)
				if(end  && !isNaN(start)) {
					if(start < end) {
						app.loginshow();
						_this.selectWater();
					} else {
						app.toast("开始时间应过近")
					}
				}
			}
		}
	});
	var _this = businessVue;
	_this.init();
}();