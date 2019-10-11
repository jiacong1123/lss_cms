import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as worktaskdetailApi from './service';

const parentNamespace = 'worktaskmanagement'

export default {
  namespace: 'worktaskdetail',
  state: {
    recordUrl: '' ,   // 录音地址
    playing: false ,  // 播放暂停
    payload: {},
    loading: false,
    orderdetail: {},
    paymentRecords: {}  //缴费记录
  },

  effects: {
    // 获取工单信息
    * EFFECTS_GET_ORDERDETAIL({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj ,msg} = yield call(worktaskdetailApi.getOrderDetail, payload);
      obj['user'] =  _mmStampToTime(obj['user'],['sourcedate'],'YYYY/MM/DD')
      obj['user'] =  _mmStampToTime(obj['user'],['createtime'],'YYYY/MM/DD HH:mm:ss')
      obj['records'] = _mmStampToTime(obj['records'],['time'],'YYYY/MM/DD HH:mm:ss')
      const data =  _mmStampToTime(obj,['createtime'],'YYYY/MM/DD HH:mm:ss')
      if (result === 1) {
        yield put({ type: 'GET_ORDERDETAIL',
          payload: {
            orderdetail: _mmStampToTime(data,['reservedate'],'YYYY/MM/DD'),
            loading:false,
            orderno: payload.orderno,
        }})
        yield put({ type: 'layout/EFFECTS_GET_PERSONNAL',
          payload: {
            roleid: 6,
            clinicid: obj.clinicid,
          }})
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    //获取缴费信息
    * EFFECTS_PAYMENTRECORDS({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj , total, msg  } = yield call(worktaskdetailApi.paymentRecords, payload)
      if (result === 1) {
        yield put(_mmAction('GET_PAYMENTRECORDS',{
          paymentRecords: obj,
          loading: false,
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    * effectsPlayAduio({payload}, { call, put , select}) {
      const { recordUrl } =  payload
      yield put(_mmAction('update',{
         recordUrl: recordUrl,
         playing: true,
         payload,
      }))
    },

    * effectsPauseAudio({payload}, { call, put , select}) {
      const { recordUrl } =  payload
      yield put(_mmAction('update',{
         recordUrl: recordUrl,
         playing: false,
         payload,
      }))
    },

    * effectsCloseAudio({payload}, { call, put , select}) {
      const { recordUrl } =  payload
      yield put(_mmAction('update',{
        recordUrl: '',
        playing: false,
     }))
   },


  },

  reducers: {
    update(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_ORDERDETAIL(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_PAYMENTRECORDS(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
    setupHistory({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if( pathname === '/worktaskmanagement/worktaskdetail') {
          // const { orderno, type } = history.location.query
          // dispatch({ type: `${parentNamespace}/EFFECTS_GET_ORDERDETAIL`,
          //   payload: {
          //     orderno
          // }});
          // if (type && type == 'alreadydeal') {
          //   dispatch({ type: `${parentNamespace}/EFFECTS_PAYMENTRECORDS`,
          //     payload: {
          //       orderno
          //   }})
          // }

        } else {
          const { orderno } = history.location.query
          dispatch({ type: `${parentNamespace}/EFFECTS_CLEAR_ORDERDETAIL`,
            payload: {
              orderno
          }});
        }
      })
    }
  }

};
