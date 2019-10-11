import React from 'react'
import { Modal, Form } from 'antd';
import ComSave from '../save'
import ComBatch from '../batch'
import PropTypes from 'prop-types'
import styles from './index.less'


class ComModal extends React.Component {
 
    // 收集表单
    onOk = () => {
       const { modalKey } = this.props
       if ( modalKey === 'add' || modalKey === 'edit' || modalKey === 'batch' || modalKey === 'single'){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.onOk(values)
                }
            })
       }
    }

    // 关闭模态框，清空表单
    onCancel = () => {
        this.props.onIsShowModal({visible:false,title:'',currentOrder:{}})
    }

    // 渲染modal的内容
    renderModalChildren = () => {
        const {  modalKey } = this.props
        if ( modalKey === 'add' || modalKey === 'edit' ) {
            return <ComSave {...this.props}/>
        } else if ( modalKey === 'batch' || modalKey === 'single' ) {
            return <ComBatch {...this.props}/>
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
