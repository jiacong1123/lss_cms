import request from 'utils/request';

export const getCustomList = (data) => {
  return request({
    url: '/user/list',
    method: 'POST',
    data: {
      "page": data.page,
      "limit":data.limit,
      "name":data.name,
      "phone":data.phone,
      "province":data.province,
      "city":data.city,
      "sourceid":data.sourceid,
      "start":data.start,
      "end":data.end
    }
  });
}
export const getSourceChild = (data) => {

  return request({
    url: '/admin/tags',
    method: 'POST',
    data: {
      "type": 2,
      "parentid": data.tagid
    }
  });
}

export const saveCustom = (data) => {
    console.log(data)
  return request({
    url: '/user/save',
    method: 'POST',
    data: {
      "phone":data.phone,
      "name":data.name,
      "sex":data.sex,
      "age":data.age,
      "wechat":data.wechat,
      "province":data.province,
      "city":data.city,
      "sourceid":data.sourceid,
      "sourcedate":data.sourcedate,
      "notes":data.notes,
      "userid":data.userid,
      "sourceid2": data.sourceid2,
      "sourcename2": data.tagname
    }
  });
}

//删除客户信息
export const deleteCurrentUser = (data) => {
  return request({
    url: '/user/remove',
    method: 'POST',
    data: {
      "userid":data.userid
    }
  });
}
