import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'OralAn'

@connect(({layout,OralAn}) => ({
  ...layout,
  ...OralAn,
}),dispatch=>({
  onGetNewsList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_NEWSLIST`,
        payload
      )
    )
  },
  onSaveNews(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SAVE_NEWS`,
        payload
      )
    )
  },
  onGetCurrentNews(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTNEWS`,
        payload
      )
    )
  },
  onOperNews(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_OPER_NEWS`,
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

class OralAn extends React.Component {

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
    const { modalKey, id } = this.props
    if ( modalKey === 'add') {
      // 新增动态
      this.props.onSaveNews(values)
    } else if (modalKey === 'edit') {
      // 编辑动态
      this.props.onSaveNews({...values,id})
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
      <div className={styles.OralAnPage}>
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

export default OralAn
