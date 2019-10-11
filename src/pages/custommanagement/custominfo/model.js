import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as custominfoApi from './service';

export default {
  namespace: 'custominfo',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    customlist: [],    // 客户列表
    userid: '',        // 当前客户id
    currentUser: {},   // 当前客户信息
    modalKey: '',      // 当前操作的标识
    total: null,       // 客户总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索条件
    jobordersourcechild:[]
  },

  effects: {
    // 获取客户列表
    * EFFECTS_GET_CUSTOMLIST({payload}, { call, put , select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ?  yield select(({custominfo}) => custominfo.searchValue): {}
      const currentPage = yield select(({custominfo}) => custominfo.currentPage)
      const { page } = payload
      const data = _mmTimeToStamp({...searchValue,...payload},['start','end'],'YYYY/MM/DD')
      const { result, obj, total, msg} = yield call(custominfoApi.getCustomList, data);
      if (result === 1 ) {
        yield put(_mmAction('GET_CUSTOMLIST',{
          customlist: _mmStampToTime(obj,['createtime'],'YYYY/MM/DD HH:mm:ss'),
          total,
          currentPage: page ? page : currentPage ,
          loading: false,
          currentUser:{},
          searchValue
        }));
      }else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    //获取二级来源
    * EFFECTS_GET_SOURCRCHILD({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const {tagid} = payload
      const { result , obj , msg} = yield call(custominfoApi.getSourceChild, {tagid, ...payload});
      if ( result === 1) {
        yield put(_mmAction('GET_JOBORDERSOURCECHILD', {
          jobordersourcechild: obj,
          loading:false,
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      }
    },
    // 存储二级来源
    * EFFECTS_SET_SOURCECHILDNAME({payload}, { call, put , select}){
      const sourceChildList = yield select(({custominfo}) => custominfo.jobordersourcechild)
      const { tagid2 } = payload
      const sourceChild = sourceChildList.find(item=>item.tagid === tagid2 )
      yield put(_mmAction('GET_SOURCECHILD', {
        sourceChild,
      }))
    },

    // 添加/编辑客户
    * EFFECTS_SAVE_CUSTOM({payload}, { call, put , select}) {
      const currentPage = yield select(({custominfo}) => custominfo.currentPage)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(custominfoApi.saveCustom, payload);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_CUSTOMLIST',{
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
    // 获取当前客户信息
    * EFFECTS_GET_CURRENTUSER({payload}, { call, put , select}){
      const customlist = yield select(({custominfo}) => custominfo.customlist)
      const { userid } = payload
      const currentUser = customlist.find(item=>item.userid === userid )
      yield put({
        type: 'GET_CURRENTUSER',
        payload: {
          userid,
          currentUser: _mmAddressConcat(_mmStampToTime(currentUser,['sourcedate'],'YYYY/MM/DD'),['province','city'])
        }
      })
    },

    //删除客户信息
    * EFFECTS_DELETE_CURRENTUSER({payload}, { call, put , select}){
      const { userid } = payload
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(custominfoApi.deleteCurrentUser, {userid,...payload});
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_CUSTOMLIST',{page: 1, limit: 10, initEntry: true }))
        message.success('删除成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({custominfo}) => custominfo.searchValue)
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
    GET_CUSTOMLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_JOBORDERSOURCECHILD(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_SOURCECHILD(state, { payload }) {
      return { ...state, ...payload }
    },
    SET_CURRENTPAGE(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTUSER(state, { payload }) {
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
      return history.listen(({pathname}) => {
        // 路由切换初始化数据
        if ( pathname === '/custommanagement/custominfo'){
          dispatch({
            type: 'EFFECTS_GET_CUSTOMLIST',
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
