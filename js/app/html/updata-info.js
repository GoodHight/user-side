! function() {
	var updatainfoVue = new Vue({
		el: "#updatainfovue",
		data: {
			hotline: "",
			name: "",
			introduce: "",
			seller: null,
			heardimg: null,
			imgarrays: [],
			imgheard: null,
			info: null,
			fileType: null
		},
		methods: {
			//获得回填信息
			getInfo: function() {
				app.loginshow();
				app.post(kdcommon.URL.restful, '/seller/getSellerDetail', app.requestHeadersByToken(), {}, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						_this.info = data.data;
						_this.seller = data.data.seller_ads;
						_this.heardimg = data.data.ad_head_url;
						_this.hotline = data.data.hotline;
						_this.name = data.data.name;
						_this.introduce = data.data.introduce;
						app.loginhide();
					}
				});
			},
			//触发上传
			triggersFile: function(e, sign, type) {
				_this.fileType = type;
				_this.imgMode = $(e.currentTarget).children("img");
				_this.divMode = $(e.currentTarget);
				$(e.currentTarget).parents(".info-img").siblings("#file1").click();
				_this.imgNum = sign;
			},
			//图片上传
			fileChange: function(event) {
				var files = event.target.files,
					file, value = true;
				if(files && files.length > 0) {
					// 获取目前上传的文件 
					file = files[0];
					_this.imgheard = file;
					// 获取 window 的 URL 工具
					var URL = window.URL || window.webkitURL;
					// 通过 file 生成目标 url
					var imgURL = URL.createObjectURL(file);
					//用attr将img的src属性改成获得的url
					if(_this.fileType) {
						_this.sumbitImg();
					} else {
						_this.sumbitImage();
					}

					// 使用下面这句可以在内存中释放对此 url 的伺服，跑了之后那个 URL 就无效了
					// URL.revokeObjectURL(imgURL);
					event.target.value = '' //避免同名文件不能上传
				}
			},
			//图册
			sumbitImage: function() {
				var postform = new FormData();
				postform.append("adFile", _this.imgheard);
				postform.append("sign", _this.imgNum);
				app.loginshow();
				app.postForm(kdcommon.URL.restful, '/seller/uploadAdFile', app.requestHeadersByToken(), postform, function(data, textStatus) {
					if(data.code == 0) {
						console.log(data);
						$(_this.imgMode).attr("src", data.data.img_url);
						app.loginhide();
					}
				});
			},
			//示意图
			sumbitImg: function() {
				var postform = new FormData();
				postform.append("sketchFile", _this.imgheard);
				postform.append("sign", _this.imgNum);
				app.loginshow();
				app.postForm(kdcommon.URL.restful, '/seller/uploadSketchFile', app.requestHeadersByToken(), postform, function(data, textStatus) {
					if(data.code == 0) {
						console.log(data);
						$(_this.imgMode).attr("src", data.data.img_url);
						new app.storage().set("SELLER_USER_HEADER", data.data.img_url);
						app.loginhide();
					}
				});
			},
			submiBtnClick: function() {
				if(_this.name == null || _this.name == '') {
					app.toast("名称不能为空");
					return false;
				}
				if(_this.hotline == null || _this.hotline == '') {
					app.toast("联系电话不能为空");
					return false;
				} else {
					if(!Regs.mobile.test(_this.hotline)) {
						app.toast("手机号码有误");
						return false;
					}
				}
				if(_this.introduce == null || _this.introduce == '') {
					app.toast("介绍不能为空");
					return false;
				}
				app.loginshow();
				var postform = new FormData;
				//店铺信息
				postform.append("name", _this.name);
				postform.append("hotline", _this.hotline);
				postform.append("introduce", _this.introduce);
				app.postForm(kdcommon.URL.restful, '/seller/updateSellerDetail', app.requestHeadersByToken(), postform, function(data, textStatus) {
					console.log(data)
					if(data.code == 0) {
						app.toast("修改成功");
						new app.storage().set("SELLER_USER_NAME", data.data.name);
						window.location.href = 'personal-center.html';
						app.loginhide();
					}
				});

			}
		}
	});
	var _this = updatainfoVue;
	_this.getInfo();
}();