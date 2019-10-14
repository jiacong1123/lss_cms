import React from 'react'
import {
    ConfigProvider, Table,Switch ,Modal, Tabs
} from 'antd';
import { DropOption } from 'components'
import { Trans } from '@lingui/react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { formatSeconds } from 'utils/mm'

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
      this.props.onGetHistoryList({page: pagination.current, limit:10,...searchValue})
    }

    render(){
      const columns = [
          {
            title: '日期',
            dataIndex: 'stDate',
            key: 'stDate',
            render: (text, record) => {
              const { stDate } = record
              return (
                <span>{stDate.slice(0,11)}</span>
              )
            }
          },
          {
            title: '员工姓名',
            dataIndex: 'adminname',
            key: 'adminname',
            width: 100,
          },
          {
            title: '通话次数',
            dataIndex: 'callCount',
            key: 'callCount',
          },
          {
            title: '通话总时长',
            dataIndex: 'duration',
            key: 'duration',
            render: (text, record) => {
              const { duration } = record
              return (
                <span>{formatSeconds(duration)}</span>
              )
            }
          },
          {
            title: '平均时长',
            dataIndex: 'avgDuration',
            key: 'avgDuration',
            render: (text, record) => {
              const { avgDuration } = record
              return (
                <span>{formatSeconds(avgDuration)}</span>
              )
            }
          },


      ]
      const { rowSelection,stcallHistoryList, loading, total, currentPage, searchValue } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
            <ConfigProvider>
                <Table
                   rowSelection={rowSelection}
                   columns={columns}
                   dataSource={stcallHistoryList}
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
