import request from 'utils/request';

//共享给我的
export const getOrderList = (data) => {
  return request({
    url: '/workorder/offerToMe',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "name": data.name,
      "phone": data.phone,
      "adminid": data.adminid,
      "status": data.status,
      "level": data.level,
      "clinicid": data.clinicid,
      "sourcedateStartStr": data.sourcedateStart,
      "sourcedateEndStr": data.sourcedateEnd,
      "followupTimeStart": data.followupTimeStart,
      "followupTimeEnd": data.followupTimeEnd,
      "allottimeStart": data.allottimeStart,
      "allottimeEnd": data.allottimeEnd,
      "level": data.level,
       "tag": data.searchTag,
      // "sourceid": data.sourceid
    }
  })
}

//我共享出去的
export const sharingOut = (data) => {
  return request({
    url: '/workorder/offerByMe',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "name": data.name,
      "phone": data.phone,
      "adminid": data.adminid,
    }
  })
}

//取消共享
export const cancleSharing = (data) => {
  return request({
    url: '/workorder/cancleOffer',
    method: 'POST',
    data:{
      "orderNo": data.orderno,   //单个取消共享
      "ordernos": data.ordernos,  //批量取消共享
    }
  })
}

export const getSourceChild = (data) => {
  return request({
    url: '/admin/tags',
    method: 'POST',
    data: {
      "type": 2,
      "parentid": data.tagid
    }
  });
}
export const saveOrder = (data) => {
  console.log(data)
  return request({
    url: '/workorder/save',
    method: 'POST',
    data:{
      "user":{// 用户信息
        "phone": data.phone,// 电话
        "name":data.name,// 姓名
        "sex":data.sex,// 性别 1男 2女
        "age":data.age,// 年龄
        "wechat":data.wechat,// 微信昵称
        "province":data.province, // 省
        "city":data.city,// 市
        "sourceid":data.sourceid,// 工单来源id
        "sourcedate":data.sourcedate,// 来源日期
        "userid":data.userid, // 用户id 添加时无
        "sourceid2": data.sourceid2,
        "sourcename2": data.tagname,
        "lablenames": data.lablenames //标签
      },
      "order":{
        "clinicid":data.clinicid,// 诊所id
        "projectid":data.projectid,// 预约项目id
        "adminid":data.adminid,// 跟进人员id
        "complaint":data.complaint,// 主诉
        "worknotes":data.worknotes,// 工单备注
        "level":data.level,//意愿等级
        "returndate":data.returndate,// 计划回访时间
        "orderno":data.orderno // 订单号 添加时无
      }
    }
  })
}

export const getOrderDetail = (data) => {
  return request({
    url: '/workorder/details',
    method: 'POST',
    data:{
      "orderno": data.orderno
    }
  })
}

export const getBatchOrder = (data) => {
  return request({
    url: '/workorder/batchTransfer',
    method: 'POST',
    data:{
      "adminid": data.adminid,
      "ordernos": data.ordernos // 分配工单号
    }
  })
}

export const judgeUserIsExist= (data) => {
  return request({
    url: '/workorder/userinfo',
    method: 'POST',
    data:{
      "phone": data.phone
    }
  })
}

export const changeLabels= (data) => {
  return request({
    url: '/workorder/lable/edit',
    method: 'POST',
    data:{
      "userid": data.userid,
      "lablenames": data.labels
    }
  })
}

export const activationDetail = (data) => {
  return request({
    url: '/workorder/activation',
    method: 'POST',
    data:{
      "orderno": data.orderno
    }
  })
}

export const chargeSave = (data) => {
  return request({
    url: '/workorder/pay/save',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "receivablesamt": data.receivablesamt,
      "amount": data.amount,
      "debtamt": data.debtamt,
      "payTime": data.payTime,
      "remark": data.remark
    }
  })
}

export const closeOrder = (data)=> {
  return request({
    url: '/workorder/close',
    method: 'POST',
    data:{
      "orderno": data.ordernos,
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