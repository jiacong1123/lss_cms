import { message } from 'antd'
import * as outpatientinfoApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'outpatientinfo',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    cliniclist: [],    // 门诊列表
    clinicid: '',      // 当前门诊id
    currentClinic: {}, // 当前门诊信息
    modalKey: '',      // 当前操作的标识
    total: null,       // 门诊总条数
    currentPage: 1,    // 当前页码
    searchValue: {}    // 搜索条件
  },

  effects: {
    // 获取诊所列表
    * EFFECTS_GET_CLINICLIST({payload}, { call, put, select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ?  yield select(({outpatientinfo}) => outpatientinfo.searchValue) : {}
      const currentPage = yield select(({outpatientinfo}) => outpatientinfo.currentPage)
      const { page } = payload
      const data = _mmAddressSplit({...searchValue,...payload},['province','city','area'])
      const { result, obj , total, msg  } = yield call(outpatientinfoApi.getClinicList, data)
      if (result === 1) {
        yield put(_mmAction('GET_CLINICLIST',{
          cliniclist: obj,
          total,
          currentPage: page ? page : currentPage,
          loading: false,
          currentClinic:{},
          searchValue
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 添加/编辑诊所
    * EFFECTS_SAVE_CLINIC({payload}, { call, put, select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({outpatientinfo}) => outpatientinfo.currentPage)
      const data = _mmAddressSplit(payload,['province','city','area'])
      const { result, msg  } = yield call(outpatientinfoApi.saveClinic, data);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_CLINICLIST',{
          page:currentPage,
          limit: 10
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 获取当前诊所信息
    * EFFECTS_GET_CURRENTCLINIC({payload}, { call, put , select}){
      const cliniclist = yield select(({outpatientinfo}) => outpatientinfo.cliniclist)
      const { clinicid } = payload
      const currentClinic = cliniclist.find(item=>item.clinicid === clinicid )
      yield put({
        type: 'GET_CURRENTCLINIC',
        payload: {
          clinicid,
          currentClinic: _mmAddressConcat(currentClinic,['province','city','area'])
        }
      })
    },
    // 删除诊所
    * EFFECTS_DELETE_CLINIC({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({outpatientinfo}) => outpatientinfo.currentPage)
      const { result, msg  } = yield call(outpatientinfoApi.deleteClinic, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_CLINICLIST',{
          page:currentPage,
          limit: 10
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({outpatientinfo}) => outpatientinfo.searchValue)
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
    GET_CLINICLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTCLINIC(state, { payload }) {
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
    IS_SHOWMODAL(state, { payload }) {
      return { ...state, ...payload }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
         // 路由切换初始化数据
         if ( pathname === '/outpatientmanagement/outpatientinfo'){
           dispatch({
             type: 'EFFECTS_GET_CLINICLIST',
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
