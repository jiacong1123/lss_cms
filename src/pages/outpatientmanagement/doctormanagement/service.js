import request from 'utils/request';
 
export const getDoctorList = (data) => {
  return request({
    url: '/doctor/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "clinicid": data.clinicid,
      "name": data.name
    }
  })
}

export const saveDoctor = (data) => {
  return request({
    url: '/doctor/save',
    method: 'POST',
    data:{
      "clinicid": data.clinicid,
      "name": data.name,
      "phone": data.phone,
      "sex": data.sex,
      "titleid": data.titleid,
      "photo": data.photo,
      "goodat": data.goodat,
      "synopsis": data.synopsis,
      "doctorid": data.doctorid,
      "ksid": data.ksid
    }
  })
}

export const deleteDoctor = (data) => {
  return request({
    url: '/doctor/delete',
    method: 'POST',
    data:{
      "doctorid": data.doctorid
    }
  })
}
