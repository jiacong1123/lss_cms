import * as service from 'services'
import router from 'umi/router';
import { message } from 'antd'
import store from 'store'

export default {
    namespace:'app',
    state:{
        menulist:null,
        userinfo:null,
        guidMember: null,
    },
    effects:{
        *EFFECTS_GET_MENULIST(action,{call,put,select}){
             const { obj, result } = yield call(service.getMenuList, action)
             obj.unshift({
                "popeid": 1,
                "name": "个人中心",
                "icon": "dashboard",
                "url": "/usercenter",
                "level": 1,
                "parentid": null
             })
             if( result === 1 ) {
                yield put({
                    type:'GET_MENULIST',
                    payload: obj
                })
             }
        },
        *EFFECTS_LOGIN(action,{ put, call , select}){
            const res = yield call(service.login,action.payload)
            console.log(res)
            if( res.result === 1 ) {
                store.set('userinfo',res.obj)
                store.set('isLogin',true)
                store.set('guidMember', res.obj.guidMember)
                const targetpathname = store.get('targetpathname')
                router.push(targetpathname ? targetpathname : '/')
                message.success('登录成功!')
            } else {
                message.error(res.msg)
            }
        },
        *EFFECTS_LOGOUT(action,{ put, call , select}){
            const res = yield call(service.logout)
            if( res.result === 1 ) {
                store.set('userinfo','')
                store.set('isLogin',false)
                message.error('您已退出，请重新登录！')
            } else {
                message.error(res.msg)
            }
        }
    },
    reducers:{
        GET_MENULIST(state,action){
            return {
                ...state,
                menulist: action.payload
            }
        },
    },
    subscriptions:{
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname !== '/login') {
                    dispatch({
                        type: 'EFFECTS_GET_MENULIST'
                    })
                }
            })
          },
    }
}
