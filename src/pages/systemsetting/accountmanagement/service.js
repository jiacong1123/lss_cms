import request from 'utils/request';

export const getAdminList = (data) => {
  return request({
    url: '/admin/list',
    method: 'POST',
    data: {
      "page": data.page,
      "limit": data.limit,
      "name": data.name,
      "phone": data.phone
    }
  });
}

export const saveAdmin = (data) => {
  return request({
    url: '/admin/save',
    method: 'POST',
    data: {
      "clinicid": data.clinicid,
      "loginame": data.loginame,
      "loginpwd": data.loginpwd,
      "name":data.name,
      "phone":data.phone,
      "adminid": data.adminid,
      "orgId": data.orgId,
      "orgName": data.orgName,
      "noWx": data.noWx
    }
  });
}

export const operateAdmin = (data) => {
  return request({
    url: '/admin/operate',
    method: 'POST',
    data: {
      "adminid":data.adminid,
      "status": data.status
    }
  });
}

export const editAdminRole = (data) => {
  return request({
    url: '/admin/editrole',
    method: 'POST',
    data: {
      "adminid":data.adminid,
      "roleids": data.roleids
    }
  });
}

//卡尔绑定电话号码
export const bindPhone = (data) => {
  return request({
    url: '/admin/bindPhone',
    method: 'POST',
    data: {
      "adminid":data.adminid,
      "callerNos": data.callerNos,
      "transferNo": data.transferNo
    }
  });
}

//EC绑定电话号码
export const bingECId = (data) => {
  return request({
    url: '/admin/getEcUserId',
    method: 'POST',
    data: {
      "phone": data.phone
    }
  });
}
