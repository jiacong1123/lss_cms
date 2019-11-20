import request from 'utils/request';

export const getOrderDetail = (data) => {
  return request({
    url: '/workorder/details',
    method: 'POST',
    data:{
      orderno:data.orderno
    }
  })
}



// 创建线索
export const saveClue= (data) => {
  return request({
    url: '/clue/create',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "province": data.province,
      "city": data.city,
      "area": data.area,
      "usertype": data.usertype,
      "usertypename":data.usertypename,
      "reservedate":data.reservedate,
      "reservetime":data.reservetime,
      "worknotes":data.worknotes
    }
  })
}

// 派单服务列表
export const clinicServices= (data) => {
  return request({
    baseURL: window.baseURL_hx,
    url: '/api-os/hx/clinicServices.do',
    method: 'POST',
    data:{
      "start": data.start,
      "limit": data.limit,
      "userType": data.userType,
      "clinicName": data.clinicName,
    },
    withCredentials: false
  })
}

// 派单
export const dispatchClue= (data) => {
  return request({
    url: '/clue/dispatch',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "code":  data.code,
      "isShop":  data.isShop,
      "clinicName":  data.clinicName
    }
  })
}

//缴费记录
export const paymentRecords = (data) => {
  return request({
    url: '/workorder/pay/list',
    method: 'POST',
    data:{
      orderno:data.orderno,
      page: 1,
      limit: 9999
    }
  });
};

//跟新待回访状态
export const updateIsReturn = (data) => {
  console.log(data);
  return request({
    url: '/workorder/updateIsReturn',
    method: 'POST',
    data:{
      ordernos:data.ordernos,
    }
  });
};

//获取短信模板列表
export const messageTemplate = (data) => {
  return request({
    url: '/sendMessage/templateList',
    method: 'POST',
    data:{}
  });
};

//根据id获取短信模板
export const messageContent = (data) => {
  return request({
    url: '/sendMessage/getTemplate',
    method: 'POST',
    data:{
      templateId: data.templateId
    }
  });
};
