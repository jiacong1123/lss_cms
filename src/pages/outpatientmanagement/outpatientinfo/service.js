import request from 'utils/request';
 
export const getClinicList = (data) => {
  return request({
    url: '/clinic/list',
    method: 'POST',
    data:{
      "page": data.page,
      "limit": data.limit,
      "name": data.name,
      "type": data.type,
      "province": data.province,
      "city": data.city,
      "area": data.area,
    }
  });
}


export const saveClinic = (data) => {
  return request({
    url: '/clinic/save',
    method: 'POST',
    data:{
      "name": data.name,
      "image": data.image,
      "shortname": data.shortname,
      "mainproject": data.mainproject,
      "telephone": data.telephone,
      "principal": data.principal,
      "phone": data.phone,
      "province": data.province,
      "city": data.city,
      "area": data.area,
      "address": data.address,
      "type": data.type,
      "description": data.description,
      "milieupicture": data.milieupicture,
      "devicepicture":data.devicepicture,
      "clinicid": data.clinicid,
    }
  });
}

export const deleteClinic = (data) => {
  return request({
    url: '/clinic/delete',
    method: 'POST',
    data:{
      "clinicid": data.clinicid,
    }
  })
}
