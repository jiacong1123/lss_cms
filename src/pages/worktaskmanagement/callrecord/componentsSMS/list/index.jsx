import React from 'react'
import {
    ConfigProvider, Table ,Modal,Button,Icon, Tooltip
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
      pagination: {
        showSizeChanger: true,
        onShowSizeChange: (current,pageSize) => this.onShowSizeChange(current,pageSize),
        pageSizeOptions: ['10', '20', '50', '100']
      },
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

    //改变每页条数
    onShowSizeChange = (current, pageSize) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentSize(pageSize)
      this.props.onGetOrderList({page: 1, limit:pageSize, ...searchValue })
    }

    render(){
      const columns = [
          {
            title: '员工姓名',
            dataIndex: 'adminName',
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
            key: 'phone',
            render: (text, record) => {
              const { phone } = record
              return (
                <div className={mixin.lightHeight}>{phone}</div>
              )
            }
          },
          {
            title: '发送时间',
            key: 'sendDate',
            render: (text, record) => {
              const { sendDate } = record
              return (
                <div>{parseTime(sendDate)}</div>
              )
            }
          },
          // {
          //   title: '类型',
          //   key: 'type',
          //   render: (text, record) => {
          //     const { type } = record
          //     return (
          //     <div className={styles.operBtnBox}>
          //       { type === 'OUTBOUND' ? '外发短信' :''}
          //       { type === 'OUTBOUND_UNKNOWN' ? '陌生外发短信' :''}
          //       { type === 'INBOUND' ? '客户回复短信' :''}
          //       { type === 'INBOUND_CHANNEL' ? '渠道短信' :''}
          //       { type === 'INBOUND_UNKNOWN' ? '陌生短信' :''}
          //     </div>
          //     )
          //   }
          // },
          {
            title: '状态',
            key: 'status',
            render: (text, record) => {
              const { status } = record
              return (
              <div className={styles.operBtnBox}>
                { status === 1 ? '成功' :''}
                { status === 2 ? '失败' :''}
              </div>
              )
            }
          },
          {
            title: '内容',
            key: 'content',
            onCell: () => {
              return {
                style: {
                  maxWidth: 200,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow:'ellipsis',
                  cursor:'pointer'
                }
              }
            },
            render: (text, record) => {
              const { content } = record
              return (
                <Tooltip placement="top" title = {content}>
                  {content}
                </Tooltip>
              )
            }
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
