import React, { PureComponent, Fragment } from 'react'
import {
    Tree, Modal,  Button, Icon, Alert, Dropdown, Menu
} from 'antd';
import styles from './index.less'
import Edit from '../edit'

const confirm = Modal.confirm;
const { TreeNode } = Tree;



class List extends React.Component {

    onShowModal = (title,modalKey) => {
        this.props.onIsShowModal({
            visible:true,
            title,
            modalKey
        })
    }

    onSelect = (selectedKeys, info) => {
          let id = info.node.props.eventKey
          let orgName = info.node.props.title
          let parentId = info.node.props.parentId
          let remark = info.node.props.remark

          this.props.OnSetClickTree({
            editId: id,
            editName: orgName,
            editParentId: parentId,
            editRemark: remark
          })
    };

    renderTree = data => {
      return data ? data.map((item,index)=> {
        if (item.child) {
          return (
            <TreeNode title={item.orgName} key={item.id}  parentId={item.parentId} remark={item.remark}>{this.renderTree(item.child)}</TreeNode>
          )
        }
        return (
          <TreeNode title={item.orgName} key={item.id}  parentId={item.parentId} remark={item.remark}></TreeNode>
        )
      }) : null
    }


    render(){
      const {orgList} = this.props
      return (
        <div className={styles.cf}>
          <div className={styles.leftBox}>
            <Tree showLine defaultExpandAll onSelect={this.onSelect}>
              <TreeNode title={orgList.orgName} key={orgList.id} parentId={orgList.parentId} remark={orgList.remark}>
                {this.renderTree(orgList.child)}
              </TreeNode>

            </Tree>
          </div>
          <div className={styles.rightBox}>
            <Button type="primary" icon="plus"  className={styles.addBtn} onClick={this.onShowModal.bind(this,'新增机构','add')}>新增机构</Button>
            <Edit {...this.props}/>

          </div>
      </div>
      )

    }
}



export default List
