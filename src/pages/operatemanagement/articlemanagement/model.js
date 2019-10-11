import { message } from 'antd'
import * as articlemanagementApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'articlemanagement',
  state: {
    loading: false,     // 加载动画
    visible: false,     // 控制modal显示
    title: '',          // modal的标题
    sciencelist: [],    // 文章列表
    id: '',             // 当前文章id
    currentScience: {}, // 当前文章信息
    modalKey: '',       // 当前操作的标识
    total: null,        // 文章总条数
    currentPage: 1,     // 当前页码
    searchValue: {}     // 搜索条件
  },

  effects: {

    // 获取文章列表
    * EFFECTS_GET_SCIENCELIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = yield select(({articlemanagement}) => articlemanagement.searchValue)
      const currentPage = yield select(({articlemanagement}) => articlemanagement.currentPage)
      const { page } = payload
      const { result, obj , total, msg  } = yield call(articlemanagementApi.getScienceList, {...searchValue,...payload})
      if (result === 1) {
        yield put(_mmAction('GET_SCIENCELIST',{
          sciencelist: _mmStampToTime(obj,['answertime'], 'YYYY/MM/DD HH:mm:ss'),
          total,
          currentPage: page ? page : currentPage,
          loading: false,
          currentScience:{}
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 添加/编辑文章
    * EFFECTS_SAVE_SCIENCE({payload}, { call, put, select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({articlemanagement}) => articlemanagement.currentPage)
      const data = _mmTimeToStamp(payload,['answertime'], 'YYYY/MM/DD')
      const { result, msg  } = yield call(articlemanagementApi.saveScience, data);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_SCIENCELIST',{
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
    // 获取当前文章信息
    * EFFECTS_GET_CURRENTSCIENCE({payload}, { call, put , select}){
      const sciencelist = yield select(({articlemanagement}) => articlemanagement.sciencelist)
      const { id } = payload
      const currentScience = sciencelist.find(item=>item.id === id )
      yield put({
        type: 'GET_CURRENTSCIENCE',
        payload: {
          id,
          currentScience
        }
      })
      yield put({
        type: 'layout/EFFECTS_GET_DOCTORDROPMENU',
        payload: {
          clinicid: currentScience.clinicid
        }
      })
    },
    // 启用/禁用/删除文章
    * EFFECTS_OPER_SCIENCE({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({articlemanagement}) => articlemanagement.currentPage)
      const { result, msg  } = yield call(articlemanagementApi.operScience, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_SCIENCELIST',{
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
    }
  },

  reducers: {
    GET_SCIENCELIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTSCIENCE(state, { payload }) {
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
        if ( pathname === '/operatemanagement/articlemanagement'){
          dispatch({
            type: 'EFFECTS_GET_SCIENCELIST',
            payload: {
              page:1,
              limit: 10
            }
          })
        }
      })
    }
}

};
