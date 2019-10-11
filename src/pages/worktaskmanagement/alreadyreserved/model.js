import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as alreadyreservedApi from './service';

export default {
  namespace: 'alreadyreserved',
  state: {
    loading: false,    // 加载动画
    visible: false,    // 控制modal显示
    title: '',         // modal的标题
    orderlist: [],     // 工单列表
    orderno: '',       // 当前工单号
    currentOrder: {},  // 当前工单信息
    modalKey: '',      // 当前操作的标识
    total: null,       // 工单总条数
    currentPage: 1,    // 当前页码
    searchValue: {},    // 搜索条件
    jobordersourcechild: []
  },

  effects: {
    // 获取工单列表
    * EFFECTS_GET_ORDERLIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({alreadyreserved}) => alreadyreserved.searchValue) :{}
      const currentPage = yield select(({alreadyreserved}) => alreadyreserved.currentPage)
      payload['page'] = payload.page ? payload.page : currentPage
      const status = 2
      const data = _mmTimeToStamp({...searchValue,...payload, status},['start','end'],'YYYY/MM/DD')
      const { result, obj , total, msg  } = yield call(alreadyreservedApi.getOrderList, data)
      if (result === 1) {
        yield put(_mmAction('GET_ORDERLIST',{
          orderlist: _mmStampToTime(obj,['returndate','reservedate'],'YYYY/MM/DD'),
          total,
          currentPage:  payload.page ?  payload.page : currentPage,
          loading: false,
          currentOrder:{},
          searchValue
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    //获取二级来源
    * EFFECTS_GET_SOURCRCHILD({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const {tagid} = payload
      const { result , obj , msg} = yield call(alreadyreservedApi.getSourceChild, {tagid, ...payload});
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
      const sourceChildList = yield select(({alreadyreserved}) => alreadyreserved.jobordersourcechild)
      const { tagid2 } = payload
      const sourceChild = sourceChildList.find(item=>item.tagid === tagid2 )
      yield put(_mmAction('GET_SOURCECHILD', {
        sourceChild,
      }))
    },
    // 添加/编辑工单
    * EFFECTS_SAVE_ORDER({payload}, { call, put , select}) {
      const currentPage = yield select(({alreadyreserved}) => alreadyreserved.currentPage)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const data =  _mmAddressSplit(_mmTimeToStamp(payload,['sourcedate']),['province','city'])
      const { result, obj, msg } = yield call(alreadyreservedApi.saveOrder, data);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
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
    // 获取当前工单详情
    * EFFECTS_GET_CURRENTORDER({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { orderno } = payload
      const { result, obj, msg } = yield call(alreadyreservedApi.getOrderDetail, payload);
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
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 检索客户是否存在
    * EFFECTS_JUDGE_USERISEXIST({payload}, { call, put , select}){
      const { result, obj, msg } = yield call(alreadyreservedApi.judgeUserIsExist, payload);
      if (result === 1 ) {
        if (obj) {
          message.error(obj.msg)
        }
      } else {
        message.error(msg)
      }
    },
    // 获取搜索参数
    * EFFECTS_GET_SEARCHVALUE({payload}, { call, put , select}){
      const searchValue = yield select(({alreadyreserved}) => alreadyreserved.searchValue)
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
    //修改列表客户标签
    * EFFECTS_ONCHANGELABELS({payload}, { call, put , select}){
      const currentPage = yield select(({alreadyreserved}) => alreadyreserved.currentPage)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(alreadyreservedApi.changeLabels, payload);
      if (result === 1 ) {
        message.success('编辑标签成功!')

        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{ page:currentPage, limit: 10 }))

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
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // 路由切换初始化数据
        if ( pathname === '/worktaskmanagement/alreadyreserved'){
          const { type } = history.location.query
          const start = new Date()
          if(type == 'checkAlreadyReserved') {  //预约提醒查看
            dispatch({
              type: 'EFFECTS_GET_ORDERLIST',
              payload: {
                limit: 10,
                initEntry: false,
                start: start,
                end: start,
              }
            })
          } else {  //左侧路由切换
            dispatch({
              type: 'EFFECTS_GET_ORDERLIST',
              payload: {
                limit: 10,
                initEntry: false
              }
            })
          }


        }
      })
    }
}

};
