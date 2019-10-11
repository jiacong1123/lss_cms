import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as orderdetailApi from './service';
 
export default {
  namespace: 'orderdetail',
  state: {
    loading: false,    // 加载动画
    orderlist: [],     // 订单列表
    orderno: '',       // 当前订单编号
    orderdetail: {},   // 当前订单信息
    modalKey: '',      // 当前操作的标识
  },
 
  effects: {
    // 获取订单列表
    * EFFECTS_GET_ORDERLIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { orderno } = payload
      const { result, obj, total, msg} = yield call(orderdetailApi.getOrderList, payload);
      if (result === 1 ) {
        const orderdetail = obj.find(item=>item.orderno === orderno )
        yield put(_mmAction('GET_ORDERLIST',{
          orderlist:  _mmStampToTime(obj,['createtime','paytime'],'YYYY/MM/DD HH:mm:ss'),
          loading: false,
          orderdetail
        }));
      }else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    }
  },
 
  reducers: {
    GET_ORDERLIST(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({pathname}) => {
        // 路由切换初始化数据
        if ( pathname === '/ordermanagement/orderdetail'){
          const { page, orderno} = history.location.query
          dispatch({ 
            type: 'EFFECTS_GET_ORDERLIST',
            payload: {
              page: page ,
              limit: 10,
              orderno
            }
          })
        }
      })
    }
}
};
