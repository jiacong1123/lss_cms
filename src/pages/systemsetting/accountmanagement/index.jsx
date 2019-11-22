import React from 'react'
import { connect } from 'dva'
import List from './components/list'
import Filter from './components/filter'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'
import { _mmAction } from 'utils/mm.js'


const namespace = 'accountmanagement'

@connect(({layout, accountmanagement }) => ({
  ...layout,
  ...accountmanagement,
}),(dispatch)=>({
  onGetAdminList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ADMINLIST`,
        payload
      )
    )
  },
  onAddAdmin(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_ADD_ADMIN`,
        payload
      )
    )
  },
  onOperateAdmin(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_OPERATE_ADMIN`,
        payload
      )
    )
  },
  onEditAdminRole(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_EDIT_ADMINROLE`,
        payload
      )
    )
  },
  //EC绑定电话号码
  onBingECId(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_EC_BINDID`,
        payload
      )
    )
  },

  // 绑定号码
  onBindPhone(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_BINDPHONE`,
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
  onGetCurrentAdmin(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTADMIN`,
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
  OnSelectOrg(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SET_ORG`,
        payload
      )
    )
  },

}))

class Accountmanagement extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  cleanSelectedKeys = () => {
    this.onSelectChange([], []);
  }

  // 点击modal确定按钮
  onModalOk = (values) => {
      const { modalKey, adminid, selectOrg, currentAdmin } = this.props
      const { editId, editName } = selectOrg
      const { orgName } = currentAdmin
      if ( modalKey === 'add') {
        // 新增账号
        // values.orgId = editId
        values.orgName = editName || orgName
        this.props.onAddAdmin(values)
      } else if (modalKey === 'edit') {
        // 编辑账号
        values.orgName = editName || orgName
        console.log(values);
        this.props.onAddAdmin({...values, adminid})
      } else if (modalKey === 'rolesetting') {
        // 角色设置
        this.props.onEditAdminRole({adminid,roleids:values})
      } else if (modalKey === 'bindphone') {
        // 卡尔绑定话机号码
        this.props.onBindPhone(values)
      } else if (modalKey === 'bindECId') {
        //EC绑定号码
        console.log(values);
        // this.props.
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
      <div className={styles.accountmanagementPage}>
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
            onCancel={this.onModalCancel}
          />
        </div>
      </div >
    )
  }
}

export default Accountmanagement
