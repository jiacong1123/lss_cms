import request from 'utils/request'

export const login = (values) => {
    return request({
        url: '/admin/login',
        method:'POST',
        data:values
    })
}

export const logout = (values) => {
    return request({
        url: '/admin/loginout',
        method:'POST'
    })
}

export const getMenuList = (values) => {
    return request({
        url: '/admin/menulist',
        method:'POST'
    })
}