import React from 'react'
import {
    ConfigProvider, Table ,Modal,Button,Icon
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import mixin from 'themes/mixin.less'
import MyIcon from 'utils/icon.js'
import { parseTime } from 'utils/mm'

const confirm = Modal.confirm;


class List extends React.Component {

    state = {
      pagination: {},
      visible_audio: false
    }


    handleMenuClick = () => {

    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { searchValue } =  this.props
      const userinfo = store.get('userinfo')
      const merchantNo = userinfo.guidMember.memberNoMerchant
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetWeChatList({ page: pagination.current, limit: pagination.pageSize, merchantNo,...searchValue})
    }

    //查看聊天记录
    checkWechatDetail (record) {
      console.log(record)
      let guidMember = store.get('guidMember')
      let host = window.location.host
      let url = `http://192.168.3.3/im-web?token=${guidMember.token}&wxId=${record.noWxGm}&code=${record.msgId}&memberNoGm=${record.memberNoGm}&memberNo=${record.memberNo}`
      window.open(url)
    }

    render(){
      const columns = [
          {
            title: '员工姓名',
            dataIndex: 'memberNameGm',
          },
          {
            title: '员工微信',
            dataIndex: 'noWx',
          },
          {
            title: '客户姓名',
            key: 'memberName',
            render: (text, record) => {
              const { memberName } = record
              return (
                <div className={mixin.lightHeight}>{memberName}</div>
              )
            }
          },
          {
            title: '客户手机号',
            key: 'mobile',
            render: (text, record) => {
              const { mobile } = record
              return (
                <div className={mixin.lightHeight}>{mobile}</div>
              )
            }
          },
          {
            title: '微信昵称',
            dataIndex: 'memberNickName',
          },
          {
            title: '最近聊天日期',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (createTime) => {
              createTime = parseTime(createTime)
              return createTime
            }
          },
          {
            title: '最近聊天记录',
            dataIndex: 'content',
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 80,
            render: (text, record) => {
              const { lssRecordUrl, isPlay } = record

              return (
              <div className={styles.operBtnBox}>
                <Button size="small" type="primary" onClick={e => this.checkWechatDetail(record)}><MyIcon className={styles.iconweixin1} type="iconweixin1" /></Button>
              </div>
              )
            }
          }
      ]
      const { rowSelection,weChatList, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table
                 // rowSelection={rowSelection}
                 columns={columns}
                 dataSource={weChatList}
                 bordered
                 scroll={{ x: 1300 }}
                 loading={loading}
                 pagination={pagination}
                 onChange={this.handleTableChange}
              />
          </ConfigProvider>
      )
    }
}


List.propTypes = {

}


export default List
