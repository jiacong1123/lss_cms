import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'allworktask'
let userLabes = []
let lablenames = ""

@connect(({layout,allworktask}) => ({
  ...layout,
  ...allworktask,
}),(dispatch)=>({
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
  onGetBatchOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_BATCH_ORDER`,
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
  onSetUserTags(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SET_USERTAGS`,
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
  onActiveOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_ACTIVE_ORDER`,
        payload
      )
    )
  },

  onSaveSelected(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_ONSAVE_SELECTED`,
        payload
      )
    )
  },
  onChargeSave(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_CHARGESAVE`,
        payload
      )
    )
  }
}))



class allworktask extends React.Component {


  state = {
    selectedRowKeys: [], // Check here to configure the default column
    ordernos: []
  }
  onSelectChange = (selectedRowKeys,e) => {

    //当前勾选的列表
    // this.props.onSaveSelected(e)
    const ordernos = e.map(item=>item['orderno'])
    this.setState({ selectedRowKeys, ordernos});
  }

  cleanSelectedKeys = () => {
    this.onSelectChange([], []);
  }


  // 点击modal确定按钮并处理请求
  onModalOk = (values) => {

    const { modalKey, orderno, currentOrder,userid, sourceChild, userTags } = this.props
    const { ordernos } = this.state
    if(sourceChild) {
      const { tagname } = sourceChild
    }
    if (Object.keys(userTags).length > 0) {
      for(var i in userTags){
        userLabes.push(userTags[i])
      }
      lablenames = userLabes.join(',')
    }
    if ( modalKey === 'add') {
      // 新增门诊
      if(sourceChild && tagname) {
        this.props.onSaveOrder({...values, userid, tagname, lablenames})
      } else {
        this.props.onSaveOrder({...values,userid, lablenames})
      }

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
    }
  }

  render() {
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.status !== 1, // 仅新分配可以分配
        status: record.status ,
      }),
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className={styles.allworktaskPage}>
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

export default allworktask
