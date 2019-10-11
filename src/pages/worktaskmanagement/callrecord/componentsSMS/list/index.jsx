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
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetWeChatList({ page: pagination.current, limit: pagination.pageSize,...searchValue})
    }

    render(){
      const columns = [
          {
            title: '员工姓名',
            dataIndex: 'adminName',
          },
          {
            title: '员工号码',
            dataIndex: 'empNo',
          },
          {
            title: '客户姓名',
            key: 'userName',
            render: (text, record) => {
              const { userName } = record
              return (
                <div className={mixin.lightHeight}>{userName}</div>
              )
            }
          },
          {
            title: '客户手机号',
            key: 'cusNo',
            render: (text, record) => {
              const { cusNo } = record
              return (
                <div className={mixin.lightHeight}>{cusNo}</div>
              )
            }
          },
          {
            title: '发送时间',
            dataIndex: 'transferTime',
          },
          {
            title: '类型',
            key: 'type',
            render: (text, record) => {
              const { type } = record
              return (
              <div className={styles.operBtnBox}>
                { type === 'OUTBOUND' ? '外发短信' :''}
                { type === 'OUTBOUND_UNKNOWN' ? '陌生外发短信' :''}
                { type === 'INBOUND' ? '客户回复短信' :''}
                { type === 'INBOUND_CHANNEL' ? '渠道短信' :''}
                { type === 'INBOUND_UNKNOWN' ? '陌生短信' :''}
              </div>
              )
            }
          },
          {
            title: '状态',
            key: 'llResult',
            render: (text, record) => {
              const { llResult } = record
              return (
              <div className={styles.operBtnBox}>
                { llResult === 'SENT' ? '成功发送' :''}
                { llResult === 'INVALID_SHOW_NUMBER' ? '显示号码不合法' :''}
                { llResult === 'INVALID_RECEIVER_NUMBER' ? '接收号码非手机号' :''}
                { llResult === 'OTHER' ? '其他失败' :''}
              </div>
              )
            }
          },
          {
            title: '内容',
            dataIndex: 'content',
            width: 300,
          },

      ]

      const { rowSelection,SMSRecordList, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table
                 // rowSelection={rowSelection}
                 columns={columns}
                 dataSource={SMSRecordList}
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
