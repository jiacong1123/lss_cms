import { message } from 'antd'
import BraftEditor from 'braft-editor'
import * as activemanagementApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'activemanagement',
  state: {
    loading: false,      // 加载动画
    visible: false,      // 控制modal显示
    title: '',           // modal的标题
    avtivelist: [],      // 活动列表
    actid: '',           // 当前活动id
    currentActive: {},   // 当前活动信息
    modalKey: '',        // 当前操作的标识
    total: null,         // 新闻总条数
    currentPage: 1,      // 当前页码
    searchValue: {},     // 搜索条件
    editorState: ''      // 富文本内容
  },

  effects: {
    // 获取活动列表
    * EFFECTS_GET_ACTIVELIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({activemanagement}) => activemanagement.currentPage)
      const { page } = payload
      const { result, obj , total, msg  } = yield call(activemanagementApi.apiActiveList, payload)
      if (result === 1) {
        yield put(_mmAction('GET_ACTIVELIST',{
          avtivelist: _mmStampToTime(obj,['start','end'],'YYYY/MM/DD HH:mm:ss'),
          total,
          currentPage: page ? page : currentPage,
          loading: false,
          currentActive:{}
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 添加/编辑动态
    * EFFECTS_SAVE_ACTIVE({payload}, { call, put, select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({activemanagement}) => activemanagement.currentPage)
      const data = _mmTimeToStamp(payload,['start','end'],'YYYY/MM/DD HH:mm:ss')
      const { result, msg  } = yield call(activemanagementApi.apiSaveActive, data);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_ACTIVELIST',{
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
    // 获取当前活动信息
    * EFFECTS_GET_CURRENTACTIVE({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { actid } = payload
      const { result, msg ,obj } = yield call(activemanagementApi.apiGetActiveDetail, payload);
      if (result === 1) {
        yield put({
          type: 'GET_CURRENTACTIVE',
          payload: {
            actid,
            currentActive: _mmStampToTime(obj,['start','end'],'YYYY/MM/DD HH:mm:ss'),
            editorState: obj['content'],
            loading: false
          }
        })
        payload.callback()
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 启用/禁用/删除活动
    * EFFECTS_OPER_ACTIVE({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({activemanagement}) => activemanagement.currentPage)
      const { result, msg  } = yield call(activemanagementApi.apiOperActive, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_ACTIVELIST',{
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
    GET_ACTIVELIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTACTIVE(state, { payload }) {
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
        if ( pathname === '/operatemanagement/activemanagement'){
          dispatch({
            type: 'EFFECTS_GET_ACTIVELIST',
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
