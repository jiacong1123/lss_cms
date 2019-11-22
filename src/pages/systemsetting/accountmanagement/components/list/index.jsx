import React from 'react'
import {
    ConfigProvider, Table,Switch ,Modal,Button,Icon, Menu, Dropdown
} from 'antd';
import { DropOption } from 'components'
import styles from './index.less'

const confirm = Modal.confirm;


class List extends React.Component {

    state = {
      pagination: {},
      visible: false
    }

    // 点击操作按钮
    handleMenuClick = (adminid, e) => {
       if ( e.key === '1' ) {
         // 获取当前账号信息
         this.props.onGetCurrentAdmin({adminid})
         // 弹出编辑账号modal
         this.props.onIsShowModal({
            visible:true,
            title: '角色设置',
            modalKey: 'rolesetting'
         })
       } else if ( e.key === '2' ) {
         // 获取当前账号信息
         this.props.onGetCurrentAdmin({adminid})
         // 弹出编辑账号modal
         this.props.onIsShowModal({
            visible:true,
            title: '编辑账号',
            modalKey: 'edit'
         })

       } else if ( e.key === '3' ){
         // 删除账号
         confirm({
            title: '你确定要删除该账号吗?',
            content: '删除后不可恢复',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
              this.props.onOperateAdmin({adminid,status: -1})
            }
         })
       }
    }

    // 是否启用
    onSwitchChange = (adminid,value)=> {
       if (value) {
         this.props.onOperateAdmin({adminid,status: 1})
       } else {
         this.props.onOperateAdmin({adminid,status: 0})
       }
    }

    // 绑定话机及小号
    onBindPhone = (record, name)=> {
      const { adminid  } = record
      // 获取当前账号信息
      this.props.onGetCurrentAdmin({adminid})
      if (name == 'carl') {
        // 弹出编辑账号modal
        this.props.onIsShowModal({
          visible:true,
          title: '卡尔绑定话机号码',
          modalKey: 'bindphone'
       })
      } else {
        this.props.onBingECId(record)
       //  this.props.onIsShowModal({
       //    visible:true,
       //    title: 'EC绑定话机号码',
       //    modalKey: 'bindECId'
       // })
      }


    }



    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetAdminList({page: pagination.current, limit:10})
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
            title: '账号',
            dataIndex: 'loginame',
          },
          {
            title: '手机号码',
            dataIndex: 'phone',
          },
          {
            title: '机构',
            dataIndex: 'orgName',
          },
          {
            title: '部门/门诊:',
            dataIndex: 'clinicname',
          },
          {
            title: '职位/角色',
            dataIndex: 'roles',
            render:(roles)=>(
                roles ? roles.map((item,index)=>{
                return <span key={item.roleid}>{item.rolename}{ ((roles.length-1) !== index) ? ' / ' : null}</span>
              }) : null
            )
          },
          {
            title: '添加时间',
            dataIndex: 'createtime',
          },
          {
            title: '最近登录时间',
            dataIndex: 'logintime',
          },
          {
            title: '是否启用',
            dataIndex: 'status',
            fixed: 'right',
            width: 100,
            render: (status,record) => {
                const { adminid } = record
                return <Switch checked={ status === 1 ? true : false} size="small" onChange={this.onSwitchChange.bind(this,adminid)}/>
            }
          },
          {
            title: '绑定号码',
            key: 'bindphone',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { callerNos } = record
              return (
                <Dropdown overlay={
                <Menu>
                    {/*<Menu.Item key="1" onClick={ e => this.onBindPhone(record, 'carl') } >绑定卡尔小号</Menu.Item>*/}
                    <Menu.Item key="2" onClick={ e => this.onBindPhone(record, 'EC') } >绑定EC</Menu.Item>
                </Menu>
                }>
                <Button type="primary" size="small">{ callerNos ? '修改': '绑定'}</Button>
                </Dropdown>
              )
            }
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { adminid } = record
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(adminid, e)}
                  menuOptions={[
                  { key: 1, name: '角色设置' },
                  { key: 2, name: '编辑' },
                  { key: 3, name: '删除' },
                  ]}
              />
              )
            }
          }
      ]
      const { rowSelection,adminlist, loading, total, currentPage} = this.props
      const { pagination}  = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table
                 rowSelection={rowSelection}
                 columns={columns}
                 dataSource={adminlist}
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


export default List
