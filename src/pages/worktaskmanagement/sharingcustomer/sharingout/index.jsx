import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from '../outcomponents/filter'
import List from '../outcomponents/list'
import Oper from '../outcomponents/oper'
import ComModal from '../outcomponents/modal'
import styles from '../index.less'

const namespace = 'sharingcustomer'

@connect(({layout,worktaskmanagement,sharingcustomer}) => ({
  ...worktaskmanagement,
  ...layout,
  ...sharingcustomer,
}),(dispatch)=>({
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
  onIsShowModal(payload) {
    dispatch(
      _mmAction(
        `${namespace}/IS_SHOWMODAL`,
        payload
      )
    )
  },

}))

class Callphonerecord extends React.Component {

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    ordernos: []
  }

  onSelectChange = (selectedRowKeys,e) => {
    //当前勾选的列表
    this.props.onSaveSelected(e)
    const ordernos = e.map(item=>item['orderno'])
    this.setState({ selectedRowKeys, ordernos});
  }

  cleanSelectedKeys = () => {
    this.onSelectChange([], []);
  }


  // 点击modal确定按钮并处理请求
  onModalOk = (values) => {
    const { modalKey, orderno, currentOrder,userid, sourceChild, selectedList } = this.props
    const ordernos = selectedList.map(item=>item['orderno'])
    if (modalKey === 'sendMessage') {
      const { messageContent } = this.props
      const phone = selectedList.map(item=>item['phone'])
      this.props.sendMessage({...values,phone,messageContent})
      this.setState({ selectedRowKeys:[], ordernos:[]})
    } else if (modalKey === 'cancleOrder') {
      //批量取消共享
      this.props.onCancleSharing({...values,ordernos})
      this.setState({ selectedRowKeys:[], ordernos:[]})
    } else if (modalKey === 'edit') {
      // 编辑门诊
      if(sourceChild && tagname) {
        this.props.onSaveOrder({...values,orderno,userid: currentOrder['userid'],tagname})
      } else {
        this.props.onSaveOrder({...values,orderno,userid: currentOrder['userid']})
      }

    } else if (modalKey === 'batch') {
      // 批量转移
      this.props.onGetBatchOrder({...values,ordernos})
      this.setState({ selectedRowKeys:[], ordernos:[]})

    } else if (modalKey === 'single') {
      // 单个转移
      this.props.onGetBatchOrder({...values,ordernos:[orderno]})
    } else if (modalKey === 'close') {
      //批量关闭
      this.props.onCloseOrder({...values,ordernos})
    }

  }

  render() {
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className={styles.newdistributionPage}>

         <div className={styles.tableListBox}>
          <Filter {...this.props}/>
          <Oper
              cleanSelectedKeys={this.cleanSelectedKeys}
              selectedRowKeys={selectedRowKeys}
              hasSelected={hasSelected}
              {...this.props}
            />
          <List
              rowSelection={rowSelection}
              {...this.props}
          />
          <ComModal
            {...this.props}
            onOk={this.onModalOk}
          />
          </div>
      </div>
    )
  }
}

export default Callphonerecord
