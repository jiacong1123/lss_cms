import { message } from 'antd'
import BraftEditor from 'braft-editor'
import * as OralAnApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'OralAn',
  state: {
    loading: false,      // 加载动画
    visible: false,      // 控制modal显示
    title: '',           // modal的标题
    newslist: [],        // 新闻列表
    id: '',              // 当前新闻id
    currentNews: {},     // 当前新闻信息
    modalKey: '',        // 当前操作的标识
    total: null,         // 新闻总条数
    currentPage: 1,      // 当前页码
    searchValue: {},     // 搜索条件
    editorState: ''      // 富文本内容
  },

  effects: {
    // 获取动态列表
    * EFFECTS_GET_NEWSLIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = yield select(({OralAn}) => OralAn.searchValue)
      const currentPage = yield select(({OralAn}) => OralAn.currentPage)
      const { page } = payload
      const { result, obj , total, msg  } = yield call(OralAnApi.getOralList, {...searchValue,...payload})
      if (result === 1) {
        yield put(_mmAction('GET_NEWSLIST',{
          newslist: _mmStampToTime(obj,['createtime'],'YYYY/MM/DD HH:mm:ss'),
          total,
          currentPage: page ? page : currentPage,
          loading: false,
          currentNews:{}
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 添加/编辑动态
    * EFFECTS_SAVE_NEWS({payload}, { call, put, select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({OralAn}) => OralAn.currentPage)
      const { result, msg  } = yield call(OralAnApi.saveBaike, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_NEWSLIST',{
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
    * EFFECTS_GET_CURRENTNEWS({payload}, { call, put , select}){
      const { id } = payload
      const { page } = payload
      const { result, obj , total, msg  } = yield call(OralAnApi.getOralDetail, {...id,...payload})
      yield put(_mmAction('GET_CURRENTNEWS',{
        currentNews: obj
      }))
    },

    // 启用/禁用/删除动态
    * EFFECTS_OPER_NEWS({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({OralAn}) => OralAn.currentPage)
      const { result, msg  } = yield call(OralAnApi.operNews, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_NEWSLIST',{
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
    GET_NEWSLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTNEWS(state, { payload }) {
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
        if ( pathname === '/operatemanagement/OralAn'){
          dispatch({
            type: 'EFFECTS_GET_NEWSLIST',
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
