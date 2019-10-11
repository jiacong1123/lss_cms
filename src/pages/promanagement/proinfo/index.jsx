import React from 'react';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'proinfo'

@connect(({layout,proinfo}) => ({
  ...layout,
  ...proinfo,
}),dispatch=>({
  onGetProList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_PROLIST`,
        payload
      )
    )
  },
  onSavePro(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SAVE_PRO`,
        payload
      )
    )
  },
  onGetCurrentPro(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTPRO`,
        payload
      )
    )
  },
  onOperPro(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_OPER_PRO`,
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

class Productinfo extends React.Component {

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
    const { modalKey, pid } = this.props
    if ( modalKey === 'add') {
      // 新增动态
      this.props.onSavePro(values)
    } else if (modalKey === 'edit') {
      // 编辑动态
      this.props.onSavePro({...values,pid})
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
      <div className={styles.productinfoPage}>
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

export default Productinfo
