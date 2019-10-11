import React from 'react';
import { connect } from 'dva'
import List from './components/list'
import { _mmAction } from 'utils/mm.js'
import styles from './index.less'
 
const namespace = 'accountauth'
@connect(({layout,accountauth}) => ({
  ...layout,
  ...accountauth,
}),(dispatch)=>({
  onGetAuthList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_AUTHLIST`,
        payload
      )
    )
  },
  onGetRoleAuth(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ROLEAUTH`,
        payload
      )
    )
  },
  onEditRoleAuth(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_EDIT_ROLEAUTH`,
        payload
      )
    )
  },
  onIsShowModal(payload) {
    dispatch(
      _mmAction(
        `${namespace}/IS_SHOWMODAL`,
        payload
      )
    )
  }
}))

class Accountauth extends React.Component {

  state = {

  }

  componentDidMount = () => {
     // 初始化数据
     this.props.onGetAuthList()
  }
 
  render() {
    return (
      <div className={styles.accountauthPage}>
         <List {...this.props}/>
      </div>
    )
  }
}

export default Accountauth
