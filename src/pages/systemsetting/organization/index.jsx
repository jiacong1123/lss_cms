import React from 'react';
import { connect } from 'dva'
import List from './components/list'
import Save from './components/save'
import ComModal from './components/modal'


import { _mmAction } from 'utils/mm.js'
import styles from './index.less'

const namespace = 'organization'
@connect(({layout,organization}) => ({
  ...layout,
  ...organization,
}),(dispatch)=>({
  getOrgList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ORGLIST`
      )
    )
  },


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
  },
  onAddOrganization(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_ADD_ORGANIZATION`,
        payload
      )
    )
  },
  onEditOrganization(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_EDIT_ORGANIZATION`,
        payload
      )
    )
  },

  OnSetClickTree(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SET_CLICKTREE`,
        payload
      )
    )
  },


}))

class Organization extends React.Component {

  state = {

  }

  componentDidMount = () => {
     // 初始化数据
     this.props.onGetAuthList()
  }

  // 点击modal确定按钮并处理请求
  onModalOk = (values) => {
    const { modalKey } = this.props
    if ( modalKey === 'add') {
      this.props.onAddOrganization(values)
    }
  }

  render() {


    return (
      <div className={styles.accountauthPage}>
         <List {...this.props}/>
         <ComModal
           {...this.props}
           onOk={this.onModalOk}
         />

      </div>
    )
  }
}

export default Organization
