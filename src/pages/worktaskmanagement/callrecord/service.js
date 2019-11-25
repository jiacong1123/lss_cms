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
  console.log(data);
  return request({
    // url: '/phone/smsRecord/list',
    url: '/sendMessage/messageList',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "adminId": data.adminid, //员工名称
      "phone": data.phone,
      "userName": data.userName, //客户名称
      "status": data.status, //状态
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

//批量发送短信
export const sendMessage = (data)=> {
  console.log(data);
  return request({
    url: '/sendMessage/sendMessage ',
    method: 'POST',
    data:{
      "templateId": data.templateId,
      "phone": data.phone.join(','),
      "content": data.messageContent,
      "one": data.one,
      "two": data.two,
      "three": data.three,
      "four": data.four,
      "five": data.five
    }
  })
}
