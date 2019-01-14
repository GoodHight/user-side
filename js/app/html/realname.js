! function() {
	var realnameVue = new Vue({
		el: "#realnamevue",
		data: {
			hotline: "",
			name: "",
			introduce: "",
			serviceArea: '',
			serviceAddress: "",
			imgUrl: null,
			imgCheckUrl: null,
			imgMode: null,
			divMode: null,
			imgNum: null,
			lagLat: null,
			city: null,
			serviceList: [],
			imgarray: [],
			imgarrays: [],
			sersign: null,
			showSer: false,
			longitude: null,
			latitude: null,
			files: null,
			code: null,
			showservice: '',
			province: null, //省
			citys: null, //市
			area: null, //区
			scope: null, //范围
			selectCode: null,
			p: null,
			c: null,
			a: null,
			s: null,
			submitType:true
		},
		methods: {
			init: function() {
				_this.getBackstage();
				_this.getArea();
				_this.getServiceArea();
				_this.code = kdcommon.getQueryString("code");
			},
			//获取服务范围
			getServiceArea: function() {
				app.post(kdcommon.URL.restful, '/SysCatalogSub/getAllSysCatalogSub', null, {}, function(data, textStatus) {
					console.log(data);
					if(data.code == 0) {
						app.loginhide();
						var service = data.data;
						for(var i = 0; i < service.length; i++) {
							var data = {
								"value": service[i].sign,
								"text": service[i].category_name
							}
							_this.serviceList.push(data);
						}
					} else {
						app.loginhide();
					}
				});
			},

			//获得服务器地址
			getBackstage: function() {
				console.log(cities)
				_this.province = cities;
				_this.p = cities[0].name
				_this.citys = cities[0].children;
				_this.c = cities[0].children[0].name
				_this.area = cities[0].children[0].children;
				_this.a = cities[0].children[0].children[0].name;
				_this.scope = cities[0].children[0].children[0].children;
				var code = cities[0].children[0].children[0].children;
				if(code.length != 0) {
					_this.s = cities[0].children[0].children[0].children[0].name;
					_this.selectCode = cities[0].children[0].children[0].children[0].code;
					console.log(_this.selectCode)
				};
			},

			//选择地址
			selectArea: function(e, value, name) {
				var selects = $(e.currentTarget);
				var index = $(e.currentTarget).attr("selectedIndex");
				var text = selects[0][index].innerText;
				var code = $(e.currentTarget).val();
				if(value == 01) {
					for(var i = 0; i < cities.length; i++) {
						if(cities[i].code == code) {
							_this.p = cities[i].name
							_this.citys = cities[i].children;
							_this.area = cities[i].children[0].children;
							_this.scope = cities[i].children[0].children[0].children;
						}
					};
				} else if(value == 02) {
					for(var i = 0; i < cities.length; i++) {
						var children = cities[i].children
						for(var j = 0; j < children.length; j++) {
							if(children[j].code == code) {
								_this.c = children[j].name
								_this.a = children[j].children[0].name;
								_this.s = children[j].children[0].children[0].name;
								_this.area = children[j].children;
								_this.scope = children[j].children[0].children;
								if(children[j].children[0].children.length != 0) {
									_this.selectCode = children[j].children[0].children[0].code;
								} else {
									console.log("范围不存在")
									_this.selectCode = null
								}
								console.log(_this.selectCode)
							}
						}
					};
				} else if(value == 03) {
					for(var i = 0; i < cities.length; i++) {
						var children = cities[i].children;
						for(var j = 0; j < children.length; j++) {
							var childrens = children[j].children;
							for(var k = 0; k < childrens.length; k++) {
								if(childrens[k].code == code) {
									_this.a = childrens[k].name;
									_this.s = childrens[k].children[0].name;
									console.log(childrens[k]);
									_this.scope = childrens[k].children;
									if(childrens[k].children.length != 0) {
										_this.selectCode = childrens[k].children[0].code;
									} else {
										console.log("范围不存在")
										_this.selectCode = null
									}
									console.log(_this.selectCode)
								}
							}
						}
					};
				} else {
					console.log(code)
					_this.selectCode = code;
					_this.s = text;
					$(e.currentTarget).parents(".selectarea_box").hide()
					_this.showservice = _this.p + _this.c + _this.a + _this.s
				}
			},
			//选择服务
			selectService: function() {
				if(_this.serviceList == [] || _this.serviceList.length == 0) {
					app.toast("服务范围正在加载");
					return false;
				};
				(function($, doc) {
					$.init();
					$.ready(function() {
						//普通示例
						var userPicker = new $.PopPicker();
						userPicker.setData(_this.serviceList);
						userPicker.show(function(items) {
							//获得服务文本
							var areatext = JSON.stringify(items[0].text);
							var areasign = JSON.stringify(items[0].value)
							_this.serviceArea = areatext.substring(1, areatext.length - 1);
							_this.sersign = areasign.substring(1, areasign.length - 1);
							console.log(_this.serviceArea);
							console.log(_this.sersign);
							//返回 false 可以阻止选择框的关闭
							//return false;
						});

					});
				})(mui, document);
			},
			//获取地址
			getArea: function() {
				var geoc = new BMap.Geocoder();
				var city;
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					if(this.getStatus() == BMAP_STATUS_SUCCESS) {
						var mk = new BMap.Marker(r.point);
						geoc.getLocation(r.point, function(rs) {
							var addComp = rs.addressComponents;
							_this.city = addComp.city;
						});
					} else {
						alert(this.getStatus());
					}
				});
			},
			//解析地址
			parsingAddress: function() {
				var myGeo = new BMap.Geocoder();
				if(_this.showservice == '') {
					app.toast("请选择服务地址");
					return false;
				}
				myGeo.getPoint(_this.showservice + _this.serviceAddress, function(point) {
					if(point) {
						_this.lagLat = point;
						_this.longitude = _this.lagLat.lng;
						_this.latitude = _this.lagLat.lat;
						_this.submiBtnClick()
					} else {
						app.toast("您的填写的地址无法解析!");
					}
				}, _this.city);
			},
			//触发上传
			triggersFile: function(e, value) {
				_this.imgMode = $(e.currentTarget).children("img");
				_this.divMode = $(e.currentTarget);
				_this.imgNum = value;
				var inputs = $(e.currentTarget).parents(".mui-content").children("input");
				$(inputs).click();
			},
			requestHeadersByToken: function() {
				if(_this.code && _this.code == 0) {
					var storage = new app.storage().get(app.ACCESS_TOKEN);
					if(!storage) {
						app.toast('token丢失,请重新注册')
						return
					}
					return {
						"X-Auth-Token": new app.storage().get(app.ACCESS_TOKEN)
					}
				} else {
					var storage = new app.storage('session').get('RSD_TOKEN');
					if(!storage) {
						app.toast('token丢失,请重新注册')
						return
					}
					return {
						"X-Auth-Token": new app.storage('session').get('RSD_TOKEN')
					}
				}
			},
			//图片上传
			fileChange: function(event) {
				var files = event.target.files,
					file, value = true;
				if(files && files.length > 0) {
					// 获取目前上传的文件
					file = files[0];
					if(_this.imgNum < 3) {
						for(var i = 0, len = _this.imgarrays.length; i < len; i++) {
							if(_this.imgarrays[i].index == _this.imgNum) {
								_this.imgarrays[i].files = file;
								value = false;
							}
						}
						if(value) {
							var imgfils = {
								"index": _this.imgNum,
								"files": file
							}
							_this.imgarrays.push(imgfils);
						}
					} else {
						for(var i = 0, len = _this.imgarray.length; i < len; i++) {
							if(_this.imgarray[i].index == _this.imgNum) {
								_this.imgarray[i].files = file;
								value = false;
							}
						}
						if(value) {
							var imgfils = {
								"index": _this.imgNum,
								"files": file
							}
							_this.imgarray.push(imgfils);
						}
					}
					_this.files = file;
					// 获取 window 的 URL 工具
					var URL = window.URL || window.webkitURL;
					// 通过 file 生成目标 url
					var imgURL = URL.createObjectURL(file);
					//用attr将img的src属性改成获得的url
					$(_this.imgMode).attr("src", imgURL);
					$(_this.divMode).siblings("div").removeClass("hide");
					// 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
					// URL.revokeObjectURL(imgURL);
					event.target.value = '' //避免同名文件不能上传
				}
			},
			//图片删除
			imgDelete: function(e, value) {
				var thistr = $(e.currentTarget);
				//判断图片类型
				if(value < 3) { //执照
					for(var i = 0, len = _this.imgarrays.length; i < len; i++) {
						if(_this.imgarrays[i].index == value) {
							_this.imgarrays.splice(i, 1);
						}
					}
				} else { //宣传
					for(var i = 0, len = _this.imgarray.length; i < len; i++) {
						if(_this.imgarray[i].index == value) {
							_this.imgarray.splice(i, 1);
						}
					}
				}
				setTimeout(function() {
					$(thistr).addClass("hide");
					$(thistr).siblings("div").children("img").attr("src", "img/important/add1.png");
				}, 100);
			},
			submiBtnClick: function() {
				if(!_this.submitType){
					return false;
				};
				if(_this.name == null || _this.name == '') {
					app.toast("名称不能为空");
					return false;
				};
				if(_this.hotline == null || _this.hotline == '') {
					app.toast("联系电话不能为空");
					return false;
				};
				if(!Regs.teleMobile.test(_this.hotline)) {
					app.toast("号码有误");
					return false;
				};
				if(_this.introduce == null || _this.introduce == '') {
					app.toast("介绍不能为空");
					return false;
				};
				if(_this.serviceAddress == null || _this.serviceAddress == '') {
					app.toast("服务地址不能为空");
					return false;
				};
				if(_this.imgarrays.length <= 0) {
					app.toast("请上传营业执照");
					return false;
				};
				if(_this.sersign == null || _this.serviceArea == '') {
					app.toast("服务范围不能为空");
					return false;
				};
				if(_this.imgarray.length <= 0) {
					app.toast("请上传门店图片");
					return false;
				};
				console.log(_this.selectCode)
				if(_this.selectCode == null) {
					app.toast("请上选择服务地址");
					return false;
				};
				app.loginshow();
				var postform = new FormData;
				//店铺信息
				postform.append("name", _this.name);
				postform.append("hotline", _this.hotline);
				postform.append("introduce", _this.introduce);
				postform.append("serviceAddress", _this.serviceAddress);
				postform.append("catalogSubSign", _this.sersign);
				postform.append("longitude", _this.longitude);
				postform.append("latitude", _this.latitude);
				postform.append("addrCode", _this.selectCode);
				//营业执照图
				for(var i = 0, len = _this.imgarrays.length; i < len; i++) {
					postform.append("imageCheckFile", _this.imgarrays[i].files);
				};
				//室内场景图
				for(var i = 0, len = _this.imgarray.length; i < len; i++) {
					postform.append("imageAdFile", _this.imgarray[i].files);
				};
				_this.submitType = false;
				app.postForm(kdcommon.URL.restful, '/seller/updateAuth', _this.requestHeadersByToken(), postform, function(data, textStatus) {
					if(data.code == 0) {
						app.toast("提交成功跳转中..");
						app.loginhide();
						//保存用户信息
						new app.storage().set("SELLER_USER_NICK", data.data.nickname);
						new app.storage().set(app.ACCESS_TOKEN, data.token);
						new app.storage().set("SELLER_USER_SIGN", data.data.sign);
						new app.storage().set("SELLER_USER_NAME",data.data.name);
						setTimeout(function() {
							window.location.href = 'index.html';
						}, 1500);
					} else if(data.code == 30014) {
						app.toast("请填写完整的认证图");
						app.loginhide();
					} else {
						app.toast(data.message);
					}
					_this.submitType = true;
					app.loginhide();
				});
			}
		},
		updated: function() {
			$(".selectarea-btn").on("click", function() {
				$(".selectarea_box").hide();
				_this.showservice = _this.p + _this.c + _this.a + _this.s;
			});
			$(".showService").on("click", function() {
				$(".selectarea_box").show();
			});
			$(".selectarea").on("click", function() {
				event.stopPropagation();
			});
			$(".selectarea_box").on("click", function() {
				$(this).hide();
				_this.showservice = _this.p + _this.c + _this.a + _this.s;
			});
		}
	});
	var _this = realnameVue
	_this.init();
}();