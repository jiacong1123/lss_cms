import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'alreadyclose'

@connect(({layout,alreadyclose}) => ({
  ...layout,
  ...alreadyclose,
}),dispatch=>({
  onGetOrderList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ORDERLIST`,
        payload
      )
    )
  },
  onGetCurrentOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTORDER`,
        payload
      )
    )
  },
  onActiveOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_ACTIVE_ORDER`,
        payload
      )
    )
  },
  onDeleteOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_DELETE_ORDER`,
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
  onGetBatchOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_BATCH_ORDER`,
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

}))

class Alreadyclose extends React.Component {

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    ordernos: []
  }
  onSelectChange = (selectedRowKeys,e) => {
    const ordernos = e.map(item=>item['orderno'])
    this.setState({ selectedRowKeys, ordernos});
  }

  cleanSelectedKeys = () => {
    this.onSelectChange([], []);
  }


  // 点击modal确定按钮并处理请求
  onModalOk = (values) => {
    const { modalKey, orderno, currentOrder } = this.props
    const { ordernos } = this.state
    if ( modalKey === 'add') {
      // 新增门诊
      this.props.onSaveOrder(values)
    } else if (modalKey === 'edit') {
      // 编辑门诊
      this.props.onSaveOrder({...values,orderno,userid: currentOrder['userid']})
    } else if (modalKey === 'batch') {
      // 批量
      this.props.onGetBatchOrder({...values,ordernos})
      this.setState({ selectedRowKeys:[], ordernos:[]})

    } else if (modalKey === 'single') {
      // 单个分配
      this.props.onGetBatchOrder({...values,ordernos:[orderno]})
    } else if (modalKey === 'receive') {
      // 批量领取
      this.props.onActiveOrder({...values,ordernos})
      this.setState({ selectedRowKeys:[], ordernos:[]})
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
      <div className={styles.alreadyclosePage}>
         <Filter {...this.props}/>
         <div className={styles.tableListBox}>
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

export default Alreadyclose
