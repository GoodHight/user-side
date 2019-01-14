!function(){
	var detailsVue = new Vue({
		el:"#detailsvue",
		data:{
			sign:kdcommon.getQueryString("sign")
		},
		methods:{
			init:function(){
				var postData = {
					"serviceSign":_this.sign
				}
				app.post(kdcommon.URL.restful, "/service/getServiceDetail", null, postData,function(data, textStaus){
					console.log(data);
				});
			}
		}
	}); 
	var  _this = detailsVue 
	_this.init();
}();
