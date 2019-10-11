import request from 'utils/request';
 
export const apiClueList = (data) => {
  return request({
    url: '/clue/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "type": data.type,
      "usertype": data.usertype,
      "name": data.name,
      "phone": data.phone
    }
  })
}

export const apiEditClue = (data) => {
  return request({
    url: '/clue/edit',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "province":data.province,
      "city": data.city,
      "area": data.area,
      "projectid": data.projectid,
      "reservedate": data.reservedate,
      "reservetime": data.reservetime,
      "usertype": data.usertype,
      "usertypename": data.usertypename,
      "level": data.level,
      "complaint": data.complaint,
      "worknotes": data.worknotes,
    }
  });
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

