import request from 'utils/request';

export const getOrderList = (data) => {
  return request({
    url: '/workorder/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "status": data.status,
      "name": data.name,
      "phone": data.phone,
      "level": data.level,
      "clinicid": data.clinicid,
      // "sourceid": data.sourceid
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
    url: '/workorder/batchassign',
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
  console.log(data)
  return request({
    url: '/workorder/lable/edit',
    method: 'POST',
    data:{
      "userid": data.userid,
      "lablenames": data.labels
    }
  })
}
