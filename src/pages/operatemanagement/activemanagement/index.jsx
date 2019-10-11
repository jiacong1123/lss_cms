import React from 'react';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'
 
const namespace = 'activemanagement'

@connect(({layout,activemanagement}) => ({
  ...layout,
  ...activemanagement,
}),dispatch=>({
  onGetActiveList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ACTIVELIST`,
        payload
      )
    )
  },
  onSaveActive(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SAVE_ACTIVE`,
        payload
      )
    )
  },
  onGetCurrentActive(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTACTIVE`,
        payload
      )
    )
  },
  onOperActive(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_OPER_ACTIVE`,
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
  }
}))

class Activemanagement extends React.Component {

  state = {
    selectedRowKeys: [], // Check here to configure the default column
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  cleanSelectedKeys = () => {
    this.onSelectChange([], []);
  }


  // 点击modal确定按钮并处理请求
  onModalOk = (values) => {
    const { modalKey, actid } = this.props
    if ( modalKey === 'add') {
      // 新增动态
      this.props.onSaveActive(values)
    } else if (modalKey === 'edit') {
      // 编辑动态
      this.props.onSaveActive({...values,actid})
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
      <div className={styles.activemanagementPage}>
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

export default Activemanagement
