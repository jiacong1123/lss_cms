import request from 'utils/request';
import store from 'store'
import md5 from 'js-md5'

//通话记录列表
export const getCallRecordList = (data) => {
  return request({
    url: '/phone/callRecord/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "adminName": data.adminName,
      "userName": data.userName,
      "startDate": data.startDate,
      "endDate": data.endDate,
      "cusNo": data.cusNo
    }
  })
}


//短信记录列表
export const getSMSList = (data) => {
  return request({
    url: '/phone/smsRecord/list',
    method: 'POST',
    data:{
      // empNo: data.empNo,
      page: data.page,
      limit: data.limit,
      // "adminName": '', //员工名称
      // "userName": '', //客户名称
      // "llResult": '', //状态
      // "type": '',  //类型
    }
  })
}

//微信聊天记录列表
export const getWeChatList = (data) => {
  return request({
    baseURL: window.newURL,
    url: '/api/im/chat/lastGmHistoryChat.do',
    method: 'POST',
    withCredentials: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data:{
      merchantNo: data.merchantNo,
      start: data.page,
      limit: data.limit,
      // "memberNameGm": '', //员工名称
      // "memberName": '', //客户名称
      // "mobile": '', //手机号
      // "chatTimeBegin": '',
      // "chatTimeEnd": ''
    }
  })
}
