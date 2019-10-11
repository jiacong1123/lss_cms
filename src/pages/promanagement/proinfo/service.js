import request from 'utils/request';
 
export const apiProList = (data) => {
  return request({
    url: '/product/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "classid": data.classid,
      "title": data.title
    }
  })
}

export const apiSavePro = (data) => {
  return request({
    url: '/product/save',
    method: 'POST',
    data:{
      "classid": data.classid,
      "title": data.title,
      "des": data.des,
      "image": data.image,
      "costprice": data.costprice,
      "price": data.price,
      "details": data.details,
      "status": data.status,
      "list": data.list,
      "pid": data.pid
    }
  })
}

export const apiGetProDetail = (data) => {
  return request({
    url: '/product/details',
    method: 'POST',
    data:{
      "pid": data.pid
    }
  })
}

export const apiOperPro = (data) => {
  return request({
    url: '/product/operate',
    method: 'POST',
    data:{
      "pid": data.pid,
      "status": data.status
    }
  })
}
