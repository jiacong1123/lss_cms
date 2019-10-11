import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from './components/filter'
import List from './components/list'
import styles from './index.less'

const namespace = 'orderlist'

@connect(({orderlist}) => ({
  ...orderlist,
}),(dispatch)=>({
  onGetOrderList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ORDERLIST`,
        payload
      )
    )
  },
  onConfirmPay(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_CONFIRM_PAY`,
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
  }
}))

class Orderlist extends React.Component {

  state = {
    selectedRowKeys: [], // Check here to configure the default column
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  cleanSelectedKeys = () => {
    this.onSelectChange([], []);
  }

 
  render() {
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className={styles.orderlistPage}>
         <Filter {...this.props}/>
         <div className={styles.tableListBox}>
          <List 
              rowSelection={rowSelection} 
              {...this.props}
          />
         </div>
      </div>
    )
  }
}

export default Orderlist
