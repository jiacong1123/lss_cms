import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import {
    ConfigProvider, Table,Switch ,Modal, Tabs
} from 'antd';
import Filter from './components/filter'
import Filterb from './components/filterb'
import Lista from './components/lista'
import Listb from './components/Listb'
import Opera from './components/opera'
import Operb from './components/operb'

import styles from './index.less'

const { TabPane } = Tabs
const namespace = 'itustatistics'

@connect(({layout,itustatistics}) => ({
  ...layout,
  ...itustatistics,
}),(dispatch)=>({

  onGetMonthList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_MONTHLIST`,
        payload
      )
    )
  },
  onGetMonthListCount(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_MONTHLIST_COUNT`,
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
  onGetHistoryList(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_HISTORYLIST`,
        payload
      )
    )
  },
  onGetHistoryListCount(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_HISTORYLIST_COUNT`,
        payload
      )
    )
  },

}))

class itustatistics extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    tabKey: '1',
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  cleanSelectedKeys = () => {
    this.onSelectChange([], []);
  }


  callback = (key) => {
    this.setState({ tabKey:key })
    this.props.onResetSearchValue()

    if (key == 1) {  //今日联系列表
      this.props.onGetMonthList({ page: 1, limit: 10, initEntry: true })
      this.props.onGetMonthListCount({initEntry: true})
    } else {    //历史联系列表
      this.props.onGetHistoryList({page: 1, limit: 10})
      this.props.onGetHistoryListCount({initEntry: true})
    }
  }

  render() {
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const { tabKey } = this.state

    return (
      <div className={styles.itustatisticsPage}>
        <Tabs defaultActiveKey={tabKey} animated={false} onChange={this.callback}>
          <TabPane tab="今日电联" key="1">
              { tabKey === "1" ?
                <div>
                  <Filter {...this.props}/>
                  <div className={styles.tableListBox}>
                   <Opera
                       cleanSelectedKeys={this.cleanSelectedKeys}
                       selectedRowKeys={selectedRowKeys}
                       hasSelected={hasSelected}
                       {...this.props}
                     />
                   <Lista
                       rowSelection={rowSelection}
                       {...this.props}
                   />
                  </div>
                </div> : null
              }
          </TabPane>
          <TabPane tab="历史电联" key="2">
              { tabKey === "2" ?
                <div>
                  <Filterb {...this.props}/>
                  <div className={styles.tableListBox}>
                   <Operb
                       cleanSelectedKeys={this.cleanSelectedKeys}
                       selectedRowKeys={selectedRowKeys}
                       hasSelected={hasSelected}
                       {...this.props}
                     />
                   <Listb
                       rowSelection={rowSelection}
                       {...this.props}
                   />
                  </div>
                </div> : null
              }
          </TabPane>
        </Tabs>

      </div>
    )
  }
}

export default itustatistics
