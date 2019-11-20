import React from 'react';
import { connect } from 'dva'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import Filter from '../components/filter'
import List from '../components/list'
import Oper from '../components/oper'
import ComModal from '../components/modal'
import styles from '../index.less'
import Audio from '../components/audio'

const namespace = 'callrecord'

@connect(({layout,worktaskmanagement,callrecord}) => ({
  ...worktaskmanagement,
  ...layout,
  ...callrecord,
}),(dispatch)=>({
  // 记录列表
  onGetAudioList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/effectsGetCallRecordList`,
        payload
      )
    )
  },
  // 播放录音
  onPlayAduio(payload) {
    dispatch(
      _mmAction(
        `${namespace}/effectsPlayAduio`,
        payload
      )
    )
  },
  // 暂停录音
  onPasueAudio(payload) {
    dispatch(
      _mmAction(
        `${namespace}/effectsPauseAudio`,
        payload
      )
    )
  },
  onCloseAudio(payload){
    dispatch(
      _mmAction(
        `${namespace}/effectsCloseAudio`,
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
  },

}))

class Callphonerecord extends React.Component {

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

  }

  render() {
    const { audioUrl } = this.props
    const {  selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className={styles.newdistributionPage}>

         <div className={styles.tableListBox}>
          <Filter {...this.props}/>
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
          { audioUrl ? <Audio {...this.props}></Audio> : '' }
          </div>
      </div>
    )
  }
}

export default Callphonerecord
