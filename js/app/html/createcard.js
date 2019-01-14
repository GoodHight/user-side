! function() {
	var createcardVue = new Vue({
		el: "#createcardvue",
		data: {
			typeList: {
				"list": [{
					value: 'CASH_BONUS',
					text: '现金红包'
				}, {
					value: 'DEDUCTIBLE_CARD',
					text: '折扣券'
				}, {
					value: 'DEDUCTIBLE_BONUS',
					text: '抵用卡'
				}]
			},
			type: null,
			name: "",
			discount: "",
			discountNum: null,
			numbers: '',
			condition: null,
			conditionList: {
				"list": [{
					value: 'NULL_DOORSILL',
					text: '无门槛'
				}, {
					value: 'Minimum_consume',
					text: '最低消费可用'
				}, {
					value: 'heap_consume',
					text: '累计消费可用'
				}, {
					value: 'first_consume',
					text: '首次消费可用'
				}, {
					value: 'again_consume',
					text: '二次消费可用'
				}]
			},
			service: '',
			suitService: null,
			serviceCont: null,
			overTime: '',
			scopeText: null,
			scope: null,
			submitType:true
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getService();
			},
			getService: function() {
				var postData = {
					"catalogDsc": "SERVICE_TYPE"
				}
				app.post(kdcommon.URL.restful, '/SysCatalogSub/findCatalogSub', app.requestHeadersByToken, postData, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						app.loginhide();
						_this.service = data.data;
					}
				});
			},
			//选择类型
			selectType: function() {
				(function($, doc) {
					$.init();
					$.ready(function() {
						//卡券类型
						var cardPicker = new $.PopPicker();
						cardPicker.setData(_this.typeList.list);
						var showUserPickerButton = doc.getElementById('z_technician');
						cardPicker.show(function(items) {
							var str = JSON.stringify(items[0].text).replace("\"", "").replace("\"", "");
							showUserPickerButton.value = str;
							_this.type = JSON.stringify(items[0].value).replace("\"", "").replace("\"", "");
							_this.discountNum = _this.type;
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					});
				})(mui, document);
			},
			//条件选择
			selectCond: function() {
				(function($, doc) {
					$.init();
					$.ready(function() {
						//条件类型
						var cardPicker = new $.PopPicker();
						cardPicker.setData(_this.conditionList.list);
						var showUserPickerButton = doc.getElementById('z_condition');
						cardPicker.show(function(items) {
							var str = JSON.stringify(items[0].text).replace("\"", "").replace("\"", "");
							showUserPickerButton.value = str;
							_this.type = JSON.stringify(items[0].value).replace("\"", "").replace("\"", "");
							_this.scope = _this.type;
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					});
				})(mui, document);
			},
			//服务选择
			selectSer: function(e, sign, name) {
				_this.serviceCont = sign;
				_this.suitService = name;
			},
			//时间选择
			selectTime: function(e, sign) {
				(function($) {
					$.init();
					var result = $('#result')[0];
					var btns = $('#z_create_time');
					var year = new Date().getFullYear();
					var month = new Date().getMonth() + 1;
					var day = new Date().getDate();
					var hours = new Date().getHours();
					var minutes = new Date().getMinutes();
					var data_options = '{"type":"date","beginYear":' + year + ',"endYear":' + year + ',"beginMonth":' + month + ',"beginDay":' + day + ',"beginHours":' + hours + ',"beginMinutes":' + minutes + '}';
					btns.each(function(i, btn) {
						var optionsJson = data_options || '{}';
						var options = JSON.parse(optionsJson);
						var id = this.getAttribute('id');
						var picker = new $.DtPicker(options);
						picker.show(function(rs) {
							document.getElementById("z_create_time").value = rs.text;
							_this.overTime = rs.text;
							picker.dispose();
						});
					});
				})(mui);
			},
			submitForm: function() {
				if(!_this.submitType){
					return false;
				};
				if(_this.discountNum == '') {
					app.toast("请选择类型");
					return false;
				};
				if(!Regs.posiInt.test(_this.discount)){
					app.toast("金额应为整数");
					return false;
				}
				if(_this.name == '') {
					app.toast("请填写名称");
					return false;
				};
				if(_this.numbers == '') {
					app.toast("请填写数量");
					return false;
				};
				if(!Regs.posiInt.test(_this.numbers)) {
					app.toast("份数应为整数");
					return false;
				};
				if(_this.condition == '') {
					app.toast("请选择适用条件");
					return false;
				};
				if(_this.scope == 'Minimum_consume' || _this.scope == 'heap_consume') {
					if(_this.scopeText == '') {
						app.toast("请填写使用范围");
						return false;
					}
				};
				if(_this.serviceCont == '') {
					app.toast("请选择适用服务");
					return false;
				};
				if(_this.overTime == '') {
					app.toast("请选择截止时间");
					return false;
				};
				app.loginshow();
				var postForm = new FormData;
				postForm.append("publisherType", 1);
				postForm.append("type", _this.discountNum);
				postForm.append("name", _this.name);
				postForm.append("number", _this.numbers);
				postForm.append("money", _this.discount);
				postForm.append("conditions", _this.scope);
				postForm.append("catalogSubSign", _this.serviceCont);
				postForm.append("validityTimeStr", _this.overTime);
				if(_this.scope == 'Minimum_consume' || _this.scope == 'heap_consume') {
					postForm.append("consumeRange", _this.scopeText);
				} else {
					postForm.append("consumeRange", '0');
				};
				_this.submitType = false;
				app.postForm(kdcommon.URL.restful, "/apiCoupon/insertCoupon", app.requestHeadersByToken(), postForm, function(data, textStaus) {
					if(data.code == 0) {
						var btnArray = ['返回服务', '继续创建'];
						mui.confirm('创建成功', '提示', btnArray, function(e) {
							if(e.index == 0) {
								window.location.href = 'service-list.html?type=card'
							} else {
								location.reload();
							}
						}, 'div')
					}
					app.loginhide();
					_this.submitType = true;
				})
			}
		}
	});
	var _this = createcardVue;
	_this.init();
	var headerVue = new Vue({
		el: "#headervue",
		methods: {
			submitBtn: function() {
				_this.submitForm()
			},
			//返回
			backBtn: function() {
				window.location.href = 'service-list.html'
			}
		}
	})
}();