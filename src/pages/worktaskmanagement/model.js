import { message } from 'antd'
import router from 'umi/router';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as worktaskmanagementApi from './service';

export default {
  namespace: 'worktaskmanagement',

  state: {
     loading: false,
     orderdetail: {},
     times:[
      '9:00~9:30',
      '9:30~10:00',
      '10:00~10:30',
      '10:30~11:00',
      '11:00~11:30',
      '11:30~12:00',
      '12:00~12:30',
      '12:30~13:00',
      '13:00~13:30',
      '13:30~14:00',
      '14:00~14:30',
      '14:30~15:00',
      '15:00~15:30',
      '15:30~16:00',
      '16:00~16:30',
      '16:30~17:00',
      '17:00~17:30',
      '17:30~18:00',
      '18:00~18:30',
      '18:30~19:00',
      '19:00~19:30',
      '19:30~20:00',
      '20:00~20:30',
      '20:30~21:00',
      '21:00~21:30',
      '21:30~22:00'
    ],
    isShowComModal: false,
    servicelist: [],   // 派单服务列表
    serviceTotal: 0,
    urlParams: [],
    paymentRecords: {}  //缴费记录
    // currentCallInfo: {},
    // visible_calltype: false,
    // visible_calltype_ATD: false,  // 拨号中
    // visible_calltype_CBEGIN: false, // 去电来点是否接通
    // visible_calltype_CEND: false,  // 话机挂机
    // visible_calltype_CALLING: false // 是否有来电

  },

  effects: {

    // 获取工单信息
    * EFFECTS_GET_ORDERDETAIL({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj ,msg} = yield call(worktaskmanagementApi.getOrderDetail, payload);
      obj['user'] =  _mmStampToTime(obj['user'],['sourcedate'],'YYYY/MM/DD')
      obj['user'] =  _mmStampToTime(obj['user'],['createtime'],'YYYY/MM/DD HH:mm:ss')
      obj['records'] = _mmStampToTime(obj['records'],['time'],'YYYY/MM/DD HH:mm:ss')
      const data =  _mmStampToTime(obj,['createtime'],'YYYY/MM/DD HH:mm:ss')
      if (result === 1) {
        yield put({ type: 'GET_ORDERDETAIL',
          payload: {
            orderdetail: _mmStampToTime(data,['reservedate','returndate'],'YYYY/MM/DD'),
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


     // 创建线索
     * EFFECTS_CREATE_CLUE({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
        const usertype = yield select(({layout}) => layout.usertype)
        const data = _mmAddressSplit(_mmTimeToStamp(payload,['sourcedate','reservedate'],'YYYY-MM-DD'), ['province','city','area'])
        data['usertypename'] = usertype.find(item=> item.code === data.usertype)['lableName']
        if ( data['requestKey'] ) {
          yield put(_mmAction('EFFECTS_SERVICE_LIST',{
            start: (1 - 1 ) * 10,
            limit: 10 ,
            userType: data['usertype']
          }))
        } else {
          const { result, obj, msg } = yield call(worktaskmanagementApi.saveClue,data)
          if( data['isDispatch'] ) {
            const { result, errorMessage, returnObject } = yield call(worktaskmanagementApi.dispatchClue,payload)
            if(result){
              message.success('派单成功成功!')
              yield put(_mmAction('IS_SHOWMODAL',{ isShowComModal: false, servicelist:[] }))
              router.go(-1);
            } else {
              message.error(errorMessage)
              yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
            }
          } else {
            if (result === 1 ) {
              message.success('创建线索成功!')
              router.go(-1);
              yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
            } else {
              message.error(msg)
              yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
            }
          }
        }

    },

    // 派单服务列表
    * EFFECTS_SERVICE_LIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const usertype = yield select(({layout}) => layout.usertype)
      const { result, errorMessage, returnObject } = yield call(worktaskmanagementApi.clinicServices,payload)
      if (result) {
        const { rows , total } = returnObject
        rows.forEach(item=> item['serviceTypeName'] = usertype.find(item=> item.code === payload.userType)['lableName'])
        yield put(_mmAction('IS_SHOWMODAL',{ isShowComModal: true }))
        yield put(_mmAction('GET_SERVICELIST',{
          serviceTotal: total,
          servicelist: rows,
          loading: false,
        }))
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      } else {
        message.error(errorMessage)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 派单
    * EFFECTS_CLUE_DISPATCH({payload}, { call, put , select}) {
        const { values } = payload
        values['requestKey'] = ''
        values['isDispatch'] = true
        yield put(_mmAction('EFFECTS_CREATE_CLUE',{...payload,...values}))
    },

    //存储url参数 主要是key
    * EFFECTS_SETURLPARAMS({payload}, { call, put , select}){
      yield put({
        type: 'SET_URLPARAMS',
        payload: {
          urlParams: payload
        }
      })
    },

    * EFFECTS_PAYMENTRECORDS({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj , total, msg  } = yield call(worktaskmanagementApi.paymentRecords, payload)
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

    * EFFECTS_CLEAR_ORDERDETAIL({payload}, { call, put , select}) {
        yield put(_mmAction('GET_PAYMENTRECORDS',{
          paymentRecords: {},
        }))
    },

    * EFFECTS_UPDATE_ISRETURN({payload}, { call, put , select}) {
      const { result, obj , total, msg  } = yield call(worktaskmanagementApi.updateIsReturn, payload)
      if (result === 1) {
        console.log('更新回访成功');
      } else {
        message.error(errorMessage)
      }
    },

  },

  reducers: {
    GET_ORDERDETAIL(state, { payload }) {
      return { ...state, ...payload }
    },
    IS_SHOWLOADING(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_SERVICELIST(state, { payload }) {
      return { ...state, ...payload }
    },
    IS_SHOWMODAL(state, { payload }) {
      return { ...state, ...payload }
    },
    SET_URLPARAMS(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_PAYMENTRECORDS(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
    }
  }

};
