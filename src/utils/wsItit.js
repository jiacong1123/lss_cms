
// 创建websocket链接
function wsInit(val)  {
    //重连先关闭
	if(val=='reConn'){
		window.ws.close();
	
	}
	if("WebSocket" in window) {
        // 打开一个 web socket，全局共用一个
        window.ws = new WebSocket('ws://127.0.0.1:8800/');
        //console.log("已连接"+serverInfo);

        window.ws.onopen = function() {
            setTimeout(function(){
                window.ws.send('{"cmd":"LINK"}')
                window.ws.send('{"cmd":"USB","connected":"true","success":"true","message":"成功"}')
            },1000);
        }

        window.ws.onmessage = function(evt,callback) {
            var data = JSON.parse(evt.data);
            switch(data['cmd']) {
                // 服务端ping客户端
                case 'USB':
                    window.ws.send('{"cmd":"USB","connected":"true","success":"true","message":"成功"}');
                    break;
                case 'CORG':
                    window.ws.send('{"cmd":"CORG","number":"10010","success":"true","message":"成功"}');
                    break;
                case 'CALLING':
                    window.ws.send('{"cmd":"CALLING","number":"10010","success":"true","message":"成功"}');
                    break;
                case 'CBEGIN':
                    window.ws.send('{"cmd":"CBEGIN","success":"true","message":"成功"}');
                    break;
                case 'ALERT':
                    window.ws.send('{"cmd":"ALERT","success":"true","message":"成功"}');
                    break;
                case 'CEND':
                    window.ws.send('{"cmd":"CEND","success":"true","message":"成功"}');
                    break;
            }
        };

        //出现错误
        window.ws.onerror = function(evt){
            //console.log(evt);
        }
        //连接断开
        window.ws.onclose = function(evt){
            //console.log(evt)
            wsInit('reConn')
        }

	} else {
		// 浏览器不支持 WebSocket
		alert("您的浏览器不支持 WebSocket!");
    }

}

wsInit()
