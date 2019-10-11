import request from 'utils/request'

export const getClinicDropmenu= (values) => {
    return request({
        url: '/clinic/dropmenu',
        method:'POST'
    })
}

export const getRoleList= (values) => {
    return request({
        url: '/admin/rolelist',
        method:'POST'
    })
}

export const getOrgList= (values) => {
    return request({
        url: '/org/list',
        method:'POST',
        data:{
          "parentId": 0
        }
    })
}

export const getTags= (data) => {
    return request({
        url: '/admin/tags',
        method:'POST',
        data:{
          "type": data.type
        }
    })
}

export const getPersonnel= (data) => {
    return request({
        url: '/admin/personnel',
        method:'POST',
        data:{
          "roleid": data.roleid,
          "clinicid": data.clinicid
        }
    })
}

export const getDoctorDropmenu= (data) => {
    return request({
        url: '/doctor/dropmenu',
        method:'POST',
        data:{
          "clinicid": data.clinicid
        }
    })
}

export const getProductDropmenu= (data) => {
    return request({
        url: '/product/menus',
        method:'POST',
        data:{
          "classid": data.classid
        }
    })
}

export const getUploadToken= (data) => {
    return request({
        url: '/common/uploadToken',
        method:'POST'
    })
}


export const updatepassword = (data) => {
    return request({
        url: '/admin/changepassword',
        method:'POST',
        data:{
            "oldpassword": data.oldpassword,
            "password": data.password
        }
    })
}


// 获取用户类型
export const getUserType= (data) => {
    return request({
        baseURL: window.baseURL_hx,
        url: '/api-os/hx/getUserType.do',
        method: 'POST',
        withCredentials: false
    })
}

// 获取来电客户信息
export const getUserInfo= (data) => {
    return request({
      url: '/workorder/userinfo',
      method: 'POST',
      data:{
        "phone": data.phone
      }
    })
  }

// 外呼号码绑定
export const phoneBindCall = (data) =>{
    return request({
      url: '/phone/callbind',
      method: 'POST',
      data:{
        "orderno": data.orderno,
      }
    })
  }

  // 外呼号码绑定
  export const phoneBindCall_phone= (data) =>{
      return request({
        url: '/phone/callbind',
        method: 'POST',
        data:{
          "phone": data.number || data.cusNo,
        }
      })
    }

//检索客户是否存在
    export const judgeUserIsExist= (data) => {
      return request({
        url: '/workorder/userinfo',
        method: 'POST',
        data:{
          "phone": data.phone
        }
      })
    }

//获取客户回收数量
  export const recoveryCustomerNum= (data) => {
    return request({
      url: '/workorder/close/count',
      method: 'POST',
      data:{
        "status": data.status
      }
    })
  }

  //获取未接来电数量
  export const missedCallNum= (data) => {
    return request({
      url: '/phone/unReadCount',
      method: 'POST',
      data:{
        "adminId": data.adminid,
        "empId": data.loginame
      }
    })
  }

  //获取待回访数量
  export const returnCount= (data) => {
    return request({
      url: '/workorder/returnCount',
      method: 'POST',
      data:{

      }
    })
  }

  //获取所属人员列表
    export const personnelList= (data) => {
      return request({
        url: '/admin/personnelList',
        method: 'POST',
        data:{

        }
      })
    }

//
export const getReserveCount= (data) => {
  return request({
    url: 'workorder/reserveCount',
    method: 'POST',
    data:{

    }
  })
}
