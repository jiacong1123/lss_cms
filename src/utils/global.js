
// http://adminapi.lesasa.wang   工单
// http://192.168.3.97:8080
// http://121.201.65.181    好乐美
// http://192.168.50.4/lss-admin 工单
// http://rw.kehuzhitongche.com/lss-admin 工单

//开发接口域名
//dev
 window.baseURL = process.env.NODE_ENV === "development" ? 'http://192.168.50.4/lss-admin' : 'http://rw.kehuzhitongche.com/lss-admin'

// production
// window.baseURL = process.env.NODE_ENV === "development" ? 'http://192.168.50.4/lss-admin' : 'http://adminapi.lesasa.wang'


//build
 // window.baseURL = process.env.NODE_ENV === "development" ? 'http://rw.kehuzhitongche.com/lss-admin' : 'http://192.168.50.4/lss-admin'


// dev
 window.baseURL_hx = process.env.NODE_ENV === "development" ? 'http://192.168.50.4' : 'http://192.168.50.4'

// production
// window.baseURL_hx = process.env.NODE_ENV === "development" ? 'http://192.168.50.4' : 'http://121.201.65.181'


//新增接口
window.newURL = process.env.NODE_ENV === "development" ? 'http://192.168.50.4' : 'http://rw.kehuzhitongche.com'

//图片接口域名
window.imagesUrl = 'http://images.lesasa.com/'
//七牛图片上传
window.actionUrl = 'https://upload-z2.qiniup.com/'

//关闭浏览器退出登录
window.addEventListener("beforeunload", function (event) {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    //鼠标相对于用户屏幕的水平位置 - 窗口左上角相对于屏幕左上角的水平位置 = 鼠标在当前窗口上的水平位置
    var n = window.event.screenX - window.screenLeft;
    //鼠标在当前窗口内时，n<m，b为false；鼠标在当前窗口外时，n>m，b为true。20这个值是指关闭按钮的宽度
    var b = n > document.documentElement.scrollWidth-20;
    //鼠标在客户区内时，window.event.clientY>0；鼠标在客户区外时，window.event.clientY<0
    if(b && window.event.clientY < 0 || window.event.altKey || window.event.ctrlKey){
    //关闭浏览器时你想做的事
    //  api.logout()
    }else if(event.clientY > document.body.clientHeight || event.altKey){
　　//刷新浏览器时你想做的事
    // alert("刷新");
    }
});
