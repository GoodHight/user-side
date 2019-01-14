mui.plusReady(function() {
	
	function getPushInfo(){
		var info = plus.push.getClientInfo();
		return info;
	}
	
});

!function() {
	var push = {};
	
	push.type = {
		'NEW_ORDER': 'NEW_ORDER'
	};
	
	push.msg = null;
	
	push.plusIsReady = false;
	
	push.checkPlusEnv = function(callback) {
		mui.plusReady(function() {
			push.plusIsReady = true;
			callback();
		});
	}
	
	push.getPushInfo = function(callback) {
		push.checkPlusEnv(function() {
			var info = plus.push.getClientInfo();
			callback(info);
		});
	}
	
	push.monitor = function() {
		document.addEventListener( "plusready", function(){
			// 监听点击消息事件
			plus.push.addEventListener( "click", function( msg ) {
				console.log("----->>" + JSON.stringify(msg));
				var info = JSON.parse(push.msg.payload);				
				if(info.type == push.type.NEW_ORDER) {
					var url = location.href;
					console.log('url=' + url);
					var waitOpenFile = null;
					if(url.indexOf('index.html') != -1) {
						waitOpenFile = 'html/service-order/all-order.html';
					} else if(url.indexOf('service-order') != -1) {
						waitOpenFile = 'all-order.html';
					} else {
						waitOpenFile = '../service-order/all-order.html';
					}
					console.log('waitOpenFile=' + waitOpenFile);
					if(waitOpenFile != null) {
						/*var detailPage = plus.webview.getWebviewById('main');
						mui.fire(detailPage,'newsId',{
				    			id:2
				  		});										
						var dqid = plus.webview.currentWebview().id;
						if(dqid != 'home.html' && dqid != 'approvalProcess.html' && dqid != 'message.html' && dqid != 'main.html'){
							plus.webview.currentWebview().close()
						}
						plus.webview.currentWebview().hide()
				
						plus.webview.show(waitOpenFile,"fade-in",300);*/
						setTimeout(function() {
							mui.openWindow({
								id: 'all-order?t=' + new Date(),
								url: waitOpenFile
							});
						}, 500);
					}
				}
				//var info = JSON.parse(msg.payload);
				// 判断是从本地创建还是离线推送的消息
//				switch( msg.payload ) {
//					case "LocalMSG":
//						console.log( "点击本地创建消息启动：" );
//					break;
//					default:
//						console.log( "点击离线推送消息启动：");
//					break;
//				}
				// 提示点击的内容
				// plus.nativeUI.alert( msg.content );
				/*if(payload.type == push.type.NEW_ORDER) {
					var url = location.href;
					if(url.indexOf('index.html') != -1) {
						window.location.href = 'service-order/all-order.html';
					} else if(url.indexOf('service-order') != -1) {
						window.location.href = 'all-order.html';
					} else {
						window.location.href = '../service-order/all-order.html';
					}
				}*/
				
			}, false );
			// 监听在线消息事件
			plus.push.addEventListener( "receive", function( msg ) {
				if ( msg.aps ) {  // Apple APNS message
					console.log( "接收到在线APNS消息：" );
				} else {
					console.log( "接收到在线透传消息：" );
				}
				push.msg = msg;
				push.createLocalPushMsg(msg);
			}, false );
		}, false );
	}
	
	push.createLocalPushMsg = function(msg){
		var options = {cover:false};
		console.log(JSON.stringify(msg));
		console.log(msg.payload);
		var payload = JSON.parse(msg.payload);
		plus.push.createMessage( payload.title, msg, options );
		console.log( "推送到达后-->>创建本地消息成功！" );
		console.log("请到系统消息中心查看！" );
		if(plus.os.name=="iOS"){
			plus.nativeUI.alert('无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
		}
	}
	
	window.push = push;
}();

push.monitor();