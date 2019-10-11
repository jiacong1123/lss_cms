import request from 'utils/request';

export const getNewsList = (data) => {
  return request({
    url: '/news/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "type": data.type
    }
  })
}


export const saveNews = (data) => {
  return request({
    url: '/news/save',
    method: 'POST',
    data:{
      "title": data.title,
      "subtitle":data.subtitle,
      "image":data.image,
      "content":data.content,
      "type":data.type,
      "status":data.status,
      "id":data.id,
      "smallIcon": data.smallIcon,
      "url": data.url
    }
  })
}

export const operNews = (data) => {
  return request({
    url: '/news/operate',
    method: 'POST',
    data:{
      "status":data.status,
      "id":data.id
    }
  })
}
