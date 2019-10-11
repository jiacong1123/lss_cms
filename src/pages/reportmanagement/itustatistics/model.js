import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as itustatisticsApi from './service';
import moment from 'moment'

export default {
  namespace: 'itustatistics',
  state: {
    loading: false,    // 加载动画
    customlist: [],    // 客户列表
    modalKey: '',      // 当前操作的标识
    total: null,       // 客户总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索条件
    stcallTodayList: [], //本月成交
    stcallTodayCount: [],  //本月统计数量
    stcallHistoryList: [],   //历史成交记录
    stcallHistoryListCount: [],   //历史统计数量
  },

  effects: {
    // 获取今日联系列表
    * EFFECTS_GET_MONTHLIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ?  yield select(({itustatistics}) => itustatistics.searchValue): {}
      const currentPage = yield select(({itustatistics}) => itustatistics.currentPage)
      const { page } = payload
      const { result, obj, total, msg} = yield call(itustatisticsApi.stcallToday, {...searchValue,...payload});

      if (result === 1 ) {
        yield put(_mmAction('GET_STCALLTODAYLIST',{
          stcallTodayList: obj,
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

    // 获取今日联系统计
    * EFFECTS_GET_MONTHLIST_COUNT({payload}, { call, put , select}) {
      const searchValue = !payload.initEntry ?  yield select(({itustatistics}) => itustatistics.searchValue): {}
      const { result, obj, total, msg} = yield call(itustatisticsApi.stcallTodayCount, {...searchValue,...payload});
      if (result === 1 ) {
        yield put(_mmAction('GET_STCALLTODAYLIST',{
          stcallTodayCount: obj,
          searchValue
        }));
      }else {
        message.error(msg)
      }
    },


    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({itustatistics}) => itustatistics.searchValue)
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

    //获取历史列表
    * EFFECTS_GET_HISTORYLIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ?  yield select(({itustatistics}) => itustatistics.searchValue): {}
      const currentPage = yield select(({itustatistics}) => itustatistics.currentPage)
      const { page } = payload
      const { result, obj, total, msg} = yield call(itustatisticsApi.stcallHistory, {...searchValue,...payload});
      if (result === 1 ) {
        yield put(_mmAction('GET_STCALLHISTORYLIST',{
          stcallHistoryList: _mmStampToTime(obj,['stDate'],'YYYY/MM/DD HH:mm:ss'),
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

    //获取历史列表统计
    * EFFECTS_GET_HISTORYLIST_COUNT({payload}, { call, put , select}) {
      const searchValue = !payload.initEntry ?  yield select(({itustatistics}) => itustatistics.searchValue): {}
      const { result, obj, total, msg} = yield call(itustatisticsApi.stcallHistoryCount, {...searchValue,...payload});
      if (result === 1 ) {
        yield put(_mmAction('GET_STCALLHISTORYLIST',{
          stcallHistoryListCount: obj,
          searchValue
        }));
      }else {
        message.error(msg)
      }
    },
  },

  reducers: {
    GET_STCALLTODAYLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_STCALLHISTORYLIST(state, { payload }) {
      return { ...state, ...payload}
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
        if ( pathname === '/reportmanagement/itustatistics'){
          dispatch({
            type: 'EFFECTS_GET_MONTHLIST',
            payload: {
              page:1,
              limit: 10,
              initEntry: false
            }
          })
          dispatch({
            type: 'EFFECTS_GET_MONTHLIST_COUNT',
            payload: {
              initEntry: false
            }
          })
        }
      })
    }
}
};
