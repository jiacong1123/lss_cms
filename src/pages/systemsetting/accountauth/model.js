import { message } from 'antd'
import { _mmAction } from 'utils/mm'
import * as accountauthApi from './service';
 
export default {
  namespace: 'accountauth',
  state: {
     loading: false,
     visible: false,
     authlist: [],
     roleauth: []
  },
 
  effects: {
    * EFFECTS_GET_AUTHLIST({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result , obj , msg} = yield call(accountauthApi.getAuthList, payload);
      if ( result === 1) {
        yield put(_mmAction('GET_AUTHLIST', {
          authlist: obj,
          loading:false,
          roleauth: []
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      }
    },
    * EFFECTS_GET_ROLEAUTH({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result , obj , msg} = yield call(accountauthApi.getRoleAuth, payload);
      if ( result === 1) {
        yield put(_mmAction('GET_ROLEAUTH', {
          roleauth: obj,
          loading:false
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    * EFFECTS_EDIT_ROLEAUTH({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result , obj , msg} = yield call(accountauthApi.editRoleAuth, payload);
      if ( result === 1) {
        yield put(_mmAction('EFFECTS_GET_AUTHLIST'))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false}))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
  },
 
  reducers: {
    GET_AUTHLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_ROLEAUTH(state, { payload }) {
      return { ...state, ...payload }
    },
    IS_SHOWLOADING(state, { payload }) {
      return { ...state, ...payload }
    },
    IS_SHOWMODAL(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        dispatch({ 
          type: 'EFFECTS_GET_AUTHLIST',
          payload: {
            page:1,
            limit: 10
          }
        })
      })
    }
}
 
};
