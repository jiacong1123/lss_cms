import React from 'react'
import { Modal, Form, Row, Col, Input, Select, Checkbox } from 'antd';
import ComSave from '../save'
import PropTypes from 'prop-types'
import { _mmHandleUploadImageA } from 'utils/mm'
import styles from './index.less'


class ComModal extends React.Component {
    state = {
        fileListA: [],
        fileListB: [],
        fileListC: []
    }
    // 收集表单
    onOk = () => {
       const { modalKey } = this.props
       const { fileListA,fileListB,fileListC} = this.state
       if ( modalKey === 'add' || modalKey === 'edit'){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    values['milieupicture'] = _mmHandleUploadImageA(fileListA)
                    values['devicepicture'] = _mmHandleUploadImageA(fileListB)
                    values['image'] = _mmHandleUploadImageA(fileListC)
                    this.props.onOk(values)
                }
            })
       }
    }
    
    // 关闭模态框，清空表单
    onCancel = () => {
        this.props.onIsShowModal({visible:false,title:'',currentClinic:{}})
    }

    getImageList = (key,fileList) => {
        this.setState({
            [key]:fileList
        })
    }
    
    // 渲染modal的内容
    renderModalChildren = () => {
        const {  modalKey } = this.props
        if ( modalKey === 'add' || modalKey === 'edit' ) {
            return <ComSave {...this.props} getImageList={this.getImageList} {...this.state}/>
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