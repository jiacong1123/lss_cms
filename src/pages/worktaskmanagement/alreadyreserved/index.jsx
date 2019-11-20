import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'alreadyreserved'

@connect(({layout,alreadyreserved}) => ({
  ...layout,
  ...alreadyreserved,
}),dispatch=>({
  onGetSourceChild(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_SOURCRCHILD`,
        payload
      )
    )
  },
  onSetSourceChild(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SET_SOURCECHILDNAME`,
        payload
      )
    )
  },
  onGetOrderList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ORDERLIST`,
        payload
      )
    )
  },
  onSaveOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SAVE_ORDER`,
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
  onJudgeUserIsExist(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_JUDGE_USERISEXIST`,
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
  onIsShowModal(payload) {
    dispatch(
      _mmAction(
        `${namespace}/IS_SHOWMODAL`,
        payload
      )
    )
  },
  onChangeLabels(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_ONCHANGELABELS`,
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
  onCloseOrder(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_CLOSE_ORDER`,
        payload
      )
    )
  },

}))

class Alreadyreserved extends React.Component {

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
    const { modalKey, orderno, currentOrder,sourceChild } = this.props
    const { ordernos } = this.state
    if(sourceChild) {
      const { tagname } = sourceChild
    }

    if ( modalKey === 'add') {
      // 新增门诊
      if(sourceChild && tagname) {
        this.props.onSaveOrder({...values,tagname})
      } else {
        this.props.onSaveOrder(values)
      }

    } else if (modalKey === 'edit') {
      // 编辑门诊
      if(sourceChild && tagname) {
        this.props.onSaveOrder({...values,orderno,userid: currentOrder['userid'],tagname})
      } else {
        this.props.onSaveOrder({...values,orderno,userid: currentOrder['userid']})
      }

    } else if (modalKey === 'batch') {
      // 批量分配
      this.props.onGetBatchOrder({...values,ordernos})
      this.setState({ selectedRowKeys:[], ordernos:[]})

    } else if (modalKey === 'single') {
      // 单个分配
      this.props.onGetBatchOrder({...values,ordernos:[orderno]})
    } else if (modalKey === 'close') {
      //批量关闭
      this.props.onCloseOrder({...values,ordernos})
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
      <div className={styles.alreadyreservedPage}>
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

export default Alreadyreserved
