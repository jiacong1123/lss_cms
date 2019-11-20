import React from 'react';
import { connect } from 'dva'
import { Tabs } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './index.less'
import Callphonerecord from './callphonerecord'
import SMSRecord  from './SMSRecord'
import WeChatRecord from './weChatRecord'
// import WeChatRecord from '../wechatrecord/weChatRecord'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import store from 'store'

const TabPane = Tabs.TabPane;

const namespace = 'callrecord'

@connect(({callrecord}) => ({
  ...callrecord,
}),dispatch=>({

  //获取微信聊天列表
  onGetWeChatList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/effectsGetWeChatList`,
        payload
      )
    )
  },
  //获取短信聊天列表
  onGetSMSList(payload) {
    dispatch(
      _mmAction(
        `${namespace}/effectsGetSMSRecordList`,
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
  onSetCurrentSize(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_SET_CURRENTSIZE`,
        payload
      )
    )
  },
  onGetSearchValue(payload){
    console.log(payload)
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
}))

class Callrecord extends React.Component {

  componentDidMount = () => {

  }

  handleTabChange = (e) => {
    const userinfo = store.get('userinfo')
    const { name } = userinfo

    if (e == 1){ //通话记录

    } else if(e == 2) {   //短信管理
      this.props.onGetSMSList({ page: 1, limit: 10, name})

    } else {    //微信聊天记录
      const merchantNo = userinfo.guidMember.memberNoMerchant
      this.props.onGetWeChatList({ page: 0, limit: 10, merchantNo})
    }
  }

  render() {
    return (
      <div className={styles.callrecordPage}>
          <Tabs defaultActiveKey="1" animated={false} onChange={this.handleTabChange}>
            <TabPane tab="通话记录" key="1">
                <Callphonerecord {...this.props}></Callphonerecord>
            </TabPane>
            <TabPane tab="短信管理" key="2">
            <SMSRecord {...this.props}></SMSRecord>
            </TabPane>
            <TabPane tab="微信聊天记录" key="3">
              <WeChatRecord {...this.props}></WeChatRecord>
            </TabPane>
          </Tabs>
      </div>
    )
  }

}

export default Callrecord
