import React from 'react'
import {
    ConfigProvider, Table ,Modal
} from 'antd';
import { DropOption } from 'components'
import styles from './index.less'

const confirm = Modal.confirm;


class List extends React.Component {
    
      state = { 
        pagination: {}
      }

      // 点击操作按钮
      handleMenuClick = (clinicid, e) => {
        if ( e.key === '1' ) {
          // 获取当前客户信息
          this.props.onGetCurrentClinic({clinicid})
          // 弹出编辑客户modal
          this.props.onIsShowModal({
            visible:true,
            title: '编辑门诊',
            modalKey: 'edit'
          })
        } else if (  e.key === '2' ) {
            // 删除门诊
            confirm({
              title: '你确定要删除该门诊吗?',
              content: '删除后不可恢复',
              okText: '是',
              okType: 'danger',
              cancelText: '否',
              onOk: () => {
                this.props.onDeleteClinic({clinicid})
              }
          })
        }
    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetClinicList({page: pagination.current, limit:10})
    }

    render(){
      const columns = [
          {
            title: '门诊名称',
            dataIndex: 'name',
            fixed: 'left',
            width: 100,
          },
          {
            title: '简称',
            dataIndex: 'shortname',
          },
          {
            title: '前台电话',
            dataIndex: 'telephone',
          },
          {
            title: '负责人',
            dataIndex: 'principal',
          },
          {
            title: '所在省市',
            dataIndex: 'address',
            render: (text, record)=> {
              const { province, city,area  }  = record
              return <span>{ city && area ? `${city} | ${area}`: null }</span>
            }
          },
          {
            title: '类型',
            dataIndex: 'type',
            render: (type) => (
                <span>{type ===1 ? '自有' : '合作'}</span>
            )
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { clinicid } = record
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(clinicid, e)}
                  menuOptions={[
                     { key: '1', name: '编辑' },
                     { key: '2', name: '删除' },
                  ]}
              />
              )
            }
          }
      ]
      const { rowSelection,cliniclist, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table 
                 rowSelection={rowSelection} 
                 columns={columns} 
                 dataSource={cliniclist}  
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