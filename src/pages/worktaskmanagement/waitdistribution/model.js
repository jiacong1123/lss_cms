import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as waitdistributionApi from './service';

export default {
  namespace: 'waitdistribution',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    orderlist: [],     // 工单列表
    orderno: '',       // 当前工单号
    userid: '',        // 客户id
    currentOrder: {},  // 当前工单信息
    modalKey: '',      // 当前操作的标识
    total: null,       // 工单总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索条件
    jobordersourcechild:[],
    userTags:[],
    currentSize: 10,  //每页大小
  },

  effects: {
    // 获取工单列表
    * EFFECTS_GET_ORDERLIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({waitdistribution}) => waitdistribution.searchValue) : {}
      const currentPage = yield select(({waitdistribution}) => waitdistribution.currentPage)
      const { page } = payload
      currentPage ? payload.page = currentPage : payload.page
      const status = 0
      const { result, obj , total, msg  } = yield call(waitdistributionApi.getOrderList, {...searchValue,...payload, status})
      if (result === 1) {
        yield put(_mmAction('GET_ORDERLIST',{
          orderlist: obj,
          total,
          currentPage: currentPage ? currentPage : page,
          loading: false,
          currentOrder:{},
          searchValue
        }))
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    //获取二级来源
    * EFFECTS_GET_SOURCRCHILD({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const {tagid} = payload
      const { result , obj , msg} = yield call(waitdistributionApi.getSourceChild, {tagid, ...payload});
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
      const sourceChildList = yield select(({waitdistribution}) => waitdistribution.jobordersourcechild)
      const { tagid2 } = payload
      const sourceChild = sourceChildList.find(item=>item.tagid === tagid2 )
      yield put(_mmAction('GET_SOURCECHILD', {
        sourceChild,
      }))
    },
    // 添加/编辑工单
    * EFFECTS_SAVE_ORDER({payload}, { call, put , select}) {
      const currentPage = yield select(({waitdistribution}) => waitdistribution.currentPage)
      const currentSize = yield select(({waitdistribution}) => waitdistribution.currentSize)
      const userTags = yield select(({waitdistribution}) => waitdistribution.userTags)
      let lablenames = ''
      let userLabes = []
      if (Object.keys(userTags).length > 0) {
        for(var i in userTags){
          userLabes.push(userTags[i])
        }
        lablenames = userLabes.join(',')
      }

      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const data =  _mmAddressSplit(_mmTimeToStamp(payload,['sourcedate']),['province','city'])
      data.lablenames = lablenames

      const { result, obj, msg } = yield call(waitdistributionApi.saveOrder, data);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: currentSize
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        yield put(_mmAction('SET_USERID',{userid: '' }))
        yield put(_mmAction('SET_USERTAGS',{userTags: [] }))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 获取当前工单详情
    * EFFECTS_GET_CURRENTORDER({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { orderno } = payload
      const { result, obj, msg } = yield call(waitdistributionApi.getOrderDetail, payload);
      obj['user'] = _mmAddressConcat(_mmStampToTime(obj['user'],['sourcedate'],'YYYY/MM/DD'),['province','city'])
      if (result === 1 ) {
        yield put({
          type: 'GET_CURRENTORDER',
          payload: {
            orderno,
            currentOrder: obj,
            loading:false
          }
        })
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 批量分配
    * EFFECTS_BATCH_ORDER({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({waitdistribution}) => waitdistribution.currentPage)
      const currentSize = yield select(({waitdistribution}) => waitdistribution.currentSize)
      const { result, obj, msg } = yield call(waitdistributionApi.getBatchOrder, payload);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: currentSize
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        message.success('分配成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 检索客户是否存在
    * EFFECTS_JUDGE_USERISEXIST({payload}, { call, put , select}){
      const { result, obj, msg } = yield call(waitdistributionApi.judgeUserIsExist, payload);
      if (result === 1 ) {
        if (obj && obj.msg) {
          message.error(obj.msg)
        }
        if ( obj && !obj.msg){
          yield put(_mmAction('SET_USERID',{
            userid: obj.userid
          }))
        }
      } else {
        message.error(msg)
      }
    },
    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({waitdistribution}) => waitdistribution.searchValue)
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

    //存储标签
    * EFFECTS_SET_USERTAGS({payload}, { call, put , select}){
      yield put({
        type: 'SET_USERTAGS',
        payload: {
          userTags: payload
        }
      })
    },

    //修改列表客户标签
    * EFFECTS_ONCHANGELABELS({payload}, { call, put , select}){
      const currentPage = yield select(({waitdistribution}) => waitdistribution.currentPage)
      const currentSize = yield select(({allworktask}) => allworktask.currentSize)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(waitdistributionApi.changeLabels, payload);
      if (result === 1 ) {
        message.success('编辑标签成功!')

        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{ page:currentPage, limit: currentSize }))

      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
  },

  reducers: {
    GET_ORDERLIST(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTORDER(state, { payload }) {
      return { ...state, ...payload }
    },
    SET_USERID(state, { payload }){
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
    },
    GET_JOBORDERSOURCECHILD(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_SOURCECHILD(state, { payload }) {
      return { ...state, ...payload }
    },
    SET_USERTAGS(state, { payload }) {
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
        if ( pathname === '/worktaskmanagement/waitdistribution'){
          dispatch({
            type: 'EFFECTS_GET_ORDERLIST',
            payload: {
              page:1,
              limit: 10,
              initEntry: false
            }
          })
        }
      })
    }
}

};
