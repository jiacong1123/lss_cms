import React from 'react'
import {
    ConfigProvider, Table ,Modal,Avatar
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import mixin from 'themes/mixin.less'
import { parseTime } from 'utils/mm'

const confirm = Modal.confirm;

class List extends React.Component {

      state = {
        pagination: {
          showSizeChanger: true,
          // onShowSizeChange: (current,pageSize) => this.onShowSizeChange(current,pageSize),
          pageSizeOptions: ['10', '20', '50', '100']
        }
      }
      // 点击操作按钮
      handleMenuClick = (orderno, e, name) => {
        if ( e.key === '1' ) {
          confirm({
            title: '你确定要领取： '+ name,
            okText: '是',
            okType: 'success',
            cancelText: '否',
            onOk: () => {
              this.props.onActiveOrder({orderno})
            }
          })
        } else if ( e.key === '2' ) {
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/worktaskdetail?key=worktaskdetail&orderno=${orderno}`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/worktaskdetail',
            query: {
              orderno,
              key: 'worktaskdetail'
            },
          })
        } else if( e.key === '3' ) {
          confirm({
            title: '你确定要删除该客户： '+ name,
            okText: '是',
            okType: 'success',
            cancelText: '否',
            onOk: () => {
              this.props.onDeleteOrder({orderno})
            }
          })
        } else if( e.key === '4' ) { //分配
          // 获取当前工单信息
          this.props.onGetCurrentOrder({orderno})
          // 弹出分配工单modal
          this.props.onIsShowModal({
            visible:true,
            title: '分配工单',
            modalKey: 'single'
          })
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
                <div className={mixin.lightHeight}>{name}</div>
              )
            }
          },
          {
            title: '电话',
            key: 'phone',
            render: (text, record) => {
              const { phone } = record
              return (
                <div className={mixin.lightHeight}>{phone}</div>
              )
            }
          },
          {
            title: '意愿等级',
            dataIndex: 'level',
          },
          {
            title: '客户标签',
            dataIndex: 'lablenames',
            width: 250,
            render: (text, record) => {
              const { lablenames, lableremarks } = record
              return (
                <p>
                <span style={{marginRight:20}}>{lablenames}</span>
                </p>
              )
            }
          },
          {
            title: '分配日期',
            key: 'allottime',
            width: 150,
            render: (text, record) => {
              const { allottime } = record
              return (
                <span>{allottime ? parseTime(allottime) : ''}</span>
              )
            }
          },
          {
            title: '关闭日期',
            key: 'followuptime',
            width: 150,
            render: (text, record) => {
              const { followuptime } = record
              return (
                <span>{followuptime ? parseTime(followuptime) : ''}</span>
              )
            }
          },
          {
            title: '所属门诊',
            dataIndex: 'clinicname',
          },
          {
            title: '预约项目',
            dataIndex: 'project',
          },
          {
            title: '所属人员',
            dataIndex: 'adminname',
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { orderno, name } = record
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(orderno, e, name)}
                  menuOptions={[
                     { key: '4', name: '分配' },
                     { key: '1', name: '领取' },
                     { key: '2', name: '详情' },
                     { key: '3', name: '删除' },
                  ]}
              />
              )
            }
          }
      ]
      const { rowSelection,orderlist, loading, total, currentPage, currentSize } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table
                 rowSelection={rowSelection}
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
