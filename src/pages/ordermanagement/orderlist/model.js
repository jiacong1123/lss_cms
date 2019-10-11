import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as orderlistApi from './service';

export default {
  namespace: 'orderlist',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    orderlist: [],     // 订单列表
    orderno: '',       // 当前订单编号
    currentOrder: {},   // 当前订单信息
    modalKey: '',      // 当前操作的标识
    total: null,       // 订单总条数
    currentPage: 1,    // 当前页码
    searchValue: {}    // 搜索条件
  },

  effects: {
    // 获取订单列表
    * EFFECTS_GET_ORDERLIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({orderlist}) => orderlist.searchValue) : {}
      const currentPage = yield select(({orderlist}) => orderlist.currentPage)
      const { page } = payload
      const { result, obj, total, msg} = yield call(orderlistApi.getOrderList, {...searchValue,...payload});
      if (result === 1 ) {
        yield put(_mmAction('GET_ORDERLIST',{
          orderlist:  _mmStampToTime(obj,['createtime','paytime'],'YYYY/MM/DD HH:mm:ss'),
          total,
          currentPage: page ? page : currentPage ,
          loading: false,
          currentOrder:{},
          searchValue
        }));
      }else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 确认支付
    * EFFECTS_CONFIRM_PAY({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({orderlist}) => orderlist.currentPage)
      const { result, obj, total, msg} = yield call(orderlistApi.confirmPay, payload);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: 10
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        message.success('操作成功!')
      }else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },


    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({orderlist}) => orderlist.searchValue)
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
  },

  reducers: {
    GET_ORDERLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    SET_CURRENTPAGE(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTORDER(state, { payload }) {
      return { ...state, ...payload }
    },
    RESET_SEARCHVALUE(state, { payload }){
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
      return history.listen(({pathname}) => {
        // 路由切换初始化数据
        if ( pathname === '/ordermanagement/orderlist'){
          dispatch({
            type: 'EFFECTS_GET_ORDERLIST',
            payload: {
              page:1,
              limit: 10,
              initEntry:true
            }
          })
        }
      })
    }
}
};
