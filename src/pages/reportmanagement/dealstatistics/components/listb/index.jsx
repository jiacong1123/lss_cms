import React from 'react'
import {
    ConfigProvider, Table,Switch ,Modal, Tabs
} from 'antd';
import { DropOption } from 'components'
import { Trans } from '@lingui/react'
import PropTypes from 'prop-types'
import styles from './index.less'

const confirm = Modal.confirm;
const { TabPane } = Tabs

class Listb extends React.Component {

      state = {
        pagination: {}
      }


    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetHistoryList({page: pagination.current, limit:10, ...searchValue})
    }

    render(){
      const columns = [
          {
            title: '月份',
            dataIndex: 'stDate',
            render: (text, record) => {
              const { stDate } = record
              return (
                <span>{stDate.slice(0,7)}</span>
              )
            }
          },
          {
            title: '员工姓名',
            dataIndex: 'adminname',
            width: 100,
          },
          {
            title: '月客户数',
            dataIndex: 'allotUserCount',
          },
          {
            title: '新到店数',
            dataIndex: 'reserveUserCount',
          },
          {
            title: '历史到店数',
            dataIndex: 'hisReserveCount',
          },
          {
            title: '总到店数',
            dataIndex: 'allReserveCount',
          },
          {
            title: '新客到店率',
            dataIndex: 'monReserveRate',
            render: (text, record) => {
              const { monReserveRate } = record
              return (
                <span>{(monReserveRate * 100).toFixed(2)}%</span>
              )
            }
          },
          {
            title: '综合到店率',
            dataIndex: 'allReserveRate',
            render: (text, record) => {
              const { allReserveRate } = record
              return (
                <span>{(allReserveRate * 100).toFixed(2)}%</span>
              )
            }
          },
          {
            title: '大项成交数',
            dataIndex: 'bigDealCount',
          },
          {
            title: '大项成交率',
            dataIndex: 'bigDealRate',
            render: (text, record) => {
              const { bigDealRate } = record
              return (
                <span>{(bigDealRate * 100).toFixed(2)}%</span>
              )
            }
          },{
            title: '业绩完成(元)',
            dataIndex: 'allDealAmt',
            render: (text, record) => {
              const { allDealAmt } = record
              return (
                <span>{allDealAmt / 100}</span>
              )
            }
          },

      ]
      const { rowSelection,historyList, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
            <ConfigProvider>
                <Table
                   rowSelection={rowSelection}
                   columns={columns}
                   dataSource={historyList}
                   scroll={{ x: 1300 }}
                   loading={loading}
                   pagination={pagination}
                   onChange={this.handleTableChange}
                   bordered
                />
            </ConfigProvider>
      )
    }
}


Listb.propTypes = {

}


export default Listb
