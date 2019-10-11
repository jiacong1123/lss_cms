import request from 'utils/request';

export const returnList = (data) => {
  return request({
    url: '/workorder/returnList',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "level": data.level,
      "isReturn": data.isReturn
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
        "userid":data.userid // 用户id 添加时无
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


// // 创建线索
// export const saveClue= (data) => {
//   return request({
//     url: '/clue/create',
//     method: 'POST',
//     data:{
//       "orderno": data.orderno,
//       "province": data.province,
//       "city": data.city,
//       "area": data.area,
//       "usertype": data.usertype,
//       "usertypename":data.usertypename,
//       "reservedate":data.reservedate,
//       "reservetime":data.reservetime,
//       "worknotes":data.worknotes
//     }
//   })
// }

// // 派单服务列表
// export const clinicServices= (data) => {
//   return request({
//     baseURL: 'http://192.168.3.188:8180',
//     url: '/api-os/hx/clinicServices.do',
//     method: 'POST',
//     data:{
//       "start": data.start,
//       "limit": data.limit,
//       "userType": data.userType,
//       "clinicName": data.clinicName,
//     },
//     withCredentials: false
//   })
// }

// // 派单
// export const dispatchClue= (data) => {
//   return request({
//     url: '/clue/dispatch',
//     method: 'POST',
//     data:{
//       "orderno": data.orderno,
//       "code":  data.code,
//       "isShop":  data.isShop,
//       "clinicName":  data.clinicName
//     }
//   })
// }
