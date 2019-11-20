import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'
import store from 'store'
const namespace = 'allworktask'
const parentNamespace = 'worktaskmanagement'
let userLabes = []
let lablenames = ""

@connect(({layout,allworktask,worktaskmanagement}) => ({
  ...layout,
  ...worktaskmanagement,
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
  SetDefaultLabels(payload) {
    dispatch(
      _mmAction(
        `${parentNamespace}/EFFECTS_SET_DEFAULTLABELS`,
        payload
      )
    )
  },
  chearLabels(payload){
    dispatch(
      _mmAction(
        `${parentNamespace}/EFFECTS_CLEAR_LABELS`,
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
  },
  onCloseOrder(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_CLOSE_ORDER`,
        payload
      )
    )
  },

  //共享客户
  sharingCustomer(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SHARINGCUSTOMER`,
        payload
      )
    )
  },
  //获取短信模板列表
  getMessageList(payload){
    dispatch(
      _mmAction(
        `${parentNamespace}/EFFECTS_MESSAGE_TEMPLATELIST`,
        payload
      )
    )
  },
  //根据模板id 获取短信内容
  getMessageContent(payload){
    dispatch(
      _mmAction(
        `${parentNamespace}/EFFECTS_MESSAGE_CONTENT`,
        payload
      )
    )
  },

  //清空短信内容
  clearMessageContent(payload){
    dispatch(
      _mmAction(
        `${parentNamespace}/EFFECTS_CLEAR_MESSAGECONTENT`,
        payload
      )
    )
  },
  //发送短信
  sendMessage(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SENDMESSAGE`,
        payload
      )
    )
  },

}))



class allworktask extends React.Component {


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

    const { modalKey, orderno, currentOrder,userid, sourceChild, userTags, selectedList } = this.props
    const { ordernos, selectedRowKeys } = this.state
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
    } else if (modalKey === 'close') {
      //批量关闭
      this.props.onCloseOrder({...values,ordernos})
      this.setState({ selectedRowKeys:[], ordernos:[]})
    } else if (modalKey === 'sharing') {
      this.props.sharingCustomer({...values,ordernos})
      this.setState({ selectedRowKeys:[], ordernos:[]})
    } else if (modalKey === 'sendMessage') {
      const { messageContent } = this.props
      const phone = selectedList.map(item=>item['phone'])
      this.props.sendMessage({...values,phone,messageContent})
      this.setState({ selectedRowKeys:[], ordernos:[]})
    }
  }

  render() {
    const {  selectedRowKeys } = this.state;
    let userinfo = store.get('userinfo')
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      //已完成不可以勾选
      // getCheckboxProps: record => ({
      //   disabled: record.adminid !== userinfo.adminid,
      //   adminid: record.adminid ,
      // }),
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
