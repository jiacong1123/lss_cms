import request from 'utils/request';

export const getOrgList = (data) => {
  return request({
    url: '/org/list',
    method: 'POST',
    data: {
      parentId: data.parentId,  //顶级传0，其他传对应ID
    }
  });
}


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


export const addOrganization = (data) => {
  return request({
    url: '/org/save',
    method: 'POST',
    data: {
      orgName: data.orgName,
      parentId: data.parentId,
      remark: data.remark
    }
  });
}

export const editOrganization = (data) => {
  console.log(data)
  return request({
    url: '/org/edit',
    method: 'POST',
    data: {
      orgName: data.orgName,
      parentId: data.parentId,
      remark: data.remark,
      id: data.editId
    }
  });
}
