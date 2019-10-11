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
      handleMenuClick = (actid, e) => {
        if ( e.key === '1' ) {
          // 获取当前新闻信息
          this.props.onGetCurrentActive({
            actid,
            callback: () => {
              // 弹出编辑新闻modal
              this.props.onIsShowModal({
                visible:true,
                title: '编辑活动',
                modalKey: 'edit'
              })
            }
          })
        } else if (  e.key === '2' ) {
          // 删除新闻
          confirm({
            title: '你确定要删除该新闻吗?',
            content: '删除后不可恢复',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              this.props.onOperActive({actid,status: -1})
            }
          })
        } 
    }

    // 是否启用
    onSwitchChange = (actid,value)=> {
      if (value) {
        this.props.onOperActive({actid,status: 1})
      } else {
        this.props.onOperActive({actid,status: 0})
      }
   }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetActiveList({page: pagination.current, limit:10})
    }

    render(){
      const columns = [
        {
          title: '活动id',
          dataIndex: 'actid',
        },
        {
          title: '活动标题',
          dataIndex: 'title',
        },
        {
          title: '开始时间',
          dataIndex: 'start',
          
        },
        {
          title: '结束时间',
          dataIndex: 'end',
          
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
            const { actid , status } = record
            return <Switch checked={ status === 1 ? true : false} size="small" onChange={this.onSwitchChange.bind(this,actid)}/>
           },

        },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { actid } = record
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(actid, e)}
                  menuOptions={[
                     { key: '1', name: '编辑' },
                     { key: '2', name: '删除' }
                  ]}
              />
              )
            }
          }
      ]
      const { rowSelection,avtivelist, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table 
                 rowSelection={rowSelection} 
                 columns={columns} 
                 dataSource={avtivelist}  
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