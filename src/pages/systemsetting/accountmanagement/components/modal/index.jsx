import React from 'react'
import { Modal, Form, Row, Col, Input, Select, Checkbox } from 'antd';
import ComSave from '../save'
import ComRoleSetting from '../rolesetting'
import ComBindPhone from '../bindphone'
import ComBindECId from '../bindecid'
import PropTypes from 'prop-types'
import styles from './index.less'


class ComModal extends React.Component {
    state = {
        checkedList: null
    }

    // 收集表单
    onOk = () => {
       const { modalKey } = this.props
       const { checkedList } = this.state
       if ( modalKey === 'add' || modalKey === 'edit'){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.onOk(values)
                }
            })
       } else if (modalKey === 'rolesetting') {
            if (checkedList) {
                this.props.onOk(checkedList)
            } else {
                this.onCancel()
            }
       } else if (modalKey === 'bindphone') {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.onOk(values)
                }
            })
       } else if (modalKey === 'bindECId') {
         this.props.form.validateFields((err, values) => {
             if (!err) {
                 this.props.onOk(values)
             }
         })
       }

    }

    // 关闭模态框，清空表单
    onCancel = () => {
        this.props.onIsShowModal({visible:false,title:'',currentAdmin: {}})
    }

    // 获取角色设置值
    getCheckedList = (checkedList) => {
        this.setState({checkedList})
    }

    // 渲染modal的内容
    renderModalChildren = () => {
        const {  modalKey } = this.props
        if ( modalKey === 'add' || modalKey === 'edit' ) {
            return <ComSave {...this.props}/>
        } else if( modalKey === 'rolesetting' ) {
            return <ComRoleSetting {...this.props} getCheckedList={this.getCheckedList}/>
        } else if( modalKey === 'bindphone' ) {
            return <ComBindPhone {...this.props}/>
        } else if (modalKey === 'bindECId') {
          return <ComBindECId {...this.props}/>
        }
    }


    render() {
        const {  title, visible } = this.props
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
                   { this.renderModalChildren() }
                </Modal>
            </div>
        )
    }
}

ComModal.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
}


export default Form.create({ name: 'Accountmanagement_ComModal' })(ComModal)
