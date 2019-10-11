import request from 'utils/request';
 
export const getOrderList = (data) => {
  return request({
    url: '/bagorder/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "phone": data.phone
    }
  })
}

export const confirmPay = (data) => {
  return request({
    url: '/bagorder/confirmpay',
    method: 'POST',
    data:{
      "orderno": data.orderno
    }
  })
}
