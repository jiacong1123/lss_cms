import { message } from 'antd'
import * as callrecordApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import store from 'store'

export default {
  namespace: 'callrecord',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    callRecordList: [], // 通话记录列表
    orderno: '',       // 当前工单号
    userid: '',        // 客户id
    currentcallRecord: {},  // 当前工单信息
    audioUrl: '' ,   // 录音地址
    playing: false ,  // 播放暂停
    payload: {},
    modalKey: '',      // 当前操作的标识
    total: null,       // 工单总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索条件
    weChatList: [] ,    //微信聊天信息
    merchantNo: '',       // 当前账号merchantNo

    SMSRecordList: [],    //短信消息列表
    empNo: '',
    currentSize: 10,  //每页大小
  },

  effects: {

    * effectsGetCallRecordList({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({callrecord}) => callrecord.searchValue) : {}
      const currentPage = yield select(({callrecord}) => callrecord.currentPage)
      const { page } = payload
      const {  result, obj ,total,msg } = yield call(callrecordApi.getCallRecordList, payload);
      if (result === 1) {
        yield put(_mmAction('update',{
          callRecordList: obj,
          total,
          currentPage: page ? page : currentPage,
          loading: false,
          currentcallRecord:{},
          searchValue
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('update',{loading: false}))
      }
    },

    * effectsPlayAduio({payload}, { call, put , select}) {
      const currentPayload = yield select(({callrecord}) => callrecord.payload)
      const callRecordList = yield select(({callrecord}) => callrecord.callRecordList)
      const { id, lssRecordUrl, recordingUrl } =  payload ? payload : currentPayload
      yield put(_mmAction('update',{
         audioUrl: lssRecordUrl || recordingUrl,
         playing: true,
         payload,
         callRecordList:callRecordList.map(item=> item.id === id ? ({...item, isPlay: true}) : {...item,isPlay:false})
      }))
    },

    * effectsPauseAudio({payload}, { call, put , select}) {
      const currentPayload = yield select(({callrecord}) => callrecord.payload)
      const callRecordList = yield select(({callrecord}) => callrecord.callRecordList)
      const { id, lssRecordUrl, recordingUrl } = payload ? payload : currentPayload
      yield put(_mmAction('update',{
         audioUrl: lssRecordUrl || recordingUrl,
         playing: false,
         callRecordList:callRecordList.map(item=> item.id === id ? ({...item, isPlay: false}) :  {...item,isPlay:false})
      }))
    },

    * effectsCloseAudio({payload}, { call, put , select}) {
      const callRecordList = yield select(({callrecord}) => callrecord.callRecordList)
      yield put(_mmAction('update',{
        audioUrl: '',
        playing: false,
        callRecordList:callRecordList.map(item=> ({...item,isPlay:false}))
     }))
   },

   * effectsGetWeChatList({payload}, { call, put,select }) {
       yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
       const userinfo = store.get('userinfo')
       const merchantNo = userinfo.guidMember.memberNoMerchant
       const searchValue = !payload.initEntry ? yield select(({callrecord}) => callrecord.searchValue) : {}
       const currentPage = yield select(({callrecord}) => callrecord.currentPage)
       const { page } = payload
       const {  result, obj, total, errorMessage, returnObject } = yield call(callrecordApi.getWeChatList, {merchantNo,...payload});
       console.log(returnObject)
       if (result) {
         yield put(_mmAction('update',{
           weChatList: returnObject.rows,
           total: returnObject.total,
           currentPage: returnObject.start ? returnObject.start : currentPage,
           loading: false,
           currentcallRecord:{},
           searchValue
         }))
       } else {
         message.error(errorMessage)
         yield put(_mmAction('update',{loading: false}))
       }
     },

     * effectsGetSMSRecordList({payload}, { call, put,select }) {
       yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
       const searchValue = !payload.initEntry ? yield select(({callrecord}) => callrecord.searchValue) : {}
       const currentPage = yield select(({callrecord}) => callrecord.currentPage)
       const { page } = payload
       const {  result, obj ,total,msg } = yield call(callrecordApi.getSMSList, payload);
       if (result === 1) {
         yield put(_mmAction('update',{
           SMSRecordList: obj,
           total,
           currentPage: page ? page : currentPage,
           loading: false,
           currentcallRecord:{},
           searchValue
         }))
       } else {
         message.error(msg)
         yield put(_mmAction('update',{loading: false}))
       }
     },
     // 获取搜索参数
     * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
       const searchValue = yield select(({callrecord}) => callrecord.searchValue)
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
     //设置当前每一页大小
     * EFFECTS_SET_CURRENTSIZE({payload}, { call, put , select}){
       yield put({
         type: 'SET_CURRENTSIZE',
         payload: {
           currentSize: payload
         }
       })
     },


  },

  reducers: {
    update(state, { payload }) {
      return { ...state, ...payload }
    },
    RESET_SEARCHVALUE(state, { payload }){
      return { ...state, ...payload }
    },
    SET_CURRENTPAGE(state, { payload }) {
      return { ...state, ...payload }
    },
    SET_CURRENTSIZE(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname }) => {
            // 路由切换初始化数据
            if ( pathname === '/worktaskmanagement/callrecord'){
              dispatch({
                type: 'effectsGetCallRecordList',
                payload: {
                  limit: 10,
                  initEntry: true
                }
              })
            }
        })
      }
  }

};
