import React from 'react'
import { Modal, Form, Tree} from 'antd';
import PropTypes from 'prop-types'
import { _mmHandleTreeData } from 'utils/mm'
import styles from './index.less'
const { TreeNode } = Tree;

class ComModal extends React.Component {

    state = {
        expandedKeys: [],    // 默认展开的key
        autoExpandParent: true,
        checkedKeys: []    // 默认选中的key,
    }

    componentDidMount = () => {
        const { authlist, roleauth } = this.props
        this.initTreeKeys(authlist,roleauth)
    }

    // 收集表单
    onOk = () => {
       const { checkedKeys } = this.state
       const { authlist } = this.props
       const selectedKeys = []
       const values = this.filterTreeData(authlist,checkedKeys,selectedKeys)
       this.props.onOk(values)
    }

    // 关闭模态框，清空表单
    onCancel = () => {
        this.props.onCancel()
    }
    
    // 展开树
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        })
    }
    
    // 选中某个节点
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys })
    }
    
    // 初始化tree
    initTreeKeys = (data,initdata)=> {
        const { checkedKeys, expandedKeys} = this.state
        data.forEach(item=>{
            initdata.forEach(value=>{
                if ( item['popeid'] === value ) {
                    expandedKeys.push(value.toString())
                    if (item['list'] && item['list'].length > 0) {
                        this.initTreeKeys(item['list'],initdata)
                    }else {
                        checkedKeys.push(value.toString())
                    }
                } 
            })
        })
    }

    // 处理成接口需要的数据
    filterTreeData = (data,checkedKeys,selectedKeys) => {
        data.forEach(item=>{
            if(  checkedKeys.indexOf(item['popeid']) > -1 || checkedKeys.indexOf(item['popeid'].toString()) > -1){
                selectedKeys.push(item['popeid'].toString())
               if ( item['list'] && item['list'].length > 0) {
                  this.filterTreeData(item['list'],checkedKeys,selectedKeys)
               }
               if (item['parentid'] && selectedKeys.indexOf(item['parentid'].toString()) === -1 ) {
                  selectedKeys.push(item['parentid'].toString())
               }
              
            } else {
                if ( item['list'] && item['list'].length > 0) {
                    this.filterTreeData(item['list'],checkedKeys,selectedKeys)
                }
            }
        })

        return selectedKeys
    }
     
    // 渲染tree
    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    })


    render() {
        const { title, visible, authlist } = this.props
        const { expandedKeys,checkedKeys } = this.state
        return (
            <div className={styles.oper}>
                <Modal
                    title={title}
                    visible={visible}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    width={500}
                    destroyOnClose={true}
                >
                    <Tree
                        checkable
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={checkedKeys}
                    >
                        {this.renderTreeNodes(_mmHandleTreeData(authlist,'name','popeid','list'))}
                    </Tree>
                </Modal>
            </div>
        )
    }
}

ComModal.propTypes = {
    title: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool
}


export default Form.create({ name: 'Accountmanagement_AccountModal' })(ComModal)