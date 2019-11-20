import { message } from 'antd'
import * as alreadydisclueApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'alreadydisclue',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    orderlist: [],     // 工单列表
    orderno: '',       // 当前工单号
    userid: '',        // 客户id
    currentClue: {},   // 当前工单信息
    modalKey: '',      // 当前操作的标识
    servicelist: [],   // 派单服务列表
    total: null,       // 工单总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索条件
    serviceTotal: 0
  },

  effects: {

    * EFFECTS_GET_CLUELIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({alreadydisclue}) => alreadydisclue.searchValue) : {}
      const currentPage = yield select(({alreadydisclue}) => alreadydisclue.currentPage)
      const {page} = payload
      currentPage ? payload.page = currentPage : payload.page
      const type = 2
      const { result, obj , total, msg  } = yield call(alreadydisclueApi.apiClueList, { ...payload , type});
      if (result === 1 ) {
        yield put(_mmAction('UPDATE_STATE',{
          orderlist: _mmStampToTime(obj,['reservedate','visitingtime'],'YYYY/MM/DD'),
          total,
          currentPage: currentPage ? currentPage : page,
          loading: false,
          currentOrder:{},
          searchValue
        }))
      } else {
        message.error(errorMessage)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 获取当前线索
    * EFFECTS_GET_CURRENTCLUE({payload}, { call, put,select }){
      const orderlist = yield select(({alreadydisclue}) => alreadydisclue.orderlist)
      const currentClue = orderlist.find(item=> item.orderno === payload.orderno)
      yield put(_mmAction('UPDATE_STATE',{
        currentClue: _mmAddressConcat(_mmStampToTime(currentClue,['sourcedate'],'YYYY/MM/DD'),['province','city','area'])
      }))
    },

    // 确认到店
    * EFFECTS_ALREADYSHOP({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({alreadydisclue}) => alreadydisclue.currentPage)
      const currentClue = yield select(({alreadydisclue}) => alreadydisclue.currentClue)
       const { result, obj , total, msg  } = yield call(alreadydisclueApi.apiAlreadyShop,payload);
       if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_CLUELIST',{
          page:currentPage,
          limit: 10,
        }))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({alreadydisclue}) => alreadydisclue.searchValue)
      yield put({
        type: 'UPDATE_STATE',
        payload: {
          searchValue: {...searchValue,...payload}
        }
      })
    },
    // 重置搜索参数
    * EFFECTS_RESET_SEARCHVALUE({payload}, { call, put , select}){
        yield put({
          type: 'UPDATE_STATE',
          payload: {
            searchValue:{},
            currentPage: 1
          }
        })
    },
    // 设置当前页码
    * EFFECTS_SET_CURRENTPAGE({payload}, { call, put , select}){
      yield put({
        type: 'UPDATE_STATE',
        payload: {
          currentPage: payload
        }
      })
    },
  },

  reducers: {
    UPDATE_STATE(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_SERVICELIST(state, { payload }) {
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
       // 路由切换初始化数据
       if ( pathname === '/worktaskmanagement/alreadydisclue'){
        dispatch({
          type: 'EFFECTS_GET_CLUELIST',
          payload: {
            page:1,
            limit: 10,
            initEntry: false
          }
        })
      }
      })
    }
}

};
