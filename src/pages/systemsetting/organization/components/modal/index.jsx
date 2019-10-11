import React from 'react'
import { Modal, Form, Row, Col, Input, Select, Checkbox } from 'antd';
import ComSave from '../save'
import PropTypes from 'prop-types'
import styles from './index.less'


class ComModal extends React.Component {

    // 收集表单
    onOk = () => {
       const { modalKey } = this.props
       if ( modalKey === 'add'){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.onOk(values)
                }
            })
       }
    }

    // 关闭模态框，清空表单
    onCancel = () => {
        this.props.onIsShowModal({visible:false,title:'',currentUser:{}})
    }

    // 渲染modal的内容
    renderModalChildren = () => {
        const {  modalKey } = this.props
        if ( modalKey === 'add') {
            return <ComSave {...this.props}/>
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
                    width={700}
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
