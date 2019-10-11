import { message } from 'antd'
import BraftEditor from 'braft-editor'
import * as proinfoApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'proinfo',
  state: {
    loading: false,      // 加载动画
    visible: false,      // 控制modal显示
    title: '',           // modal的标题
    prolist: [],         // 产品列表
    pid: '',             // 当前产品id
    currentPro: {},      // 当前产品信息
    modalKey: '',        // 当前操作的标识
    total: null,         // 产品总条数
    currentPage: 1,      // 当前页码
    searchValue: {},     // 搜索条件
    editorState: ''      // 富文本内容
  },
  effects: {
    // 获取产品列表
    * EFFECTS_GET_PROLIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({proinfo}) => proinfo.searchValue) : {}
      const currentPage = yield select(({proinfo}) => proinfo.currentPage)
      const { page } = payload
      const { result, obj , total, msg  } = yield call(proinfoApi.apiProList, {...searchValue,...payload})
      if (result === 1) {
        yield put(_mmAction('GET_PROLIST',{
          prolist: obj,
          total,
          currentPage: page ? page : currentPage,
          loading: false,
          currentPro:{},
          searchValue
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 添加/编辑动态
    * EFFECTS_SAVE_PRO({payload}, { call, put, select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({proinfo}) => proinfo.currentPage)
      const { result, msg  } = yield call(proinfoApi.apiSavePro, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_PROLIST',{
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
    // 获取当前动态信息
    * EFFECTS_GET_CURRENTPRO({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { pid } = payload
      const { result, msg ,obj } = yield call(proinfoApi.apiGetProDetail, payload);
      if (result === 1) {
        yield put({
          type: 'GET_CURRENTPRO',
          payload: {
            pid,
            currentPro: obj,
            editorState: obj['details'],
            loading: false
          }
        })
        payload.callback()
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 启用/禁用/删除动态
    * EFFECTS_OPER_PRO({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({proinfo}) => proinfo.currentPage)
      const { result, msg  } = yield call(proinfoApi.apiOperPro, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_PROLIST',{
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
      const searchValue = yield select(({proinfo}) => proinfo.searchValue)
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
    GET_PROLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTPRO(state, { payload }) {
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
        if ( pathname === '/promanagement/proinfo'){
          dispatch({
            type: 'EFFECTS_GET_PROLIST',
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
