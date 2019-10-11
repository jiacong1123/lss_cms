import request from 'utils/request';

export const getOrderList = (data) => {
  return request({
    url: '/phone/callRecord/unReadlist',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "adminId": data.adminid,
      "empId": data.loginame,
      "startDate": data.startDate,
      "endDate": data.endDate,
    }
  })
}

export const updateStatus = (data) => {
  return request({
    url: '/phone/updateStatus',
    method: 'POST',
    data:{
      "recordId": data.recordId,
    }
  })
}
