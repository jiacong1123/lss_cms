import React from 'react'
import {
    ConfigProvider, Table,Switch ,Modal
} from 'antd';
import { DropOption } from 'components'
import { Trans } from '@lingui/react'
import ComModal from '../modal'
import PropTypes from 'prop-types'
import styles from './index.less'

const confirm = Modal.confirm;


class List extends React.Component {

      state = {
        pagination: {}
      }

      // 点击操作按钮
      handleMenuClick = (userid, e) => {
        if ( e.key === '1' ) {
          // 获取当前客户信息
          this.props.onGetCurrentUser({userid})
          // 弹出编辑客户modal
          this.props.onIsShowModal({
            visible:true,
            title: '编辑客户',
            modalKey: 'edit'
          })
        }
        if ( e.key === '2' ) {
          // 删除客户信息
          confirm({
            title: '你确定要删除该客户?',
            okText: '是',
            okType: 'success',
            cancelText: '否',
            onOk: () => {
              this.props.onDeleteCurrentUser({userid})
            }
          })
        }
    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetCustomList({page: pagination.current, limit:10})
    }

    render(){
      const columns = [
          {
            title: '姓名',
            dataIndex: 'name',
            fixed: 'left',
            width: 100,
          },
          {
            title: '手机号码',
            dataIndex: 'phone',
          },
          {
            title: '状态',
            key: 'orderstatus',
            render: (text, record) => {
              const { orderstatus, followup } = record
              const falg1  = false
              return (
                <span>
                  { orderstatus == 0 ? '未分配' :''}
                  { orderstatus == 2 ? '已预约' :''}
                  { orderstatus == 3 ? '已到店' :''}
                  { orderstatus == 4 ? '已完成' :''}
                  { orderstatus == 5 ? '已关闭' :''}
                  { orderstatus == 1 && followup > 0 ? '待跟进' : ''}
                  { orderstatus == 1 && followup == 0 ? '新分配' : ''}
                </span>

              )
            }
          },
          {
            title: '所属人员',
            dataIndex: 'adminname',
          },
          {
            title: '年龄',
            dataIndex: 'age',
          },

          {
            title: '性别',
            dataIndex: 'sex',
            render: (text, record)=> {
              const { sex }  = record
              return (
                <span>
                  {sex == 1 ? '男' : '' }
                  {sex == 2 ? '女' : '' }
                </span>
              )
            }
          },
          {
            title: '所在省市',
            dataIndex: 'address',
            render: (text, record)=> {
              const { province, city }  = record
              return <span>{ province && city ? `${province} | ${city}`: null }</span>
            }
          },
          {
            title: '一级来源',
            dataIndex: 'sourcename',
          },
          {
            title: '二级来源',
            dataIndex: 'sourcename2',
          },
          {
            title: '创建日期',
            dataIndex: 'createtime',
          },
          {
            title: '备注',
            dataIndex: 'notes',
            width: 300
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { userid } = record
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(userid, e)}
                  menuOptions={[
                  { key: '1', name: '编辑' },
                  { key: '2', name: '删除' },
                  ]}
              />
              )
            }
          }
      ]
      const { rowSelection,customlist, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table
                 rowSelection={rowSelection}
                 columns={columns}
                 dataSource={customlist}
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
