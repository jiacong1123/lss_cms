import router from 'umi/router'
import { message } from 'antd'
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'
import * as handleworktaskApi from './service';
import moment from 'moment'
const parentNamespace = 'worktaskmanagement'

export default {
  namespace: 'handleworktask',
  state: {
    loading: false,
    orderdetail: {},
  },

  effects: {
    // 获取工单信息
    * EFFECTS_GET_ORDERDETAIL({payload}, { call, put }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj ,msg} = yield call(handleworktaskApi.getOrderDetail, payload);
      obj['user'] =  _mmStampToTime(obj['user'],['sourcedate'],'YYYY/MM/DD')
      obj['user'] =  _mmStampToTime(obj['user'],['createtime'],'YYYY/MM/DD HH:mm:ss')
      obj['records'] = _mmStampToTime(obj['records'],['time'],'YYYY/MM/DD HH:mm:ss')
      const data =  _mmStampToTime(obj,['createtime'],'YYYY/MM/DD HH:mm:ss')
      if (result === 1) {
        yield put({ type: 'GET_ORDERDETAIL',
          payload: {
            orderdetail: _mmStampToTime(data,['reservedate','returndate'],'YYYY/MM/DD'),
            loading:false,
            orderno: payload.orderno,
        }})
        yield put({ type: 'layout/EFFECTS_GET_PERSONNAL',
          payload: {
            roleid: 6,
            clinicid: obj.clinicid,
          }})
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },

    // 立即预约
    * EFFECTS_RESERVE_ORDER({payload}, { call, put,  select }) {
      const urlParams = yield select(({worktaskmanagement}) => worktaskmanagement.urlParams)

      // const orderno = yield select(({worktaskmanagement}) => worktaskmanagement.orderno)
      const orderno = urlParams.orderno
      yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: true}))
      const data = _mmTimeToStamp(payload,['reservedate','returndate'],'YYYY/MM/DD HH:mm:ss')
      const { result, obj ,msg} = yield call(handleworktaskApi.reserveOrder, {orderno, ...data});
      if (result === 1) {
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
        /*
        *   20190827新需求
        *   无需跳转处理结果页 返回列表
        *   20190918新需求
        *   处理完保持在当前页面
        */
        if (urlParams.key == 1) {
          if (urlParams.type == 'returnVisit') {
            router.push({ pathname: '/worktaskmanagement/returnvisit' })
          } else if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if (urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/waitfollowup' })
          }
        } else if (urlParams.key == 2) {
          router.push({ pathname: '/worktaskmanagement/alreadyreserved' })
        } else if (urlParams.key == 3) {
          router.push({ pathname: '/worktaskmanagement/alreadyshop' })
        } else if (urlParams.key == 10) {
          router.push({ pathname: '/worktaskmanagement/newdistribution' })
        }
          message.success('操作成功!',3)

      } else {
        message.error(msg)
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
      }
    },
    // 回访跟进
    * EFFECTS_FOLLOW_ORDER({payload}, { call, put,  select }) {
      const urlParams = yield select(({worktaskmanagement}) => worktaskmanagement.urlParams)
      // const orderno = yield select(({worktaskmanagement}) => worktaskmanagement.orderno)
      const orderno = urlParams.orderno
      yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: true}))
      if(payload.returndate) {
        payload.returndate = moment(payload.returndate).valueOf()
      }
      const { result, obj ,msg} = yield call(handleworktaskApi.followOrder, {orderno, ...payload});
      if (result === 1) {
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
        /*
        *   20190827新需求
        *   无需跳转处理结果页
        *   20190918新需求
        *   处理完保持在当前页面
        */
        if (urlParams.key == 1) {
          if (urlParams.type == 'returnVisit') {
            router.push({ pathname: '/worktaskmanagement/returnvisit' })
          } else if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if (urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/waitfollowup' })
          }
        } else if (urlParams.key == 2) {
          router.push({ pathname: '/worktaskmanagement/alreadyreserved' })
        } else if (urlParams.key == 3) {
          router.push({ pathname: '/worktaskmanagement/alreadyshop' })
        } else if (urlParams.key == 10) {
          router.push({ pathname: '/worktaskmanagement/newdistribution' })
        }
        message.success('操作成功!',3)
      } else {
        message.error(msg)
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
      }
    },
    // 关闭工单
    * EFFECTS_CLOSE_ORDER({payload}, { call, put,  select }) {
      const urlParams = yield select(({worktaskmanagement}) => worktaskmanagement.urlParams)
      // const orderno = yield select(({worktaskmanagement}) => worktaskmanagement.orderno)
      const orderno = urlParams.orderno
      yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: true}))
      const data = _mmTimeToStamp(payload,['reservedate','returndate'],'YYYY/MM/DD HH:mm:ss')
      const { result, obj ,msg} = yield call(handleworktaskApi.closeOrder, {orderno, ...data});
      if (result === 1) {
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
        /*
        *   20190827新需求
        *   无需跳转处理结果页
        *   20190918新需求
        *   处理完保持在当前页面
        */
        if (urlParams.key == 1) {
          if (urlParams.type == 'returnVisit') {
            router.push({ pathname: '/worktaskmanagement/returnvisit' })
          } else if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if (urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/waitfollowup' })
          }
        } else if (urlParams.key == 2) {
          router.push({ pathname: '/worktaskmanagement/alreadyreserved' })
        } else if (urlParams.key == 3) {
          router.push({ pathname: '/worktaskmanagement/alreadyshop' })
        } else if (urlParams.key == 10) {
          router.push({ pathname: '/worktaskmanagement/newdistribution' })
        }
        message.success('操作成功!',3)
      } else {
        message.error(msg)
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
      }
    },
    // 已到店arrivals
    * EFFECTS_ARRIVALS_ORDER({payload}, { call, put,  select }) {
      const urlParams = yield select(({worktaskmanagement}) => worktaskmanagement.urlParams)
      // const orderno = yield select(({worktaskmanagement}) => worktaskmanagement.orderno)
      const orderno = urlParams.orderno
      yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: true}))
      const { result, obj ,msg} = yield call(handleworktaskApi.arrivalsOrder, {orderno, ...payload});
      if (result === 1) {
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
        /*
        *   20190827新需求
        *   无需跳转处理结果页
        *   20190918新需求
        *   处理完保持在当前页面
        */
        if (urlParams.key == 1) {
          if (urlParams.type == 'returnVisit') {
            router.push({ pathname: '/worktaskmanagement/returnvisit' })
          } else if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if (urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/waitfollowup' })
          }
        } else if (urlParams.key == 2) {
         if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if(urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/alreadyreserved' })
          }
        } else if (urlParams.key == 3) {
          router.push({ pathname: '/worktaskmanagement/alreadyshop' })
        } else if (urlParams.key == 10) {
          router.push({ pathname: '/worktaskmanagement/newdistribution' })
        }
        message.success('操作成功!',3)
      } else {
        message.error(msg)
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
      }
    },

    // 未到店 、转跟进
    * EFFECTS_TURNFOLLOWUP_ORDER({payload}, { call, put,  select }) {
      const urlParams = yield select(({worktaskmanagement}) => worktaskmanagement.urlParams)
      // const orderno = yield select(({worktaskmanagement}) => worktaskmanagement.orderno)
      const orderno = urlParams.orderno
      yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: true}))
      let status = urlParams.key == 2 ? 1 : ''
      const { result, obj ,msg} = yield call(handleworktaskApi.turnfollowupOrder, {orderno, ...payload,status});
      if (result === 1) {
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
        /*
        *   20190827新需求
        *   无需跳转处理结果页
        *   20190918新需求
        *   处理完保持在当前页面
        */
        if (urlParams.key == 1) {
          if (urlParams.type == 'returnVisit') {
            router.push({ pathname: '/worktaskmanagement/returnvisit' })
          } else if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if (urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/waitfollowup' })
          }
        } else if (urlParams.key == 2) {
          if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if(urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/alreadyreserved' })
          }
        } else if (urlParams.key == 3) {
          if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if(urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/alreadyshop' })
          }
        } else if (urlParams.key == 10) {
          router.push({ pathname: '/worktaskmanagement/newdistribution' })
        }
        message.success('操作成功!',3)
      } else {
        message.error(msg)
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
      }
    },

    // 修改预约
    * EFFECTS_UPDATERESERVE_ORDER({payload}, { call, put,  select }) {
      const urlParams = yield select(({worktaskmanagement}) => worktaskmanagement.urlParams)
      // const orderno = yield select(({worktaskmanagement}) => worktaskmanagement.orderno)
      const orderno = urlParams.orderno
      yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: true}))
      const { result, obj ,msg} = yield call(handleworktaskApi.updatereserveOrder, {orderno, ...payload});
      if (result === 1) {
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
        /*
        *   20190827新需求
        *   无需跳转处理结果页
        *   20190918新需求
        *   处理完保持在当前页面
        */
        if (urlParams.key == 1) {
          if (urlParams.type == 'returnVisit') {
            router.push({ pathname: '/worktaskmanagement/returnvisit' })
          } else if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if (urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/waitfollowup' })
          }
        } else if (urlParams.key == 2) {
          if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if (urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/alreadyreserved' })
          }
        } else if (urlParams.key == 3) {
          router.push({ pathname: '/worktaskmanagement/alreadyshop' })
        } else if (urlParams.key == 10) {
          router.push({ pathname: '/worktaskmanagement/newdistribution' })
        }
        message.success('操作成功!',3)
      } else {
        message.error(msg)
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
      }
    },

    // 已成交transaction
    * EFFECTS_TRANSACTION_ORDER({payload}, { call, put,  select }) {
      const urlParams = yield select(({worktaskmanagement}) => worktaskmanagement.urlParams)
      // const orderno = yield select(({worktaskmanagement}) => worktaskmanagement.orderno)
      const orderno = urlParams.orderno
      yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: true}))
      const { result, obj ,msg} = yield call(handleworktaskApi.transactionOrder, {orderno, ...payload});
      if (result === 1) {
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
        /*
        *   20190827新需求
        *   无需跳转处理结果页
        *   20190918新需求
        *   处理完保持在当前页面
        */
        if (urlParams.key == 1) {
          if (urlParams.type == 'returnVisit') {
            router.push({ pathname: '/worktaskmanagement/returnvisit' })
          } else if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if (urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/waitfollowup' })
          }
        } else if (urlParams.key == 2) {
          router.push({ pathname: '/worktaskmanagement/alreadyreserved' })
        } else if (urlParams.key == 3) {
          if (urlParams.type == 'berecycled') {
            router.push({ pathname: '/worktaskmanagement/berecycled' })
          } else if(urlParams.type == 'allworktask') {
            router.push({ pathname: '/worktaskmanagement/allworktask' })
          } else if (urlParams.type == 'sharingCustomer' || urlParams.type == 'sharingOut') {
            router.push({ pathname: '/worktaskmanagement/sharingCustomer' })
          } else {
            router.push({ pathname: '/worktaskmanagement/alreadyshop' })
          }
        } else if (urlParams.key == 10) {
          router.push({ pathname: '/worktaskmanagement/newdistribution' })
        }
        message.success('操作成功!',3)
      } else {
        message.error(msg)
        yield put(_mmAction(`${parentNamespace}/IS_SHOWLOADING`,{loading: false}))
      }
    },
    //修改列表客户标签
    * EFFECTS_ONCHANGELABELS({payload}, { call, put , select}){
      let urlParams = yield select(({worktaskmanagement}) => worktaskmanagement.urlParams)
      // const orderno = yield select(({worktaskmanagement}) => worktaskmanagement.orderno)
      let orderno = urlParams.orderno
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const { result, obj, msg } = yield call(handleworktaskApi.changeLabels, payload);
      if (result === 1 ) {
        message.success('编辑标签成功!')
        yield put(_mmAction('EFFECTS_GET_ORDERDETAIL',urlParams))
        // router.replace({
        //   pathname: '/worktaskmanagement/handleworktask',
        //   query: { key: urlParams.key, orderno }
        // })
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },



  },

  reducers: {
    GET_ORDERDETAIL(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
    setupHistory({ dispatch, history }) {
        const params = history.location.query
        console.log(params);
      return history.listen(({ pathname }) => {
        if( pathname === '/worktaskmanagement/handleworktask') {
          const { orderno, key, type } = history.location.query
          dispatch({ type: `${parentNamespace}/EFFECTS_SETURLPARAMS`,
            payload: {
              key,
              orderno,
              type
            }
          })

          // dispatch({ type: `${parentNamespace}/EFFECTS_GET_ORDERDETAIL`,
          //   payload: {
          //     key,
          //     orderno
          //   }
          // })
        }
      })
    }
  }

};
