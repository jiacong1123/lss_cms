import request from 'utils/request';

export const getCarouselList = (data) => {
  return request({
    url: '/banner/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "type": data.type
    }
  });
}

export const saveCarousel = (data) => {
  return request({
    url: '/banner/save',
    method: 'POST',
    data:{
      "title": data.title,
      "image": data.image,
      "url": data.url,
      "type": data.type,
      "status": data.status,
      "id": data.id,
      "smallIcon": data.smallIcon
    }
  })
}

export const operCarousel = (data) => {
  return request({
    url: '/banner/operate',
    method: 'POST',
    data:{
      "status": data.status,
      "id": data.id
    }
  })
}
