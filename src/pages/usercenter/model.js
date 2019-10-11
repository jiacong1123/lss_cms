import * as usercenterApi from './service';
 
export default {
  namespace: 'usercenter',
  state: {
 
  },
 
  effects: {
    * effectsDemo(_, { call, put }) {
      const { status, data } = yield call(usercenterApi.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },
  },
 
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
       
      })
    }
}
 
};
