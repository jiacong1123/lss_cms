import { message } from 'antd'
import * as carouselfigureApi from './service';
import {_mmStampToTime, _mmTimeToStamp,_mmAddressSplit, _mmAction ,_mmAddressConcat} from 'utils/mm'

export default {
  namespace: 'carouselfigure',
  state: {
    loading: false,      // 加载动画
    visible: false,      // 控制modal显示
    title: '',           // modal的标题
    carousellist: [],    // 轮播图列表
    id: '',              // 当前轮播图id
    currentCarousel: {}, // 当前轮播图信息
    modalKey: '',        // 当前操作的标识
    total: null,         // 轮播图总条数
    currentPage: 1,      // 当前页码
    searchValue: {}      // 搜索条件
  },

  effects: {
    // 获取banner列表
    * EFFECTS_GET_CAROUSEL({payload}, { call, put,select }) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const searchValue = yield select(({carouselfigure}) => carouselfigure.searchValue)
      const currentPage = yield select(({carouselfigure}) => carouselfigure.currentPage)
      const { page } = payload
      const { result, obj , total, msg  } = yield call(carouselfigureApi.getCarouselList, {...searchValue,...payload})
      if (result === 1) {
        yield put(_mmAction('GET_CAROUSEL',{
          carousellist: _mmStampToTime(obj,['createtime'],'YYYY/MM/DD HH:mm:ss'),
          total,
          currentPage: page ? page : currentPage,
          loading: false,
          currentCarousel:{}
        }))
      } else {
        message.error(msg)
        yield put(_mmAction('IS_SHOWLOADING',{loading: false}))
      }
    },
    // 添加/编辑banner
    * EFFECTS_SAVE_CAROUSEL({payload}, { call, put, select}) {
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({carouselfigure}) => carouselfigure.currentPage)
      const { result, msg  } = yield call(carouselfigureApi.saveCarousel, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_CAROUSEL',{
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
    // 获取当前banner信息
    * EFFECTS_GET_CURRENTCAROUSEL({payload}, { call, put , select}){
      const carousellist = yield select(({carouselfigure}) => carouselfigure.carousellist)
      const { id } = payload
      const currentCarousel = carousellist.find(item=>item.id === id )
      yield put({
        type: 'GET_CURRENTCAROUSEL',
        payload: {
          id,
          currentCarousel
        }
      })
    },
    // 启用/禁用/删除文章
    * EFFECTS_OPER_CAROUSEL({payload}, { call, put , select}){
      yield put(_mmAction('IS_SHOWLOADING',{loading: true}))
      const currentPage = yield select(({carouselfigure}) => carouselfigure.currentPage)
      const { result, msg  } = yield call(carouselfigureApi.operCarousel, payload);
      if (result === 1) {
        yield put(_mmAction('EFFECTS_GET_CAROUSEL',{
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
    GET_CAROUSEL(state, { payload }) {
      return { ...state, ...payload }
    },
    GET_CURRENTCAROUSEL(state, { payload }) {
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
        if ( pathname === '/operatemanagement/carouselfigure'){
          dispatch({
            type: 'EFFECTS_GET_CAROUSEL',
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
