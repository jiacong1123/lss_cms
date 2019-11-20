import { message } from 'antd'
import router from 'umi/router';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as berecycledApi from './service';


export default {
  namespace: 'berecycled',
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
    selectRows_order: [], //批量勾选
    jobordersourcechild: [],
    currentSize: 10,  //每页大小
  },

  effects: {

    // 获取工单列表
    * EFFECTS_GET_ORDERLIST({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = !payload.initEntry ? yield select(({berecycled}) => berecycled.searchValue) : {}
      const currentPage = yield select(({berecycled}) => berecycled.currentPage)
      payload['page'] = payload.page ? payload.page : currentPage
      let  status = null

      if (Object.keys(searchValue).length = 0 || payload.status == undefined) {
        // if (Object.keys(searchValue).length > 0) {
       if (searchValue.status) {
          status = searchValue.status
        } else {
          status = '98'
        }
      } else {
        status = payload.status
      }

      const { result, obj , total, msg  } = yield call(berecycledApi.getOrderList, {...searchValue,...payload, status})
      if (result === 1) {
        yield put(_mmAction('GET_ORDERLIST',{
          orderlist: obj,
          total,
          currentPage: payload.page ? payload.page : currentPage,
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
      const { result , obj , msg} = yield call(berecycledApi.getSourceChild, {tagid, ...payload});
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
      const sourceChildList = yield select(({berecycled}) => berecycled.jobordersourcechild)
      const { tagid2 } = payload
      const sourceChild = sourceChildList.find(item=>item.tagid === tagid2 )
      yield put(_mmAction('GET_SOURCECHILD', {
        sourceChild,
      }))
    },
    // 添加/编辑工单
    * EFFECTS_SAVE_ORDER({payload}, { call, put , select}) {
      const currentPage = yield select(({berecycled}) => berecycled.currentPage)
      const currentSize = yield select(({berecycled}) => berecycled.currentSize)
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const data =  _mmAddressSplit(_mmTimeToStamp(payload,['sourcedate','reservedate']),['province','city'])
      const { result, obj, msg } = yield call(berecycledApi.saveOrder, data);
      if (result === 1 ) {
        yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
          page:currentPage,
          limit: currentSize
        }))
        yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
        yield put(_mmAction('SET_USERID',{userid: '' }))
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
      const { result, obj, msg } = yield call(berecycledApi.getOrderDetail, payload);
      obj['user'] = _mmAddressConcat(_mmStampToTime(obj['user'],['sourcedate'],'YYYY/MM/DD'),['province','city'])
      const res = _mmStampToTime(obj,['reservedate'],'YYYY/MM/DD')
      if (result === 1 ) {
        yield put({
          type: 'GET_CURRENTORDER',
          payload: {
            orderno,
            currentOrder: res,
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
      const { result, obj, msg } = yield call(berecycledApi.judgeUserIsExist, payload);
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
      const searchValue = yield select(({berecycled}) => berecycled.searchValue)
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
    // 设置当前页码
    * EFFECTS_SET_CURRENTPAGE({payload}, { call, put , select}){
      yield put({
        type: 'SET_CURRENTPAGE',
        payload: {
          currentPage: payload
        }
      })
    },

    //点击聊天，在详情里产生聊天记录
   * EFFECT_CREAT_CHATRECORD({payload}, { call, put , select}){
          const { orderno, shopWx, memberNo } = payload
          let remark2 = JSON.stringify(payload)
          const { result, obj, msg } = yield call(berecycledApi.creatChatRecord,
              {orderno, shopWx, memberNo, remark2,...payload}
            );
          if (result === 1) {
            //产生聊天记录成功
          } else {
            message.error(msg)
          }
        },

        //存储勾选的项
        *EFFECTS_SELECTROWS({payload}, { call, put }) {
          yield put(_mmAction('update',{
            selectRows_order: payload,
          }))
        },

        // 批量分配
        * EFFECTS_BATCH_ORDER({payload}, { call, put , select}){
          yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
          const currentPage = yield select(({berecycled}) => berecycled.currentPage)
          const currentSize = yield select(({berecycled}) => berecycled.currentSize)
          const { result, obj, msg } = yield call(berecycledApi.getBatchOrder, payload);
          if (result === 1 ) {
            yield put(_mmAction('EFFECTS_GET_ORDERLIST',{
              page:currentPage,
              limit: currentSize
            }))
            yield put(_mmAction('IS_SHOWMODAL',{visible: false, title: ''}))
            message.success('转移成功!')
          } else {
            message.error(msg)
            yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
          }
        },

        //修改列表客户标签
        * EFFECTS_ONCHANGELABELS({payload}, { call, put , select}){
          const currentPage = yield select(({berecycled}) => berecycled.currentPage)
          const currentSize = yield select(({berecycled}) => berecycled.currentSize)
          yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
          const { result, obj, msg } = yield call(berecycledApi.changeLabels, payload);
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
    update(state, { payload }) {
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
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
          // 路由切换初始化数据
        if ( pathname === '/worktaskmanagement/berecycled'){
          dispatch({
            type: 'EFFECTS_GET_ORDERLIST',
            payload: {
              limit: 10,
              initEntry: false
            }
          })
        }
      })
    }
}

};
