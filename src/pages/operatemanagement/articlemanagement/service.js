import request from 'utils/request';
 
export const getScienceList = (data) => {
  return request({
    url: '/science/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit
    }
  });
}

export const saveScience = (data) => {
  return request({
    url: '/science/save',
    method: 'POST',
    data:{
      "title": data.title,
      "answer":  data.answer,
      "doctorid":  data.doctorid,
      "answertime":  data.answertime,
      "status":  data.status,
      "id":  data.id
    }
  })
}

export const operScience = (data) => {
  return request({
    url: '/science/operate',
    method: 'POST',
    data:{
      "status":  data.status,
      "id":  data.id
    }
  })
}
