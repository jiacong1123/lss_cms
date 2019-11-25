import * as service from './service'
import router from 'umi/router';
import store from 'store'
import { Modal , message} from 'antd'
import { _mmUpdateSideKeys,_mmAction, wsMakeCall } from 'utils/mm'

export default {
    namespace:'layout',
    state:{
        visible: false,    // 控制modal显示
        title: '',         // modal的标题
        collapsed: false,
        theme: 'dark',
        clinicdropmenu: [],
        rolelist:[],
        jobordersource: [],
        reservedpro: [],
        jobtitle: [],
        electriclist: [],
        departmentlist:[],//医生科室
        customerTagsList: [], //客户标签
        openKeys: [],
        selectedKeys: [],
        doctordropmenu: [],
        productdropmenu: [],
        token: '',
        usertype: [],
        currentCallInfo: {},
        visible_calltype: false,
        visible_calltype_ATD: false,  // 拨号中
        visible_calltype_CBEGIN: false, // 去电来点是否接通
        visible_calltype_CEND: false,  // 话机挂机
        visible_calltype_CALLING: false, // 是否有来电
        orgList: [],      //组织结构
        unKnownCall: {},//陌生来电
        userid: '',        // 客户id
        recoveryCustomerNum: 0,   //客户回收数量
        missedCallNum: 0, //未接来电数量
        returnCount: 0,  //待回访数量
        personnelList: [],  //所属人员列表
        reserveCount: 0,  //预约回访数量
        reserveFlag: false,
        searchTags: [],   //搜索栏tags
    },
    effects:{
        *EFFECTS_TOGGLE(action,{call,put,select}){
          yield put({
              type:'TOGGLE'
          })
        },
        *EFFECTS_SWITCH_THEME({ payload },{call,put,select}){
            yield put({
                type:'SWITCH_THEME',
                payload: {
                    theme: payload
                }
            })
        },
        *EFFECTS_GET_CLINICDROPMENU({payload},{call,put,select}){
            const {result, obj} = yield call(service.getClinicDropmenu,payload)
            if (result === 1 ){
                yield put({
                    type:'GET_CLINICDROPMENU',
                    payload: {
                        clinicdropmenu:obj
                    }
                })
            }
        },
        *EFFECTS_GET_ROLELIST({payload},{call,put,select}){
            const {result, obj } = yield call(service.getRoleList,payload)
            if (result === 1 ){
                yield put({
                    type:'GET_ROLELIST',
                    payload: {
                        rolelist: obj
                    }
                })
            }
        },
        *EFFECTS_GET_ORGLIST({payload},{call,put,select}){
            const {result, obj } = yield call(service.getOrgList,payload)
            if (result === 1 ){
                yield put({
                    type:'GET_ORGLIST',
                    payload: {
                        orgList: obj
                    }
                })
            }
        },

        *EFFECTS_GET_TAGS({payload},{call,put,select}){
            const { type } = payload
            const { result, obj } = yield call(service.getTags,payload)
            if (result === 1 ){
                if ( type === 1 ) {
                    yield put({
                        type:'GET_TAGS',
                        payload: {
                            reservedpro: obj
                        }
                    })
                } else if (type === 2 ){
                    yield put({
                        type:'GET_TAGS',
                        payload: {
                            jobordersource: obj
                        }
                    })
                } else if (type === 3 ) {
                    yield put({
                        type:'GET_TAGS',
                        payload: {
                            jobtitle: obj
                        }
                    })
                } else if (type === 4 ) {
                    yield put({
                        type:'GET_TAGS',
                        payload: {
                            departmentlist: obj
                        }
                    })
                } else if (type === 7) {
                  yield put({
                      type:'GET_TAGS',
                      payload: {
                          customerTagsList: obj
                      }
                  })
                }

            }
        },

        *EFFECTS_GET_PERSONNAL({payload},{call,put,select}){
            const { result, obj } = yield call(service.getPersonnel,payload)
            const { roleid } = payload
            if (result === 1 ){
                yield put({
                    type:'GET_PERSONNAL',
                    payload: {
                        electriclist: obj
                    }
                })
            }
        },

        *EFFECTS_GET_DOCTORDROPMENU({payload},{call,put,select}){
            const { result, obj } = yield call(service.getDoctorDropmenu,payload)
            if (result === 1 ){
                if (obj.length > 0 ) {
                    yield put({
                        type:'GET_DOCTORDROPMENU',
                        payload: {
                            doctordropmenu: obj
                        }
                    })
                } else {
                    yield put({
                        type:'GET_DOCTORDROPMENU',
                        payload: {
                            doctordropmenu: []
                        }
                    })
                }
            }
        },
        *EFFECTS_GET_PRODUCTDROPMENU({payload},{call,put,select}){
            const { result, obj } = yield call(service.getProductDropmenu,payload)
            if (result === 1 ){
                yield put({
                    type:'GET_PRODUCTDROPMENU',
                    payload: {
                        productdropmenu: obj
                    }
                })
            }
        },
        *EFFECTS_GET_UPLOADTOKEN({payload},{call,put,select}){
            const { result, obj } = yield call(service.getUploadToken,payload)
            if (result === 1 ){
                yield put({
                    type:'GET_UPLOADTOKEN',
                    payload: {
                       token: obj
                    }
                })
            }
        },
        *EFFECTS_UPDATE_PASSWORD({payload},{ put, call , select}){
            const res = yield call(service.updatepassword, payload)
            if( res.result === 1 ) {
                message.success('修改成功')
                yield put({
                    type:'IS_SHOWMODAL',
                    payload: {
                        visible: false
                    }
                })
            } else {
                message.error(res.msg)
            }
        },
        // 获取客户类型
        * EFFECTS_GET_USERTYPE({payload}, { call, put , select}){
            const { result,errorMessage,returnObject } = yield call(service.getUserType, payload);
            if (result) {
                yield put(_mmAction('GET_USERTYPE',{
                  usertype: returnObject
                }))
            } else {
            message.error(errorMessage)
            }
        },

        // 获取来电客户详情
        * EFFECTS_GETCALLING_DETAIL({payload}, { call, put , select}){
            const { result, obj, msg } = yield call(service.getUserInfo, payload);
            if (result == 1 ) {
                // console.log(obj)
                if(obj == null) {
                  yield put(_mmAction('SET_CALLTYPE',{
                      currentCallInfo: {}
                  }))
                } else {
                  yield put(_mmAction('SET_CALLTYPE',{
                      currentCallInfo: obj
                  }))
                }

            } else {
              message.error(msg)
            }
        },

        //EC拨打电话
        * EFFECTS_CARL_CALLPHONE({payload}, { call, put , select}){
          console.log(payload)
            const { result, obj, msg } = yield call(service.carlPhone, payload);
            if (result == 1 ) {
                // console.log(obj)
            } else {
              message.error(msg)
            }
        },


        // 绑定外呼号码
        * EFFECTS_BINDCALLPHONE({payload}, { call, put , select}){
             console.log("111111111",payload);
            yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
            const currentCallInfo = yield select(({layout}) => layout.currentCallInfo)
             console.log("22222222",currentCallInfo);
            const unKnownCall = yield select(({layout}) => layout.unKnownCall)

            let formData = {}
            if (Object.keys(currentCallInfo).length > 0) {
              formData = currentCallInfo
            } else {
              formData = payload
            }

            // let formData = payload || currentCallInfo
             console.log("-------",formData)
            //有订单编号客户
            if (formData.orderno) {
              const { result, obj, msg } = yield call(service.phoneBindCall, formData);
              if (result == 1 ) {
                // let url = `${window.location.origin}/gd/#/worktaskmanagement/handleworktask?key=10&orderno=${formData.orderno}&keyName=MakeCall `
                // window.open(url)
                  // router.push({
                  //     pathname: '/worktaskmanagement/handleworktask',
                  //     query: {
                  //     orderno: formData.orderno,
                  //     key: 10,
                  //     keyName: 'MakeCall'
                  //     },
                  // })
                  yield put(_mmAction('SET_CALLTYPE',{
                      currentCallInfo: formData
                  }))

                  // 拨打电话
                  wsMakeCall(obj)
                  yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
              } else {
                  message.error(msg)
                  yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
              }

            } else {

              if (formData.llResult == "BUSY" || formData.llResult == "NO_ANSWER") {
                //未接来电重播
                unKnownCall.number = formData.cusNo || formData.phone
                unKnownCall.type = formData.type
                const { result, obj, msg } = yield call(service.phoneBindCall_phone, {...unKnownCall,...payload});
                  yield put(_mmAction('SET_CALLTYPE',{
                      currentCallInfo: {},
                  }))
                  wsMakeCall(obj)
                  yield put(_mmAction('IS_SHOWLOADING',{loading: false}))

              } else if (formData.type == "headerCall") {
                //拨出去的陌生号码
                const { result, obj, msg } = yield call(service.phoneBindCall_phone, {...unKnownCall,...payload});
                  yield put(_mmAction('SET_CALLTYPE',{
                      currentCallInfo: {},
                      unKnownCall: formData
                  }))

                  wsMakeCall(obj)
                  yield put(_mmAction('IS_SHOWLOADING',{loading: false}))

              } else {
                //接到的陌生号码
                const { result, obj, msg } = yield call(service.phoneBindCall_phone, {...unKnownCall,...payload});
                if (result === 1 ) {
                    wsMakeCall(obj)
                    yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
                } else {
                    message.error(msg)
                    yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
                }

              }
            }

        },

        //清空当前拨号信息
        * EFFECTS_CLEAR_CURRENTCALLINFO({payload}, { call, put , select}) {
          yield put(_mmAction('SET_CALLTYPE',{
              currentCallInfo: {}
          }))
        },

        // 设置拨打电话状态
        * EFFECTS_SET_CALLTYPE({payload}, { call, put , select}) {
            yield put(_mmAction('SET_CALLTYPE',payload))
        },

        // 陌生电话来电
        * EFFECTS_SET_UNKNOWNCALL({payload}, { call, put , select}) {
          yield put(_mmAction('SET_CALLTYPE',{
              unKnownCall: payload
          }))
        },

        // 检索客户是否存在
        * EFFECTS_JUDGE_USERISEXIST({payload}, { call, put , select}){
          const { result, obj, msg } = yield call(service.judgeUserIsExist, payload);
          // console.log(obj)
          let errorMsg = ''
          let status = ''
          if (result === 1 ) {
            if (obj == null) {
              yield put(_mmAction('SET_CALLTYPE',{
                  currentCallInfo: {}
              }))
            }

            if (obj && obj.orderno) {
              const { order } = obj
              if (order.status === 1 && order.followup > 0) { status = '待跟进' }
              if (order.status === 1  && order.followup == 0) { status = '新分配' }
              if (order.status === 0 ) { status = '未分配' }
              if (order.status === 2 ) { status = '已预约' }
              if (order.status === 3 ) { status = '已到店' }
              if (order.status === 4 ) { status = '已完成' }
              if (order.status === 5 ) { status = '已关闭' }
              errorMsg = `当前手机号码已存在，工单状态：${status}，所属销售：${order.adminname}`
              message.error(errorMsg)
              yield put(_mmAction('SET_CALLTYPE',{
                  currentCallInfo: obj
              }))
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

        // 客户回收数量
        * EFFECTS_COVERYCUSTOMERNUM({payload}, { call, put , select}){
            const status = 98
            const { result,errorMessage,total } = yield call(service.recoveryCustomerNum, {status,...payload});
            if (result == 1) {
                yield put(_mmAction('GET_RECOVERYCUSTOMERNUM',{
                  recoveryCustomerNum: total
                }))
            } else {
              message.error(errorMessage)
            }
        },

        //未接来电数量
        * EFFECTS_MISSEDCALLNUM({payload}, { call, put , select}){
          const userinfo = store.get('userinfo')
          const adminid = userinfo.adminid
          const loginame = userinfo.loginame
            const { result,errorMessage,total, obj } = yield call(service.missedCallNum, {adminid, loginame,...payload});
            if (result == 1) {
                yield put(_mmAction('GET_MISSEDCALLNUM',{
                  missedCallNum: obj
                }))
            } else {
              message.error(errorMessage)
            }
        },

        //待回访数量
        * EFFECTS_RETURNCOUNT({payload}, { call, put , select}){
          const userinfo = store.get('userinfo')
          const adminid = userinfo.adminid
          const loginame = userinfo.loginame
            const { result,errorMessage,total, obj } = yield call(service.returnCount, {adminid, loginame,...payload});
            if (result == 1) {
                yield put(_mmAction('GET_MISSEDCALLNUM',{
                  returnCount: total
                }))
            } else {
              message.error(errorMessage)
            }
        },

        //清空待回访数量

        * EFFECTS_CLEAR_RETURNCOUNT({payload}, { call, put , select}) {
          yield put(_mmAction('CLEAR_REAERVECOUNT',{
              returnCount: 0
          }))
        },

        //所属人员列表
        * EFFECTS_PERSONNELLIST({payload}, { call, put , select}){
            const { result,errorMessage,total, obj } = yield call(service.personnelList, {payload});
            if (result == 1) {
                yield put(_mmAction('GET_MISSEDCALLNUM',{
                  personnelList: obj
                }))
            } else {
              message.error(errorMessage)
            }
        },

        //回访提醒数量
        * EFFECTS_GET_RESERVECOUNT({payload}, { call, put , select}){
            const { result,errorMessage,total, obj } = yield call(service.getReserveCount, {payload});
            if (result == 1) {
              if (total > 0) {
                yield put(_mmAction('GET_MISSEDCALLNUM',{ reserveCount: total }))
              } else {
                yield put(_mmAction('GET_MISSEDCALLNUM',{ reserveCount: 0 }))
              }
            } else {
              yield put(_mmAction('GET_MISSEDCALLNUM',{ reserveCount: 0 }))
              message.error(errorMessage)
            }
        },

        //清空回访提醒数量
        * EFFECTS_CLEAR_RESERVECOUNT({payload}, { call, put , select}) {
          yield put(_mmAction('CLEAR_REAERVECOUNT',{
              reserveCount: 0
          }))
        },

        //搜索栏tags
        * EFFECTS_GET_SEARCHtAGS({payload},{call,put,select}){
          const { result, obj } = yield call(service.getSearchTags,payload)
          if (result === 1 ){
              yield put({
                  type:'GET_TAGS',
                  payload: {
                      searchTags: obj
                  }
              })
          }
        },

    },

    reducers:{
        TOGGLE(state,{payload}){
            return {...state, collapsed: !state.collapsed}
        },
        SWITCH_THEME(state,{payload}){
            return {...state,...payload}
        },
        GET_USERTYPE(state,{payload}){
            return {...state,...payload}
        },
        GET_CLINICDROPMENU(state,  {payload}){
            return {...state,...payload}
        },
        GET_DOCTORDROPMENU(state,  {payload}){
            return {...state,...payload}
        },
        GET_PRODUCTDROPMENU(state,  {payload}){
            return {...state,...payload}
        },
        GET_ROLELIST(state,  {payload}){
            return {...state,...payload}
        },
        GET_ORGLIST(state,  {payload}){
            return {...state,...payload}
        },
        GET_TAGS(state,  {payload}){
            return {...state,...payload}
        },
        GET_PERSONNAL(state,  {payload}){
            return {...state,...payload}
        },
        GET_UPLOADTOKEN(state,  {payload}){
            return {...state,...payload}
        },
        UPDATE_SIDERKEYS(state,  {payload}) {
            return {...state,...payload}
        },
        IS_SHOWMODAL(state, { payload }) {
            return { ...state, ...payload }
        },
        SET_CALLTYPE(state, { payload }){
            return { ...state, ...payload }
        },
        SET_USERID(state, { payload }){
          return { ...state, ...payload }
        },
        GET_RECOVERYCUSTOMERNUM(state, { payload }){
          return { ...state, ...payload }
        },
        GET_MISSEDCALLNUM(state, { payload }){
          return { ...state, ...payload }
        },
        CLEAR_REAERVECOUNT(state, { payload }){
            return { ...state, ...payload }
        },
    },
    subscriptions:{
        setup({ dispatch, history }) {
            history.listen( location=> {
                if (location.pathname == '/worktaskmanagement/alreadyclose') {
                  //已关闭工单 获取全部人员
                  dispatch({
                      type: 'EFFECTS_GET_PERSONNAL',
                      payload: {
                          roleid: 1
                      }
                  })
                  dispatch({
                      type: 'EFFECTS_GET_SEARCHtAGS'
                  })
                } else if (location.pathname !== '/login') {
                    store.set('targetpathname',location.pathname)
                    //获取诊所菜单
                    dispatch({
                        type: 'EFFECTS_GET_CLINICDROPMENU'
                    })
                    //获取角色列表
                    dispatch({
                        type: 'EFFECTS_GET_ROLELIST'
                    })
                    dispatch({
                      type: 'EFFECTS_GET_ORGLIST'
                    })
                    //获取预约项目
                    dispatch({
                        type: 'EFFECTS_GET_TAGS',
                        payload: {
                            type: 1
                        }
                    })
                    //获取工单来源
                    dispatch({
                        type: 'EFFECTS_GET_TAGS',
                        payload: {
                            type: 2
                        }
                    })
                    //获取职称
                    dispatch({
                        type: 'EFFECTS_GET_TAGS',
                        payload: {
                            type: 3
                        }
                    })
                    //获取科室
                    dispatch({
                        type: 'EFFECTS_GET_TAGS',
                        payload: {
                            type: 4
                        }
                    })
                    //获取客户标签
                    dispatch({
                        type: 'EFFECTS_GET_TAGS',
                        payload: {
                            type: 7
                        }
                    })
                    //获取电销人员
                    dispatch({
                        type: 'EFFECTS_GET_PERSONNAL',
                        payload: {
                            roleid: 3
                        }
                    })
                    //获取上传文件token
                    dispatch({
                        type: 'EFFECTS_GET_UPLOADTOKEN'
                    })
                    //获取客户类型
                    dispatch({
                        type: 'EFFECTS_GET_USERTYPE'
                    })
                    //客户回收数量
                    dispatch({
                        type: 'EFFECTS_COVERYCUSTOMERNUM'
                    })
                    //未接来电数量
                    dispatch({
                        type: 'EFFECTS_MISSEDCALLNUM'
                    })
                    // //待回访数量
                    // dispatch({
                    //     type: 'EFFECTS_RETURNCOUNT'
                    // })
                    //所属人员列表
                    dispatch({
                        type: 'EFFECTS_PERSONNELLIST'
                    })
                    dispatch({
                        type: 'EFFECTS_GET_SEARCHtAGS'
                    })
                }


            })

            // 监听拨打电话状态
            window.ws.onmessage = (evt)=> {
                var data = JSON.parse(evt.data);
                  // console.log(data)
                // 拨号成功
                if ( data['cmd'] === 'ATD' && data['success'] ) {
                dispatch({ type: 'EFFECTS_SET_CALLTYPE',
                    payload: {
                        visible_calltype: true,
                        visible_calltype_ATD: true,
                        visible_calltype_CBEGIN: false,
                        visible_calltype_CEND: false,
                        visible_calltype_CALLING: false
                    }
                })
                }
                // 拨号失败
                if( data['cmd'] === 'ATD' && !data['success'] ) {
                   message.error('拨号失败')
                }
                // 来电去电接通
                if ( data['cmd'] === 'CBEGIN') {
                    dispatch({ type: 'EFFECTS_SET_CALLTYPE',
                        payload: {
                            visible_calltype_CBEGIN: true,
                            visible_calltype_ATD: false,
                            visible_calltype_CEND: false,
                            visible_calltype_CALLING: false,
                        }
                    })
                }

                // 通话结束/挂断
                if ( data['cmd'] === 'CEND' ) {
                    dispatch({ type: 'EFFECTS_SET_CALLTYPE',
                        payload: {
                            visible_calltype_CBEGIN: false,
                            visible_calltype_ATD: false,
                            visible_calltype_CEND: true,
                            visible_calltype_CALLING: false,
                        }
                    })
                }

                // 有来电
                if ( data['cmd'] === 'CALLING' ) {
                  dispatch({ type: 'EFFECTS_SET_UNKNOWNCALL',
                      payload: {
                          cmd: data['cmd'],
                          number: data['number']
                      }
                  })

                    dispatch({ type: 'EFFECTS_SET_CALLTYPE',
                        payload: {
                            visible_calltype_CBEGIN: false,
                            visible_calltype_ATD: false,
                            visible_calltype_CEND: false,
                            visible_calltype_CALLING: true,
                            visible_calltype: true
                        }
                    })
                    dispatch({ type: 'EFFECTS_GETCALLING_DETAIL',
                        payload: {
                            phone: data['number']
                        }
                    })


                }

                // 接听操作
                if ( data['cmd'] === 'ATA' && data['success']) {
                    dispatch({ type: 'EFFECTS_SET_CALLTYPE',
                        payload: {
                            visible_calltype_CBEGIN: true,
                            visible_calltype_ATD: false,
                            visible_calltype_CEND: false,
                            visible_calltype_CALLING: false
                        }
                    })
                }
            }
        },
        setupHistory({ dispatch, history }) {
            history.listen(location => {
              const { key } = history.location.query
              const arr = location.pathname.split('/')
              const openKeys = arr.filter((item,index)=> 0 < index && index < arr.length -1  ).map(item=> `/${item}`)
              if (!key){
                dispatch({
                    type: 'UPDATE_SIDERKEYS',
                    payload: {
                        openKeys,
                        selectedKeys: [location.pathname]
                    }
                })
                store.set('openKeys',openKeys)
                store.set('selectedKeys',[location.pathname] )
              } else {
                const selectedKeys = store.get('selectedKeys')
                dispatch({
                    type: 'UPDATE_SIDERKEYS',
                    payload: {
                        openKeys,
                        selectedKeys
                    }
                })
              }
            })
        },

        setupRequestCancel({ history }) {
            history.listen(() => {

            })
        },

    }
}
