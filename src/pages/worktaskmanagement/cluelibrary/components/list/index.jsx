import React from 'react'
import {
    ConfigProvider, Table ,Modal,Button
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import mixin from 'themes/mixin.less'

const confirm = Modal.confirm;

class List extends React.Component {

      state = {
        pagination: {
          showSizeChanger: true,
          onShowSizeChange: (current,pageSize) => this.onShowSizeChange(current,pageSize),
          pageSizeOptions: ['10', '20', '50', '100']
        }
      }

      // 点击操作按钮
      handleMenuClick = (record, e) => {
        const { orderno , usertype } = record
        if ( e === 1 ) {
          // 获取当前工单信息
          this.props.onGetCurrentClue({orderno})
          // 弹出编辑工单modal
          this.props.onIsShowModal({
            visible:true,
            title: '编辑线索',
            modalKey: 'editClue'
          })
        } else if (  e === 2 ) {
          this.props.getServiceList({
            start: 0,
            limit: 10,
            userType: usertype,
            record
          })
          this.props.onIsShowModal({
            visible:true,
            title: '派单',
            modalKey: 'disclue',
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
            title: '所在省市区',
            render: (text, record) => {
              const { province,city,area } = record
              return (
              <div className={styles.operBtnBox}>
                { province ? `${province}/` : ''}{city ? `${city}/` : ''} {area}
              </div>
              )
            }

          },
          {
            title: '预约项目',
            dataIndex: 'project',

          },
          {
            title: '预约日期',
            dataIndex: 'reservedate',

          },
          {
            title: '客户类型',
            dataIndex: 'usertypename',

          },

          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { orderno,isclue } = record
              return (
              <div className={styles.operBtnBox}>
                <Button type="danger" size="small" onClick={e => this.handleMenuClick(record, 2)}>派单</Button>
                <Button size="small" onClick={e => this.handleMenuClick(record, 1)}>编辑</Button>
              </div>
              )
            }
          }
      ]
      const { rowSelection,orderlist, loading, total, currentPage } = this.props
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
