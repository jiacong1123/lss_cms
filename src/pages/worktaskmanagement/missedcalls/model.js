import { message } from 'antd'
import router from 'umi/router';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as missedcallsApi from './service';
import store from 'store'

export default {
  namespace: 'missedcalls',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    orderlist: [],     // 工单列表
    orderno: '',       // 当前工单号
    total: null,       // 工单总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索条件
  },

  effects: {

    // 未接来电列表
    * EFFECTS_GET_ORDERLIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({missedcalls}) => missedcalls.searchValue) : {}
      const currentPage = yield select(({missedcalls}) => missedcalls.currentPage)
      payload['page'] = payload.page ? payload.page : currentPage

      const userinfo = store.get('userinfo')
      const adminid = userinfo.adminid
      const loginame = userinfo.loginame
      const { result, obj , total, msg  } = yield call(missedcallsApi.getOrderList, {...searchValue,...payload, adminid, loginame})
      if (result === 1) {
        yield put(_mmAction('GET_ORDERLIST',{
          orderlist: obj,
          total,
          currentPage: payload.page ? payload.page : currentPage,
          loading: false,
          searchValue
        }))
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({missedcalls}) => missedcalls.searchValue)
      yield put({
        type: 'RESET_SEARCHVALUE',
        payload: {
          searchValue: {...searchValue,...payload}
        }
      })
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

    //更新未接来电状态
    * EFFECTS_UPDATESTATUS({payload}, { call, put,select }) {
      const searchValue = !payload.initEntry ? yield select(({missedcalls}) => missedcalls.searchValue) : {}
      const currentPage = yield select(({missedcalls}) => missedcalls.currentPage)
      payload['page'] = payload.page ? payload.page : currentPage

      const userinfo = store.get('userinfo')
      const adminid = userinfo.adminid
      const loginame = userinfo.loginame
      const { result, obj , total, msg  } = yield call(missedcallsApi.updateStatus, { payload })
      if (result === 1) {
        // yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
        //   page:currentPage,
        //   limit: 10,
        //   status:99,
        //   adminid,
        //   loginame
        // }))
          message.error("更新成功！")
      } else {
        message.error(msg)
      }
    },

  },

  reducers: {
    GET_ORDERLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    SET_CURRENTPAGE(state, { payload }) {
      return { ...state, ...payload }
    },
    RESET_SEARCHVALUE(state, { payload }){
      return { ...state, ...payload }
    },
    IS_SHOWLOADING(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
          // 路由切换初始化数据
        if ( pathname === '/worktaskmanagement/missedcalls'){
          dispatch({
            type: 'EFFECTS_GET_ORDERLIST',
            payload: {
              limit: 10,
              initEntry: false
            }
          })
        }
      })
    }
}

};
