 ! function() {
	var createService = new Vue({
		el: "#createservice",
		data: {
			classification: null,
			time: '',
			title: '',
			technician: '',
			techniSign: [],
			wayService: [],
			serviceTyp: null,
			servicetext: '',
			money: '',
			duration: '',
			content: '',
			commission: '',
			value: null,
			divbox: null,
			schematic: null,
			banner: [],
			servicePicker: [],
			HdList: null,
			submitType: true,
			door:false
		},
		methods: {
			init: function() {
				app.loginshow();
				_this.getHdList();
				_this.getServiceType();
			},
			//获得技师
			getTechnician: function() {
				var postData = {
					"catalogSubSign": _this.classification
				}
				app.post(kdcommon.URL.restful, "/seller/getSellerArtificers", app.requestHeadersByToken(), postData, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.technician = data.data_list;
					}
					app.loginhide()
				})
			},
			//获得服务方式
			getServiceType: function() {
				app.post(kdcommon.URL.restful, "/service/getServiceWay", app.requestHeadersByToken(), {}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						var list = data.data;
						for(var i = 0; i < list.length; i++) {
							if(list[i] == 'STORE') {
								var data = {
									'text': '到店',
									'value': 'STORE'
								}
								_this.wayService.push(data);
							} else if(list[i] == 'DOOR') {
								var data = {
									'text': '上门',
									'value': 'DOOR'
								}
								_this.wayService.push(data);
							}
							app.loginhide()
						}
					}
				});
			},
			selectTech: function(e, sign) {
				_this.techniSign.push(sign);
			},
			//选择时间
			selectTime: function() {
				(function($) {
					$.init();
					var result = $('#result')[0];
					var btns = $('#z_create_time');
					var year = new Date().getFullYear();
					var month = new Date().getMonth() + 1;
					var day = new Date().getDate();
					var hours = new Date().getHours();
					var minutes = new Date().getMinutes();
					var data_options = '{"type":"","beginYear":' + year + ',"endYear":' + year + ',"beginMonth":' + month + ',"beginDay":' + day + ',"beginHours":' + hours + ',"beginMinutes":' + minutes + '}';
					btns.each(function(i, btn) {
						var optionsJson = data_options || '{}';
						var options = JSON.parse(optionsJson);
						var id = this.getAttribute('id');
						var picker = new $.DtPicker(options);
						picker.show(function(rs) {
							document.getElementById("z_create_time").value = rs.text;
							_this.time = rs.text
							picker.dispose();
						});
					});
				})(mui);
			},
			//触发上传
			fileBtn: function(e, value) {
				_this.divbox = e.currentTarget;
				_this.value = value;
			},
			//获得服务类型
			getHdList: function() {
				app.post(kdcommon.URL.restful, "/SysCatalogSub/getAllServiceType", null, {}, function(data, textStaus) {
					console.log(data)
					if(data.code == 0) {
						_this.HdList = data.data;
						var list = _this.HdList;
						for(var i = 0; i < list.length; i++) {
							var data = {
								'value': list[i].sign,
								'text': list[i].category_name
							}
							_this.servicePicker.push(data);
							app.loginhide()
						}
					}
				});
			},
			//服务类型选择
			HdListSelect: function() {
				if(_this.servicePicker.length == 0) {
					app.toast("正在获取服务列表...");
					return false
				}
				(function($, doc) {
					$.init();
					$.ready(function() {
						//服务
						var servicePicker = new $.PopPicker();
						servicePicker.setData(_this.servicePicker);
						var showUserPickerButton2 = doc.getElementById('z_service_type');
						var userResult = doc.getElementById('userResult');
						servicePicker.show(function(items) {
							var str = JSON.stringify(items[0].text).replace("\"", "").replace("\"", "");
							showUserPickerButton2.value = str;
							_this.classification = JSON.stringify(items[0].value).replace("\"", "").replace("\"", "");
							_this.technician = '';
							_this.getTechnician();
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					});
				})(mui, document);
			},
			//服务方式选择
			wayservice: function() {
				if(_this.wayService.length == 0) {
					app.toast("正在获取服务方式...");
					return false
				}
				(function($, doc) {
					$.init();
					$.ready(function() {
						//服务方式
						var servicePicker = new $.PopPicker();
						servicePicker.setData(_this.wayService);
						var showUserPickerButton2 = doc.getElementById('z_service_type');
						var userResult = doc.getElementById('userResult');
						servicePicker.show(function(items) {
							_this.servicetext = items[0].text;
							_this.serviceTyp = items[0].value;
							console.log()
							if(_this.serviceTyp == 'DOOR'){
								_this.door = true ;
							}
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					});
				})(mui, document);
			},
			//技师展开
			tecHnician: function(e) {
				if(_this.classification == null) {
					app.loginhide();
					app.toast("请先选择服务");
					return false
				} else if(_this.technician.length == 0) {
					app.loginhide();
					app.toast("当前服务暂无技师");
					return false
				}
				$(e.currentTarget).parents("div").siblings(".select-cont").show();
			},
			//图片上传
			imgFiles: function(event) {
				var files = event.target.files,
					file, value = true;
				if(files && files.length > 0) {
					// 获取目前上传的文件
					file = files[0];
					if(_this.value == 0) {
						_this.schematic = file;
					} else {
						var files = {
							"index": _this.value,
							"files": file
						}
						_this.banner.push(files)
					}
					// 获取 window 的 URL 工具
					var URL = window.URL || window.webkitURL;
					// 通过 file 生成目标 url
					var imgURL = URL.createObjectURL(file);
					//用attr将img的src属性改成获得的url
					$(_this.divbox).children("img").attr("src", imgURL);
					// 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
					// URL.revokeObjectURL(imgURL);
					event.target.value = '' //避免同名文件不能上传
				}
			},
			//提交审核
			submitBtn: function() {
				if(!_this.submitType) {
					return false;
				}
				if(_this.classification == '') {
					app.toast("服务类型不得为空");
					return false;
				}
				if(_this.time == '') {
					app.toast("截止时间不得为空");
					return false;
				}
				if(_this.title == '') {
					app.toast("标题不得为空");
					return false;
				}
				if(_this.door == false && _this.techniSign.length <= 0) {
					app.toast("请选择服务技师");
					return false;
				}
				if(_this.money == '') {
					app.toast("请输入服务金额");
					return false;
				}
				if(!Regs.posiNum.test(_this.money)) {
					app.toast("服务金额格式错误");
					return false;
				}
				if(_this.duration == '') {
					app.toast("请输入服务时长");
					return false;
				}
				if(!Regs.posiInt.test(_this.duration)) {
					app.toast("服务时长应为整数");
					return false;
				}
				if(_this.content == '') {
					app.toast("请输入服务介绍");
					return false;
				}
				if(_this.schematic == '') {
					app.toast("请上传展示图片");
					return false;
				}
				if(_this.banner.length <= 0) {
					app.toast("请上传展示图片");
					return false;
				}
				if(_this.serviceTyp == '' && _this.serviceTyp == null) {
					app.toast("请选择服务方式");
					return false;
				}
				var postForm = new FormData;
				app.loginshow();
				postForm.append("serviceTypeSign", _this.classification);
				postForm.append("serviceTitle", _this.title);
				postForm.append("artificerSign", _this.techniSign.toString());
				postForm.append("serviceTime", _this.duration);
				postForm.append("endDateStr", _this.time);
				postForm.append("serviceIntroduce", _this.content);
				postForm.append("servicePrice", _this.money);
				postForm.append("sketchFile", _this.schematic);
				console.log(_this.serviceTyp)
				postForm.append("serviceType", _this.serviceTyp);
				for(var i = 0; i < _this.banner.length; i++) {
					postForm.append("imageAdFile", _this.banner[i].files);
				};
				_this.submitType = false;
				app.postForm(kdcommon.URL.restful, "/service/createService", app.requestHeadersByToken(), postForm, function(data, textStaus) {
					console.log(data);
					if(data.code == 0) {
						var btnArray = ['返回服务', '继续创建'];
						mui.confirm('创建成功', '提示', btnArray, function(e) {
							if(e.index == 0) {
								window.location.href = 'service-list.html'
							} else {
								location.reload();
							};
						},'div');
					} else {
						app.toast(data.message);
					};
					app.loginhide();
					_this.submitType = true;
				});
			}
		},
		updated: function() {
			$("#z_technician").on("tap", function() {
				if(_this.technician == '') {
					app.toast("暂无技师可选");
					return false
				};
				$("#select_cont").removeClass("hide");
			});
		}
	});
	var _this = createService;
	_this.init();
	var headerVue = new Vue({
		el: "#headervue",
		methods: {
			submiting: function() {
				_this.submitBtn();
			}
		}
	});
}();