import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as dealstatisticsApi from './service';
import moment from 'moment'

export default {
  namespace: 'dealstatistics',
  state: {
    loading: false,    // 加载动画
    customlist: [],    // 客户列表
    modalKey: '',      // 当前操作的标识
    total: null,       // 客户总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索条件
    currmonthList: [], //本月成交
    historyList: [],   //历史成交记录
  },

  effects: {
    // 获取本月成交列表
    * EFFECTS_GET_MONTHLIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ?  yield select(({dealstatistics}) => dealstatistics.searchValue): {}
      console.log(searchValue)
      const currentPage = yield select(({dealstatistics}) => dealstatistics.currentPage)
      const { page } = payload
      const { result, obj, total, msg} = yield call(dealstatisticsApi.getMonthList, {...searchValue,...payload});
      console.log(obj)
      if (result === 1 ) {
        yield put(_mmAction('GET_CURRMONTHLIST',{
          currmonthList: obj,
          total,
          currentPage: page ? page : currentPage ,
          loading: false,
          searchValue
        }));
      }else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({dealstatistics}) => dealstatistics.searchValue)
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

    //获取历史成交列表
    * EFFECTS_GET_HISTORYLIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ?  yield select(({dealstatistics}) => dealstatistics.searchValue): {}
      const currentPage = yield select(({dealstatistics}) => dealstatistics.currentPage)
      const { page } = payload
      const { result, obj, total, msg} = yield call(dealstatisticsApi.getHistoryList, {...searchValue,...payload});
      if (result === 1 ) {
        yield put(_mmAction('GET_CURRMONTHLIST',{
          historyList: _mmStampToTime(obj,['stDate'],'YYYY/MM/DD HH:mm:ss'),
          total,
          currentPage: page ? page : currentPage ,
          loading: false,
          searchValue
        }));
      }else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
  },

  reducers: {
    GET_CURRMONTHLIST(state, { payload }) {
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
      return history.listen(({pathname}) => {
        // 路由切换初始化数据
        if ( pathname === '/reportmanagement/dealstatistics'){
          dispatch({
            type: 'EFFECTS_GET_MONTHLIST',
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
