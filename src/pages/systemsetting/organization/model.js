import { message } from 'antd'
import { _mmAction } from 'utils/mm'
import * as organizationApi from './service';

export default {
  namespace: 'organization',
  state: {
     loading: false,
     visible: false,
     authlist: [],
     roleauth: [],
     orgList: [],
     clickTree: [],   // 当前客户信息
  },

  effects: {

    * EFFECTS_GET_ORGLIST({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result , obj , msg} = yield call(organizationApi.getOrgList, payload);
      if ( result === 1) {
        yield put(_mmAction('GET_ORGLIST', {
          orgList: obj,
          loading:false,
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      }
    },

    * EFFECTS_GET_AUTHLIST({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result , obj , msg} = yield call(organizationApi.getAuthList, payload);
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
      const { result , obj , msg} = yield call(organizationApi.getRoleAuth, payload);
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
      const { result , obj , msg} = yield call(organizationApi.editRoleAuth, payload);
      if ( result === 1) {
        yield put(_mmAction('EFFECTS_GET_AUTHLIST'))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false}))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    * EFFECTS_ADD_ORGANIZATION({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result , obj , msg} = yield call(organizationApi.addOrganization, payload);
      if ( result === 1) {
        yield put(_mmAction('EFFECTS_GET_ORGLIST',{parentId: 0,}))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false}))
        message.success('新增成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    * EFFECTS_EDIT_ORGANIZATION({payload}, { call, put, select }) {
      const clickTree = yield select(({organization}) => organization.clickTree)
      const {editId} = clickTree
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result , obj , msg} = yield call(organizationApi.editOrganization, {editId, ...payload});
      if ( result === 1) {
        yield put(_mmAction('update',{
          clickTree: [],
        }))
        yield put(_mmAction('EFFECTS_GET_ORGLIST',{parentId: 0,}))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false}))
        message.success('修改成功!')

      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    *EFFECTS_SET_CLICKTREE({payload}, { call, put }) {
      yield put(_mmAction('update',{
        clickTree: payload,
      }))
    },

  },

  reducers: {
    GET_ORGLIST(state, { payload }) {
      return { ...state, ...payload }
    },

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
    },
    GET_ORGLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    update(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
          // 路由切换初始化数据
          if ( pathname === '/systemsetting/organization'){
            dispatch({
              type: 'EFFECTS_GET_ORGLIST',
              payload: {
                parentId: 0,
              }
            })
          }
      })
    }
}

};
