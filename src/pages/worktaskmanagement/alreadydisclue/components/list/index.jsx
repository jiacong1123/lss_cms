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
        pagination: {}
      }

      // 点击操作按钮
      handleMenuClick = (record, e) => {
        const { orderno , usertype} = record
        const _this = this
        if ( e === 1 ) {
          this.props.onGetCurrentClue({orderno})
          this.props.onIsShowModal({
            visible:true,
            title: '线索详情',
            modalKey: 'clueinfo'
          })
        } else if (  e === 2 ) {
          confirm({
            title: '确定已经到店?',
            onOk() {
              _this.props.onAlreadyShop({
                orderno,
                status: 'confirm'
              })
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        } else if (  e === 3 ) {
          confirm({
            title: '确定取消?',
            onOk() {
              _this.props.onAlreadyShop({
                orderno,
                status: 'cancel'
              })
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }
    }
    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetOrderList({page: pagination.current, limit:10,...searchValue})
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
            title: '年龄',
            dataIndex: 'age',
          },


          {
            title: '预约项目',
            dataIndex: 'project',

          },
          {
            title: '线索类型',
            dataIndex: 'usertypename',
          },
          {
            title: '操作类型',
            dataIndex: 'ordertype',
            render: (text, record) => {
              const { ordertype } = record
              return (
                <span>{ ordertype === 1 ? '接单': '派单'}</span>
              )
            }
          },
          {
            title: '状态',
            dataIndex: 'cluestatus',
            render: (text, record) => {
              const { cluestatus } = record
              return (
                <span>{ cluestatus === 0 ? '可抢': (cluestatus === 1 ? '已接诊': '冻结中' ) }</span>
              )
            }
          },
          {
            title: '接单门诊',
            dataIndex: 'clinicname',
          },
          {
            title: '接单时间',
            dataIndex: 'visitingtime',
          },

          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 80,
            render: (text, record) => {
              const { orderno,isclue,cluestatus } = record
              return (
              <div className={styles.operBtnBox}>
               { cluestatus === 2 ? <Button type="danger" size="small" onClick={e => this.handleMenuClick(record, 2)}>到店</Button>: ''}
               { cluestatus === 2 ? <Button size="small" onClick={e => this.handleMenuClick(record, 3)}>取消</Button> : ''}
                <Button size="small" onClick={e => this.handleMenuClick(record, 1)}>详情</Button>
              </div>
              )
            }
          }
      ]
      const { rowSelection, orderlist, loading, total, currentPage } = this.props
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
