import request from 'utils/request';

export const getOralList = (data) => {
  return request({
    url: '/baike/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
    }
  })
}


export const saveBaike = (data) => {
  return request({
    url: '/baike/save',
    method: 'POST',
    data:{
      "title": data.title,
      "subtitle": data.subtitle,
      "image": data.image,
      "content":data.content,
      "type": 1,
      "status": data.status,
      "lables": data.lables,
      "url": data.url,
      "smallIcon": data.smallIcon
    }
  })
}

export const operNews = (data) => {
  return request({
    url: '/baike/edit',
    method: 'POST',
    data:{
      "status":data.status,
      "id":data.id,
      "title": data.title,
      "subtitle": data.subtitle,
      "image": data.image,
      "content":data.content,
      "type": 1,
      "lables": data.lables,
      "url": data.url,
      "smallIcon": data.smallIcon
    }
  })
}
export const getOralDetail = (data) => {
  return request({
    url: '/baike/details',
    method: 'POST',
    data:{
      "id":data.id
    }
  })
}
