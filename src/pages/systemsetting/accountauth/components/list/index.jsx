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
        title: '',
        roleid: ''
    }
    
    // 弹出模态框
    handleMenuClick = (roleid, e) => {
        if (e.key === '1' ) {
           this.props.onGetRoleAuth({roleid})
           this.setState({roleid})
           this.onShowModel('权限设置',true)
        } 
    }

    // 点击确定模态框
    onOk = (values) => {
      const {roleid} = this.state
      this.props.onEditRoleAuth({roleid,popeids:values})
    }
     
     // 点击取消模态框
    onCancel = () => {
         this.onShowModel('',false)
    }
    
    onShowModel = (title,visible) => {
        this.props.onIsShowModal({visible})
        this.setState({ title:title})
    }

    render(){
      const columns = [
          {
            title: '序号',
            dataIndex: 'roleid',
            fixed: 'left',
            width: 100,
          },
          {
            title: '职位/角色',
            dataIndex: 'rolename',
          },
          {
            title: '岗位描述',
            dataIndex: 'desc',
          },
          {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
              const { roleid } = record
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(roleid, e)}
                  menuOptions={[
                  { key: '1', name: '权限设置' }
                  ]}
              />
              )
            }
          }
      ]
      const { title } = this.state
      const {  rolelist , loading, visible } = this.props
      return (
          <ConfigProvider>
              <Table 
                 columns={columns} 
                 dataSource={rolelist}  
                 loading={loading} 
                 bordered
              />
              { visible && !loading ? <ComModal 
                {...this.props} 
                visible={visible} 
                title={title} 
                onOk={this.onOk} 
                onCancel={this.onCancel} 
              /> : null}
          </ConfigProvider>
      )
    }
}


List.propTypes = {

}


export default List