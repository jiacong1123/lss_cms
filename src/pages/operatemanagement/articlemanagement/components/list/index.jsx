import React from 'react'
import {
    ConfigProvider, Table ,Modal,Avatar,Switch,Badge
} from 'antd';
import router from 'umi/router'
import { DropOption } from 'components'
import styles from './index.less'

const confirm = Modal.confirm;


class List extends React.Component {
    
      state = { 
        pagination: {}
      }

      // 点击操作按钮
      handleMenuClick = (id, e) => {
        if ( e.key === '1' ) {
          // 获取当前文章信息
          this.props.onGetCurrentScience({id})
          // 弹出编辑工单modal
          this.props.onIsShowModal({
            visible:true,
            title: '编辑文章',
            modalKey: 'edit'
          })

        } else if (  e.key === '2' ) {
          // 删除文章
          confirm({
            title: '你确定要删除该文章吗?',
            content: '删除后不可恢复',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              this.props.onOperScience({id,status: -1})
            }
          })
        } 
    }

    // 是否启用
    onSwitchChange = (id,value)=> {
      if (value) {
        this.props.onOperScience({id,status: 1})
      } else {
        this.props.onOperScience({id,status: 0})
      }
   }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetScienceList({page: pagination.current, limit:10})
    }

    render(){
      const columns = [
        {
          title: ' 标题',
          dataIndex: 'title',
        },
        {
          title: '回答',
          dataIndex: 'answer',
        },
        {
          title: '医生',
          dataIndex: 'doctors',
          
        },
        {
          title: '诊所',
          dataIndex: 'clinic',
          
        },
        {
          title: '职称',
          dataIndex: 'jobtitle',
          
        },
        {
          title: '回答时间',
          dataIndex: 'answertime',
        },
        {
          title: '状态',
          dataIndex: 'status',
          render: (status) => {
            return  status === 1 ? <Badge status="processing" text="正常" /> : <Badge status="error" text="停用" />
           },
        },
        {
          title: '发布',
          render: (text,record) => {
            const { id , status } = record
            return <Switch checked={ status === 1 ? true : false} size="small" onChange={this.onSwitchChange.bind(this,id)}/>
           },

        },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { id } = record
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(id, e)}
                  menuOptions={[
                     { key: '1', name: '编辑' },
                     { key: '2', name: '删除' }
                  ]}
              />
              )
            }
          }
      ]
      const { rowSelection,sciencelist, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table 
                 rowSelection={rowSelection} 
                 columns={columns} 
                 dataSource={sciencelist}  
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