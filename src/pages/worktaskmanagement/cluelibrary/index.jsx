import React from 'react';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'cluelibrary'

@connect(({layout,cluelibrary}) => ({
  ...layout,
  ...cluelibrary,
}),dispatch=>({
  onGetOrderList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CLUELIST`,
        payload
      )
    )
  },
  onEditClue(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_EDIT_CLUE`,
        payload
      )
    )
  },
  dispatchClue(payload) {
    dispatch(
      _mmAction(
          `${namespace}/EFFECTS_CLUE_DISPATCH`,
          payload
      )
  )
  },
  getServiceList(payload) {
    dispatch(
        _mmAction(
            `${namespace}/EFFECTS_GET_SERVICE`,
            payload
        )
    )
},
  onGetCurrentClue(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTCLUE`,
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

class Cluelibrary extends React.Component {

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
    const { modalKey } = this.props

    if ( modalKey === 'add') {
 
    } else if (modalKey === 'editClue') {
      // 编辑工单
      this.props.onEditClue(values)
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
      <div className={styles.cluelibraryPage}>
         <Filter {...this.props}/>
         <div className={styles.tableListBox}>
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

export default Cluelibrary
