import request from 'utils/request';
 
export const  apiActiveList= (data) => {
  return request({
    url: '/activity/list',
    method: 'POST',
    data: {
      "page": data.page,
      "limit":data.limit
    }
  })
}

export const  apiSaveActive = (data) => {
  return request({
    url: '/activity/save',
    method: 'POST',
    data: {
      "title": data.title,
      "image": data.image,
      "url": data.url,
      "content":data.content,
      "popup": data.popup,
      "tcimage": data.tcimage,
      "sort": data.sort,
      "start": data.start,
      "end": data.end,
      "status": data.status,
      "actid": data.actid
    }
  })
}


export const  apiGetActiveDetail = (data) => {
  return request({
    url: '/activity/details',
    method: 'POST',
    data: {
      "actid": data.actid
    }
  })
}


export const  apiOperActive = (data) => {
  return request({
    url: '/activity/operate',
    method: 'POST',
    data: {
      "actid": data.actid,
      "status": data.status
    }
  })
}
