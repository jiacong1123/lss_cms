import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'
 

const namespace = 'doctormanagement' 

@connect(({layout,doctormanagement}) => ({
  ...layout,
  ...doctormanagement,
}),(dispatch)=>({
  onGetDoctorList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_DOCTORLIST`,
        payload
      )
    )
  },
  onSaveDoctor(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SAVE_DOCTOR`,
        payload
      )
    )
  },
  onDeleteDoctor(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_DELETE_DOCTOR`,
        payload
      )
    )
  },
  onGetCurrentDoctor(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTDOCTOR`,
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

class Doctormanagement extends React.Component {
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
    const { modalKey, doctorid } = this.props
    if ( modalKey === 'add') {
      // 新增门诊
      this.props.onSaveDoctor(values)
    } else if (modalKey === 'edit') {
      // 编辑门诊
      this.props.onSaveDoctor({...values,doctorid})
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
      <div className={styles.doctormanagementPage}>
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

export default Doctormanagement
