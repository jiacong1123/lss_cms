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

export const apiAlreadyShop = (data) => {
  return request({
    url: '/clue/operation',
    method: 'POST',
    data:{
      "orderno": data.orderno,
      "status": data.status
    }
  })
}