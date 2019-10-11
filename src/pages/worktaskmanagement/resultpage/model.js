import router from 'umi/router'
import { message } from 'antd'
import * as resultpageApi from './service';
import { _mmAction,_mmStampToTime, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'

const parentNamespace = 'worktaskmanagement'

export default {
  namespace: 'resultpage',
  state: {
  },
 
  effects: {

  },
 
  reducers: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if( pathname === '/worktaskmanagement/resultpage') {
          const { orderno } = history.location.query
          dispatch({ type: `${parentNamespace}/EFFECTS_GET_ORDERDETAIL`,
            payload: {
              orderno
          }})
        }
      })
    }
}
 
};
