import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as allworktaskApi from './service';

export default {
  namespace: 'allworktask',
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
    selectedList: [],
    currentSize: 10,  //每页大小
  },

  effects: {
    // 获取工单列表
    * EFFECTS_GET_ORDERLIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({allworktask}) => allworktask.searchValue) : {}
      const currentPage = yield select(({allworktask}) => allworktask.currentPage)
      const {page} = payload
      currentPage ? payload.page = currentPage : payload.page

      let  status = null

      if (Object.keys(searchValue).length = 0 || payload.status == undefined) {
        // if (Object.keys(searchValue).length > 0) {
       if (searchValue.status) {
          status = searchValue.status
        } else {
          status = '99'
        }
      } else {
        status = payload.status
      }
      // const data = _mmTimeToStamp({...searchValue,...payload, status},['sourcedateStart','sourcedateEnd'],'YYYY/MM/DD')
      const { result, obj , total, msg  } = yield call(allworktaskApi.getOrderList, {...searchValue,...payload, status})
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
      const { result , obj , msg} = yield call(allworktaskApi.getSourceChild, {tagid, ...payload});
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
      const sourceChildList = yield select(({allworktask}) => allworktask.jobordersourcechild)
      const { tagid2 } = payload
      const sourceChild = sourceChildList.find(item=>item.tagid === tagid2 )
      yield put(_mmAction('GET_SOURCECHILD', {
        sourceChild,
      }))
    },
    // 添加/编辑工单
    * EFFECTS_SAVE_ORDER({payload}, { call, put , select}) {
      const currentPage = yield select(({allworktask}) => allworktask.currentPage)
      const currentSize = yield select(({allworktask}) => allworktask.currentSize)
      const userTags = yield select(({allworktask}) => allworktask.userTags)
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

      const { result, obj, msg } = yield call(allworktaskApi.saveOrder, data);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: currentSize,
          status:'99'
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
      const { result, obj, msg } = yield call(allworktaskApi.getOrderDetail, payload);
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
      const currentPage = yield select(({allworktask}) => allworktask.currentPage)
      const currentSize = yield select(({allworktask}) => allworktask.currentSize)
      const { result, obj, msg } = yield call(allworktaskApi.getBatchOrder, payload);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: currentSize,
          status: '99'
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
      const { result, obj, msg } = yield call(allworktaskApi.judgeUserIsExist, payload);
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
      const searchValue = yield select(({allworktask}) => allworktask.searchValue)
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
            currentPage: 1,
            currentSize: 10,
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

    //清空标签
    * EFFECTS_CLEAR_LABELS({payload}, { call, put , select}){
      yield put({
        type: 'SET_USERTAGS',
        payload: {
          userTags: []
        }
      })
    },
    //修改列表客户标签
    * EFFECTS_ONCHANGELABELS({payload}, { call, put , select}){

      const currentPage = yield select(({allworktask}) => allworktask.currentPage)
      const currentSize = yield select(({allworktask}) => allworktask.currentSize)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(allworktaskApi.changeLabels, payload);
      if (result === 1 ) {
        message.success('编辑标签成功!')
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{ page:currentPage, limit: currentSize, status: '99' }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 激活工单
    * EFFECTS_ACTIVE_ORDER({payload}, { call, put , select}){
      const currentPage = yield select(({allworktask}) => allworktask.currentPage)
      const currentSize = yield select(({allworktask}) => allworktask.currentSize)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(allworktaskApi.activationDetail, payload);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: currentSize,
          status: '99'
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },


    * EFFECTS_ONSAVE_SELECTED({payload}, { call, put , select}){
      yield put({
        type: 'SET_SELECTEDLIST',
        payload: {
          selectedList: payload
        }
      })
    },

      //批量共享客户
      * EFFECTS_SHARINGCUSTOMER ({payload}, { call, put , select}){
        let adminids = []
        let adminNames = ''
        let arr2 = []
        payload.adminid.forEach( e => {
          adminids.push(e.key)
          arr2.push(e.label)
        })
        adminNames = arr2.join(',')
        const currentPage = yield select(({allworktask}) => allworktask.currentPage)
        const currentSize = yield select(({allworktask}) => allworktask.currentSize)
        yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
        const { result, obj, msg } = yield call(allworktaskApi.sharingOrder, {...payload, adminids, adminNames});
        if (result === 1 ) {
          yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
            page:currentPage,
            limit: currentSize,
            status: '99'
          }))
          yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
          message.success('操作成功!')
        } else {
          message.error(msg)
          yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
        }
      },



    //收费登记
    * EFFECTS_CHARGESAVE({payload}, { call, put , select}){
      const currentSize = yield select(({allworktask}) => allworktask.currentSize)
      let data = _mmTimeToStamp(payload,['payTime'],'YYYY/MM/DD')
      const { result, obj, msg } = yield call(allworktaskApi.chargeSave, data);
      if (result === 1 ) {
        message.success('收费登记成功!')
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{ page:currentPage, limit: currentSize, status: '99' }))
      } else {
        message.error(msg)
      }
    },

    //批量关闭工单
    * EFFECTS_CLOSE_ORDER ({payload}, { call, put , select}){
      let ordernos = payload.ordernos ? payload.ordernos.join(',') : ''
      const currentPage = yield select(({allworktask}) => allworktask.currentPage)
      const currentSize = yield select(({allworktask}) => allworktask.currentSize)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(allworktaskApi.closeOrder, {...payload,ordernos});
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: currentSize,
          status: '99'
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        message.success('操作成功!')
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    //发送短信
    * EFFECTS_SENDMESSAGE({payload}, { call, put , select}){
      const currentPage = yield select(({allworktask}) => allworktask.currentPage)
      const currentSize = yield select(({allworktask}) => allworktask.currentSize)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(allworktaskApi.sendMessage, {...payload});
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: currentSize,
          status: '99'
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        message.success(msg,5)
      } else {
        message.error(msg,5)
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
    SET_SELECTEDLIST(state, { payload }) {
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
        if ( pathname === '/worktaskmanagement/allworktask'){
          dispatch({
            type: 'EFFECTS_GET_ORDERLIST',
            payload: {
              page:1,
              limit: 10,
              initEntry: false,
            }
          })
        }
      })
    }
}

};
