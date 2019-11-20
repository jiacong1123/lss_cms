import React from 'react';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import Oper from './components/oper'
import ComModal from './components/modal'
import styles from './index.less'

const namespace = 'alreadydisclue'


@connect(({layout,alreadydisclue}) => ({
  ...layout,
  ...alreadydisclue,
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
  getServiceList(payload) {
    dispatch(
        _mmAction(
            `${namespace}/EFFECTS_GET_SERVICE`,
            payload
        )
    )
},
onAlreadyShop(payload){
  dispatch(
    _mmAction(
        `${namespace}/EFFECTS_ALREADYSHOP`,
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

class Alreadydisclue extends React.Component {

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
    if ( modalKey === 'clueinfo') {
      this.props.onIsShowModal({visible:false,title:'',currentClue:{}})
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
      <div className={styles.alreadydiscluePage}>
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

export default Alreadydisclue
