import * as service from './service'
import router from 'umi/router';
import { message } from 'antd'

export default {
    namespace: 'login',
    state:{
        imgcode: window.baseURL+"/admin/imgcode?" + Math.random() 
    },
    effects:{
    },
    reducers:{
        UPDATE_IMG_CODE: (state,action) => {
            return {
                ...state,
                imgcode: window.baseURL+"/admin/imgcode?" + Math.random()
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
          return history.listen(({ pathname }) => {
            if (pathname === '/login') {
                dispatch({
                    type: 'UPDATE_IMG_CODE'
                })
            }
          })
        }
    }
}