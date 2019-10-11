import React from 'react'
import {
    ConfigProvider, Table ,Modal,Avatar
} from 'antd';
import { DropOption } from 'components'
import styles from './index.less'

const confirm = Modal.confirm;


class List extends React.Component {
    
      state = { 
        pagination: {}
      }

      // 点击操作按钮
      handleMenuClick = (doctorid, e) => {
        if ( e.key === '1' ) {
          // 获取当前医生信息
          this.props.onGetCurrentDoctor({doctorid})
          // 弹出编辑医生modal
          this.props.onIsShowModal({
            visible:true,
            title: '编辑医生',
            modalKey: 'edit'
          })
        } else if (  e.key === '2' ) {
            // 删除医生
            confirm({
              title: '你确定要删除该医生吗?',
              content: '删除后不可恢复',
              okText: '是',
              okType: 'danger',
              cancelText: '否',
              onOk: () => {
                this.props.onDeleteDoctor({doctorid})
              }
            })
        }
    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetDoctorList({page: pagination.current, limit:10})
    }

    render(){
      const columns = [
          {
            title: '医生姓名',
            dataIndex: 'name',
          },
          {
            title: '头像',
            dataIndex: 'photo',
            render: (photo) => {
              return  <Avatar src={photo} />
            }
          },
          {
            title: '性别',
            dataIndex: 'sex',
            render: (sex) => {
              return <span>{sex ===1 ? '男': '女'}</span>
            }
          },
          {
            title: '职称',
            dataIndex: 'jobtitle',
            
          },
          {
            title: '所属诊所',
            dataIndex: 'shortname',
          },
          {
            title: '科室',
            dataIndex: 'department',
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
          },
          {
            title: '擅长',
            dataIndex: 'goodat',
          },
          {
            title: '医生简介',
            dataIndex: 'synopsis',
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { doctorid } = record
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(doctorid, e)}
                  menuOptions={[
                     { key: '1', name: '编辑' },
                     { key: '2', name: '删除' },
                  ]}
              />
              )
            }
          }
      ]
      const { rowSelection,doctorlist, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table 
                 rowSelection={rowSelection} 
                 columns={columns} 
                 dataSource={doctorlist}  
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