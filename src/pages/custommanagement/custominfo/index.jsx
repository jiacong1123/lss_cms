import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'custominfo'

@connect(({layout,custominfo}) => ({
  ...layout,
  ...custominfo,
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
  onGetCustomList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CUSTOMLIST`,
        payload
      )
    )
  },
  onSaveCustom(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SAVE_CUSTOM`,
        payload
      )
    )
  },
  onGetCurrentUser(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTUSER`,
        payload
      )
    )
  },
  onDeleteCurrentUser(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_DELETE_CURRENTUSER`,
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

class Custominfo extends React.Component {
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
    const { modalKey, userid, sourceChild } = this.props
    if(sourceChild) {
      const { tagname } = sourceChild
    }

    const data =_mmTimeToStamp(_mmAddressSplit(values,['province','city']),['sourcedate'],'YYYY/MM/DD')
    if ( modalKey === 'add') {
      // 新增客户
      if(sourceChild && tagname) {
        this.props.onSaveCustom({...data, tagname})
      } else {
        this.props.onSaveCustom(data)
      }

    } else if (modalKey === 'edit') {
      // 编辑客户
      if(sourceChild && tagname) {
        this.props.onSaveCustom({...data, userid, tagname})
      } else {
        this.props.onSaveCustom({...data, userid})
      }

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
      <div className={styles.custominfoPage}>
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

export default Custominfo
