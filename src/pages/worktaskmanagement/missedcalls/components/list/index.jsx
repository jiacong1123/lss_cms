import React from 'react'
import {
    ConfigProvider, Table ,Modal,Button,Icon, Radio
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import mixin from 'themes/mixin.less'
import MyIcon from 'utils/icon.js'
import { parseTime } from 'utils/mm'

class List extends React.Component {
      state = {
        pagination: {
          showSizeChanger: true,
          onShowSizeChange: (current,pageSize) => this.onShowSizeChange(current,pageSize),
          pageSizeOptions: ['10', '20', '50', '100']
        },
        visible: false,
        userTags: []
      }


    // 拨打电话
    handleMakeCall = (record) => {
      if(record.processStatus == "INIT") {
        this.props.updateStatus(record)
      }

      if (name == 'carl') {
        this.props.clearCurrentCallInfo()
        this.props.onBindCallPhone(record)
      } else {
        let userinfo = store.get('userinfo')
        const { ecUserId } = userinfo
        if (!ecUserId) {
            message.error('请先绑定EC账号!')
            return false
        }
        this.props.carlCallPhone({...record, ecUserId})
      }

    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetOrderList({page: pagination.current, limit:pagination.pageSize,...searchValue})
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
            title: '客户姓名',
            key: 'name',
            render: (text, record) => {
              const { name } = record
              return (
                <div className={mixin.lightHeight}>{name ? name : '未知'}</div>
              )
            }
          },
          {
            title: '客户号码',
            key: 'phone',
            render: (text, record) => {
              const { phone, cusNo } = record
              return (
                <div className={mixin.lightHeight}>{cusNo || phone}</div>
              )
            }
          },
          {
            title: '来电时间',
            key: 'createTime',
            render: (text, record) => {
              const { createTime } = record
              return (
                <span>{createTime ? parseTime(createTime) : ''}</span>
              )
            }
          },
          {
            title: '状态',
            key: 'processStatus',
            render: (text, record) => {
              const { processStatus } = record
              return (
              <div className={styles.operBtnBox}>
                { processStatus == 'PROCESSED' ? '已处理' :''}
                { processStatus == 'INIT' ? '未处理' :''}
              </div>
              )
            }
          },
          {
            title: '联系客户',
            key: 'concatcustom',
            // fixed: 'right',
            // width: 278,
            render: (text, record) => {
              const { orderno,isclue } = record
              return (
              <div className={styles.operBtnBox}>
                <Dropdown overlay={
                <Menu>
                    {/*<Menu.Item key="1" onClick={ e => this.handleMakeCall(record, 'carl') } >卡尔话机</Menu.Item>*/}
                    <Menu.Item key="2" onClick={ e => this.handleMakeCall(record, 'EC') } >EC话机</Menu.Item>
                </Menu>
                }>
                <Button type="primary" size="small">
                    <Icon type="phone" />
                </Button>
                </Dropdown>
              </div>
              )
            }
          },
      ]
      const { rowSelection, orderlist, loading, total, currentPage } = this.props
      const { pagination, userTags } = this.state
      pagination['total'] = total
      pagination['current'] = currentPage

      return (
          <ConfigProvider>
              <Table
                 columns={columns}
                 dataSource={orderlist}
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
