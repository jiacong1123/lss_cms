import React from 'react'
import {
    ConfigProvider, Table,Switch ,Modal,Badge,Button
} from 'antd';
import { DropOption } from 'components'
import { Trans } from '@lingui/react'
import PropTypes from 'prop-types'
import styles from './index.less'

const confirm = Modal.confirm;


class List extends React.Component {
    
      state = { 
        pagination: {}
      }

    // 确认支付
    handleConfirmPay = (orderno) => {
      confirm({
        title: '确定支付了吗',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          this.props.onConfirmPay({orderno})
        }
      })
    }

    // 跳转详情
    handleToDetail = (orderno) => {
      const { currentPage }  = this.props
      this.props.history.push({
        pathname: '/ordermanagement/orderdetail',
            query: {
              orderno,
              key: 'orderdetail',
              page: currentPage
            },
      })
    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetOrderList({page: pagination.current, limit:10})
    }

    render(){
      const columns = [
          {
            title: '订单编号',
            dataIndex: 'orderno',
          },
          {
            title: '产品名称',
            dataIndex: 'title',
          },
          {
            title: '产品价格',
            dataIndex: 'price',
          },
          {
            title: '创建时间',
            dataIndex: 'createtime',
            
          },
          {
            title: '支付时间',
            dataIndex: 'paytime',
            
          },
          {
            title: '电话',
            dataIndex: 'phone',
            
          },
          {
            title: '名称',
            dataIndex: 'name',
            
          },
          {
            title: '支付类型',
            dataIndex: 'paytype',
            render: (paytype) => (
                <span>{paytype ===1 ? '微信支付' : '银行转账'}</span>
            ),
          },
          {
            title: '状态',
            dataIndex: 'status',
            fixed: 'right',
            width: 100,
            render: (status) => (
                status === 0 ? <Badge status="error" text="未支付" /> : <Badge status="success" text="已支付" />
            ),
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 157,
            render: (text, record) => {
              const { status ,orderno } = record
              return (
                <div>
                  { status === 0  ? <Button type='primary' size='small' style={{marginRight:10}} onClick={this.handleConfirmPay.bind(this,orderno)}>确认支付</Button> : null}
                  <Button type='primary' size='small' onClick={this.handleToDetail.bind(this,orderno)}>详情</Button>
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


List.propTypes = {

}


export default List