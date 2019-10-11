import request from 'utils/request';
 
export const getAuthList = () => {
  return request({
    url: '/admin/popedomlist',
    method: 'POST',
  });
}

export const getRoleAuth = (data) => {
  return request({
    url: '/admin/rolepopedom',
    method: 'POST',
    data: {
      roleid: data.roleid
    }
  });
}

export const editRoleAuth = (data) => {
  return request({
    url: '/admin/editpopedom',
    method: 'POST',
    data: {
      roleid: data.roleid,
      popeids: data.popeids
    }
  });
}
