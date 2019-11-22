import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'

import styles from './index.less'

const namespace = 'missedcalls'
const parentNamespace = 'worktaskmanagement'

@connect(({layout,worktaskmanagement,missedcalls}) => ({
  ...worktaskmanagement,
  ...layout,
  ...missedcalls,
}),(dispatch)=>({

  onGetOrderList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ORDERLIST`,
        payload
      )
    )
  },

  onSetCurrentPage(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SET_CURRENTPAGE`,
        payload
      )
    )
  },
  onSetCurrentSize(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SET_CURRENTSIZE`,
        payload
      )
    )
  },
  onGetSearchValue(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_SEARCHVALUE`,
        payload
      )
    )
  },
  onResetSearchValue(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_RESET_SEARCHVALUE`,
        payload
      )
    )
  },
  //EC拨打电话
  carlCallPhone(payload) {
    dispatch(
      _mmAction(
        `layout/EFFECTS_CARL_CALLPHONE`,
        payload
      )
    )
  },
  // 绑定外呼号码并拨号
  onBindCallPhone(payload) {
    dispatch(
      _mmAction(
        `layout/EFFECTS_BINDCALLPHONE`,
        payload
      )
    )
  },
  //清空当前拨号信息
  clearCurrentCallInfo(payload) {
    dispatch(
      _mmAction(
        `layout/EFFECTS_CLEAR_CURRENTCALLINFO`,
        payload
      )
    )
  },
  //跟新未接来电状态
  updateStatus(payload) {
    dispatch(
      _mmAction(
        `layout/EFFECTS_UPDATESTATUS`,
        payload
      )
    )
  },
}))

class missedcalls extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    ordernos: []
  }
  onSelectChange = (selectedRowKeys,e) => {
    const ordernos = e.map(item=>item['orderno'])
    this.setState({ selectedRowKeys, ordernos});
  }

  render() {
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div className={styles.missedcallsPage}>
         <Filter {...this.props}/>
         <div className={styles.tableListBox}>
         <Oper
           cleanSelectedKeys={this.cleanSelectedKeys}
           selectedRowKeys={selectedRowKeys}
           hasSelected={hasSelected}
           {...this.props}
           />
          <List

              {...this.props}
          />
          </div>
      </div>
    )
  }
}

export default missedcalls
