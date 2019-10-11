import moment from 'moment'
import store from 'store'

// 简化action
export const _mmAction = (type,payload)=> {
  return {
    type,
    payload
  }
}

// 处理Breadcrumbs需要的数据
export const _mmMenulistToBreadcrumbs = (data) => {
  if (data) data.forEach(item=>{
       item['path'] = item['url']
       item['breadcrumb'] = item['name']
       if (item['list'] && item['list'].length > 0) {
        item['routes'] = _mmMenulistToBreadcrumbs(item['list'])
       }
  })
  return data
}

// 时间戳转时间
export const _mmStampToTime = (data, keys, formate) => {
  if ( data && data.length > 0 ) {
    data.forEach(item=>{
       keys.forEach(key=>{
         if(item[key]){
          item[key] = moment(item[key]).format(formate)
         }
       })
    })
  } else {
    keys.forEach(key=>{
      if(data[key]){
        data[key] = moment(data[key]).format(formate)
      }
    })
  }
  return data
}

/* 时间戳转换相应格式 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}


// 时间转时间戳
export const _mmTimeToStamp = (data, keys, formate) => {
  if ( data && data.length > 0 ) {
    data.forEach(item=>{
       keys.forEach(key=>{
         if(item[key]){
          item[key] = moment(item[key],formate).valueOf()
         }
       })
    })
  } else {
    keys.forEach(key=>{
      if(data[key]){
        data[key] = moment(data[key],formate).valueOf()
      }
    })
  }
  return data
}

//秒数转换为时分秒
export function formatSeconds(value) {
    var theTime = parseInt(value);// 秒
    var middle= 0;// 分
    var hour= 0;// 小时

    if(theTime > 60) {
        middle= parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(middle> 60) {
            hour= parseInt(middle/60);
            middle= parseInt(middle%60);
        }
    }
    var result = ""+parseInt(theTime)+"秒";
    if(middle > 0) {
        result = ""+parseInt(middle)+"分"+result;
    }
    if(hour> 0) {
        result = ""+parseInt(hour)+"小时"+result;
    }
    return result;
}

	// 天时分秒换算
export function hourMinSec(time_distance){

		var int_day = Math.floor(time_distance/86400)
		time_distance = time_distance - int_day * 86400;

		var int_hour = Math.floor(time_distance/3600)
		time_distance = time_distance - int_hour * 3600;

		var int_minute = Math.floor(time_distance/60)
		time_distance = time_distance - int_minute * 60;

		var int_second = Math.floor(time_distance)

		// 天时分秒为单数时、前面加零
    if(int_day < 10){
			int_day = "0" + int_day;
		}
		if(int_hour < 10){
			int_hour = "0" + int_hour;
		}
		if(int_minute < 10){
			int_minute = "0" + int_minute;
		}
		if(int_second < 10){
			int_second = "0" + int_second;
		}
		return int_hour+':'+int_minute+':'+int_second
}
//转换秒为00:00:00
export function secondToDate (result) {
  var h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
  var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
  var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
  return result = h + ":" + m + ":" + s;
}

// 地址处理
export const _mmAddressSplit = (data,keys) => {
  if(data && data['addressKey'])
  keys.forEach((key,index)=>{
    data[key] = data['addressKey'][index]
  })
  return data
}
export const _mmAddressConcat = (data,keys) => {
  const arr = []
  keys.forEach((key)=>{
    if (data[key]){
      arr.push(data[key])
    }
  })
  data['addressKey'] = arr
  return data
}


// 处理树形控件数据
export const _mmHandleTreeData = (data,title,key,children) => {
  data.forEach(item=>{
     item['title'] = item[title]
     item['key'] = item[key]
     if (item[children]) {
      item['children'] = _mmHandleTreeData(item[children],title,key,children)
     }
   })
   return data
}

// 处理上传图片列表
export const _mmHandleUploadImage = (fileList) => {
  const arr = []
  fileList.forEach(item=>{
     if( item.response){
      arr.push({
        image: window.imagesUrl + item.response.key
      })
     }
     if(item.image){
      arr.push({
        image: item.image
      })
     }

     if(item.url){
      arr.push({
        image: item.url
      })
     }
  })
  return arr
}
export const _mmHandleUploadImageA = (fileList) => {
  let str = ''
  fileList.forEach((item,index)=>{
     if( item.response){
       if(index < fileList.length-1 ){
        str += window.imagesUrl + item.response.key + ','
       }else{
        str += window.imagesUrl + item.response.key
       }
     }
     if(item.url){
      if(index < fileList.length-1 ){
        str += item.url +','
       }else{
        str += item.url
       }
     }
     if ( !item.response &&  !item.url) {
      if(index < fileList.length-1 ){
        str += item +','
       }else{
        str += item
       }
     }
  })
  return str
}



export const audioTime = (e) => {

  let secondTime = parseInt(e);// 秒
  let minuteTime = 0;// 分
  let hourTime = 0;// 小时
  if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if(minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
      }
  }

  secondTime =  parseInt(secondTime)
  if(secondTime > 0) {
     if(secondTime < 10 ) {
       secondTime = '0' + secondTime
     }
  }

  if(minuteTime > 0) {
     if( minuteTime < 10 ) {
       minuteTime = '0' + minuteTime
     }
  }
  if(hourTime > 0) {
      if( hourTime < 10 ) {
          hourTime = '0' + hourTime
      }
  } else {
      hourTime = '00'
  }

  return `${hourTime}:${minuteTime}:${secondTime}`

}




// 拨打电话
// hidden：1 隐藏号码，0 显示号码
// callid:设置 2.23 后有效，通话记录 id，未指定使用 uuid。
export const wsMakeCall = (number,sendhaoma,callid=2.23) => {
  let val = '{"cmd":"ATD","number":"'+number+'","hidden":"'+0+'","callid":"'+callid+'"}';
  window.ws.send(val);
}

// 挂断
export const wsMakeCallAth = (number,sendhaoma,callid='') => {
  let val = '{"cmd":"ATH"}';
  window.ws.send(val);
}

// 接听
export const wsMakeCallATA = (number,sendhaoma,callid='') => {
  let val = '{"cmd":"ATA"}';
  window.ws.send(val);
}
