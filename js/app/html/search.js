! function() {
	var searchVue = new Vue({
		el: "#searchvue",
		data: {
			searchList: null
		},
		methods: {
			init: function() {
				var list = new app.storage().get("searchList");
				if(list) {
					_this.searchList = list;
				} else {
					_this.searchList = [];
				}
			}
		},
		updated: function() {
			this.$nextTick(function() {
				$("form").submit(function() {
					_thing.searchBtn();
				});
			})
		}

	});
	var _this = searchVue
	_this.init();
	var searchHeader = new Vue({
		el: "#headervue",
		data: {
			searchConent: ""
		},
		methods: {
			searchBtn: function() {
				var text = _thing.searchConent;
				if(text == ''){
					app.toast("请输入要搜索的内容");
					return false;
				}
				var arrays = new app.storage().get("searchList");
				if(arrays) { //判断是否有搜索历史
					if(arrays.length == 6) { //当搜索历史有六条的时候
						arrays.splice(5, 1); //删除最后一个
						arrays.unshift(text); //把新的添加到第一位
					} else {
						arrays.unshift(text); //把新的添加到第一位
					}
				} else {
					arrays = [];
					arrays.unshift(text); //把新的添加到第一位
				}
				new app.storage().set("searchList",arrays);
				_this.init();
			}
		}
	});
	var _thing = searchHeader;
}();