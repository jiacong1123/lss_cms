import { message } from 'antd'
import * as cluelibraryApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'cluelibrary',
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
    serviceTotal: null,
    userType: '',
    record:{},
    currentSize: 10,  //每页大小
  },

  effects: {

    * EFFECTS_GET_CLUELIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({cluelibrary}) => cluelibrary.searchValue) : {}
      const currentPage = yield select(({cluelibrary}) => cluelibrary.currentPage)
      const { page } = payload
      const type = 1
      const { result, obj , total, msg  } = yield call(cluelibraryApi.apiClueList, { ...payload , type});
      if (result === 1 ) {
        yield put(_mmAction('UPDATE_STATE',{
          orderlist: _mmStampToTime(obj,['reservedate'],'YYYY/MM/DD'),
          total,
          currentPage: page ? page : currentPage,
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
      const orderlist = yield select(({cluelibrary}) => cluelibrary.orderlist)
      const currentClue = orderlist.find(item=> item.orderno === payload.orderno)
      yield put(_mmAction('UPDATE_STATE',{
        currentClue: _mmAddressConcat(_mmStampToTime(currentClue,['sourcedate'],'YYYY/MM/DD'),['province','city','area'])
      }))
    },

    // 编辑线索
    * EFFECTS_EDIT_CLUE({payload}, { call, put,select }){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({cluelibrary}) => cluelibrary.currentPage)
      const currentClue = yield select(({cluelibrary}) => cluelibrary.currentClue)
      const currentSize = yield select(({cluelibrary}) => cluelibrary.currentSize)
      payload= _mmTimeToStamp(_mmAddressSplit(payload,['province','city','area']),['reservedate'],'YYYY-MM-DD')
      const { result, obj , total, msg  } = yield call(cluelibraryApi.apiEditClue, {...payload, orderno: currentClue.orderno});
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_CLUELIST',{
          page:currentPage,
          limit: currentSize,
        }))
        yield put(_mmAction('IS_SHOWMODAL',{ visible: false, title: ''}))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 获取服务列表
    * EFFECTS_GET_SERVICE({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const usertype = yield select(({layout}) => layout.usertype)
      const record = yield select(({cluelibrary}) => cluelibrary.record)
      const userType = payload.userType ? payload.userType : yield select(({cluelibrary}) => cluelibrary.userType)
      const { result, errorMessage, returnObject } = yield call(cluelibraryApi.clinicServices,{ ...payload,userType})
      if (result) {
        const { rows , total, errorMessage } = returnObject
        rows.forEach(item=> item['serviceTypeName'] = usertype.find(item=> item.code === userType )['lableName'])
        yield put(_mmAction('GET_SERVICELIST',{
          serviceTotal: total,
          servicelist: rows,
          loading: false,
          userType: payload.userType ? payload.userType : userType,
          record: payload.record ? payload.record : record
        }))
      } else {
        message.error(errorMessage)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 派单
    * EFFECTS_CLUE_DISPATCH({payload}, { call, put , select}) {
      const currentPage = yield select(({cluelibrary}) => cluelibrary.currentPage)
      const currentSize = yield select(({cluelibrary}) => cluelibrary.currentSize)
      const { orderno } = yield select(({cluelibrary}) => cluelibrary.record)
      const { result, errorMessage, returnObject } = yield call(cluelibraryApi.dispatchClue,{...payload, orderno})
      if (result) {
       message.success('派单成功成功!')
       yield put(_mmAction('EFFECTS_GET_CLUELIST',{
        page:currentPage,
        limit: currentSize
      }))
       yield put(_mmAction('IS_SHOWMODAL',{visible: false, servicelist:[] }))
     } else {
       message.error(errorMessage)
       yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
     }
   },

    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({cluelibrary}) => cluelibrary.searchValue)
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
    },
    SET_CURRENTSIZE(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // 路由切换初始化数据
        if ( pathname === '/worktaskmanagement/cluelibrary'){
          dispatch({
            type: 'EFFECTS_GET_CLUELIST',
            payload: {
              page:1,
              limit: 10,
              initEntry: true
            }
          })
        }
      })
    }
}

};
