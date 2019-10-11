import { message } from 'antd'
import * as doctormanagementApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'doctormanagement',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    doctorlist: [],    // 医生列表
    doctorid: '',      // 当前医生id
    currentDoctor: {}, // 当前医生信息
    modalKey: '',      // 当前操作的标识
    total: null,       // 医生总条数
    currentPage: 1,    // 当前页码
    searchValue: {}    // 搜索条件
  },

  effects: {
    // 获取医生列表
    * EFFECTS_GET_DOCTORLIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({doctormanagement}) => doctormanagement.searchValue) : {}
      const currentPage = yield select(({doctormanagement}) => doctormanagement.currentPage)
      const { page } = payload
      const { result, obj , total, msg  } = yield call(doctormanagementApi.getDoctorList, {...searchValue,...payload})
      if (result === 1) {
        yield put(_mmAction('GET_DOCTORLIST',{
          doctorlist: obj,
          total,
          currentPage: page ? page : currentPage,
          loading: false,
          currentDoctor:{},
          searchValue
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 添加/编辑医生
    * EFFECTS_SAVE_DOCTOR({payload}, { call, put, select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({doctormanagement}) => doctormanagement.currentPage)
      const { result, msg  } = yield call(doctormanagementApi.saveDoctor, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_DOCTORLIST',{
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
    // 获取当前医生信息
    * EFFECTS_GET_CURRENTDOCTOR({payload}, { call, put , select}){
      const doctorlist = yield select(({doctormanagement}) => doctormanagement.doctorlist)
      const { doctorid } = payload
      const currentDoctor = doctorlist.find(item=>item.doctorid === doctorid )
      yield put({
        type: 'GET_CURRENTDOCTOR',
        payload: {
          doctorid,
          currentDoctor
        }
      })
    },
    // 删除医生
    * EFFECTS_DELETE_DOCTOR({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({doctormanagement}) => doctormanagement.currentPage)
      const { result, msg  } = yield call(doctormanagementApi.deleteDoctor, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_DOCTORLIST',{
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
      const searchValue = yield select(({doctormanagement}) => doctormanagement.searchValue)
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
    GET_DOCTORLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTDOCTOR(state, { payload }) {
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
         if ( pathname === '/outpatientmanagement/doctormanagement'){
          dispatch({
            type: 'EFFECTS_GET_DOCTORLIST',
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
