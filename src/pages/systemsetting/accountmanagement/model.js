import { message } from 'antd'
import { _mmStampToTime,_mmAction } from 'utils/mm.js'
import * as accountmanagementApi from './service';

export default {
  namespace: 'accountmanagement',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    adminlist: [],     // 账号列表
    adminid: '',       // 当前账号id
    currentAdmin: {},  // 当前账号信息
    modalKey: '',      // 当前操作的标识
    total: null,       // 账号总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索参数
    selectOrg: {},      //选择的机构
  },
  effects: {
    // 获取账号列表
    * EFFECTS_GET_ADMINLIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({accountmanagement}) => accountmanagement.searchValue) : {}
      const currentPage = yield select(({accountmanagement}) => accountmanagement.currentPage)
      const { page } = payload
      const { result, obj, total,msg} = yield call(accountmanagementApi.getAdminList, {...searchValue,...payload});
      if (result ===1) {
        yield put({ type: 'GET_ADMINLIST',
          payload: {
            loading: false,
            searchValue: {...searchValue,...payload},
            adminlist: _mmStampToTime(obj,['createtime','logintime'],'YYYY/MM/DD HH:mm:ss'),
            total,
            currentPage: page ? page : currentPage,
            currentAdmin: {}
        }});
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 添加/编辑账号
    * EFFECTS_ADD_ADMIN({payload}, { call, put, select}) {
      const currentPage = yield select(({accountmanagement}) => accountmanagement.currentPage)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const obj = yield call(accountmanagementApi.saveAdmin, payload);
      if (obj.result === 1) {
        yield put(
          _mmAction(
          'EFFECTS_GET_ADMINLIST',
          {
            page: currentPage,
            limit: 10,
          })
        )
        yield put(_mmAction('IS_SHOWMODAL',{visible: false}))
        message.success('操作成功!')
      } else {
        message.error(obj.msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 启用/禁用/删除账号
    * EFFECTS_OPERATE_ADMIN({payload}, { call, put, select }) {
      const currentPage = yield select(({accountmanagement}) => accountmanagement.currentPage)
      const searchValue = yield select(({accountmanagement}) => accountmanagement.searchValue)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const obj1 = yield call(accountmanagementApi.operateAdmin, payload);
      if (obj1.result === 1) {
        yield put({
          type: 'EFFECTS_GET_ADMINLIST',
          payload: {
            page: currentPage,
            limit: 10,
            ...searchValue
          }
        })
        message.success('操作成功!')
      } else {
        message.error(obj1.msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 编辑账号角色
    * EFFECTS_EDIT_ADMINROLE({payload}, { call, put , select}) {
      const currentPage = yield select(({accountmanagement}) => accountmanagement.currentPage)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const obj1 = yield call(accountmanagementApi.editAdminRole, payload);
      if (obj1.result === 1) {
        yield put(
          _mmAction(
          'EFFECTS_GET_ADMINLIST',
          {
            page: currentPage,
            limit: 10
          })
        )
        yield put(_mmAction('IS_SHOWMODAL',{visible: false}))
        message.success('操作成功!')
      } else {
        message.error(obj1.msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 员工绑定话机号码
    * EFFECTS_BINDPHONE({payload}, { call, put , select}) {
        yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
        const adminid = yield select(({accountmanagement}) => accountmanagement.adminid)
        const currentPage = yield select(({accountmanagement}) => accountmanagement.currentPage)
        const obj1 = yield call(accountmanagementApi.bindPhone, {adminid,...payload});
        if (obj1.result === 1) {
          yield put(
            _mmAction(
            'EFFECTS_GET_ADMINLIST',
            {
              page: currentPage,
              limit: 10
            })
          )
          yield put(_mmAction('IS_SHOWMODAL',{visible: false}))
          message.success('操作成功!')
        } else {
          message.error(obj1.msg)
          yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
        }
    },

    // 重置搜索参数
    * EFFECTS_RESET_SEARCHVALUE({payload}, { call, put , select}){
      yield put({
        type: 'RESET_SEARCHVALUE',
        payload: {
          searchValue:{},
          currentPage: 1
        }
      })
    },
    // 设置当前页码
    * EFFECTS_SET_CURRENTPAGE({payload}, { call, put , select}){
      yield put({
        type: 'SET_CURRENTPAGE',
        payload: {
          currentPage: payload
        }
      })
    },
    // 获取当前账号信息
    * EFFECTS_GET_CURRENTADMIN({payload}, { call, put , select}){
      const adminlist = yield select(({accountmanagement}) => accountmanagement.adminlist)
      const { adminid } = payload
      const currentAdmin = adminlist.find(item=>item.adminid === adminid )
      yield put({
        type: 'SET_CURRENTPAGE',
        payload: {
          adminid,
          currentAdmin
        }
      })
    },

    //EC绑定电话号码
    * EFFECTS_EC_BINDID({payload}, { call, put , select}) {
        yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
        const adminid = yield select(({accountmanagement}) => accountmanagement.adminid)
        const currentPage = yield select(({accountmanagement}) => accountmanagement.currentPage)
        const obj1 = yield call(accountmanagementApi.bingECId, {adminid,...payload});
        if (obj1.result === 1) {
          yield put(
            _mmAction(
            'EFFECTS_GET_ADMINLIST',
            {
              page: currentPage,
              limit: 10
            })
          )
          yield put(_mmAction('IS_SHOWMODAL',{visible: false}))
          yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
          message.success('操作成功!')
        } else {
          message.error(obj1.msg)
          yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
        }
    },

    //新增或编辑弹窗  选择的机构
    *EFFECTS_SET_ORG({payload}, { call, put }) {
      yield put(_mmAction('update',{
        selectOrg: payload,
      }))
    },
  },

  reducers: {
    GET_ADMINLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    SET_CURRENTPAGE(state, { payload }) {
      return { ...state, ...payload }
    },
    RESET_SEARCHVALUE(state, { payload }){
      return { ...state, ...payload }
    },
    GET_CURRENTADMIN(state, { payload }) {
      return { ...state, ...payload }
    },
    IS_SHOWLOADING(state, { payload }) {
      return { ...state, ...payload }
    },
    IS_SHOWMODAL(state, { payload }) {
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
        if ( pathname === '/systemsetting/accountmanagement'){
          dispatch({
            type: 'EFFECTS_GET_ADMINLIST',
            payload: {
              page: 1,
              limit: 10,
              initEntry: true
            }
          })
        }
      })
    }
}

};
