import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'carouselfigure'

@connect(({layout,carouselfigure}) => ({
  ...layout,
  ...carouselfigure,
}),dispatch=>({
  onGetCarouselList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CAROUSEL`,
        payload
      )
    )
  },
  onSaveCarousel(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SAVE_CAROUSEL`,
        payload
      )
    )
  },
  onGetCurrentCarousel(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_CURRENTCAROUSEL`,
        payload
      )
    )
  },
  onOperCarousel(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_OPER_CAROUSEL`,
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

class Carouselfigure extends React.Component {

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
      // 新增banner
      this.props.onSaveCarousel(values)
    } else if (modalKey === 'edit') {
      // 编辑banner
      this.props.onSaveCarousel({...values,id})
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
      <div className={styles.carouselfigurePage}>
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

export default Carouselfigure
