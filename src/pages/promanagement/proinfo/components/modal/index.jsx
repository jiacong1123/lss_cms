import React from 'react'
import { Modal, Form } from 'antd';
import { _mmHandleUploadImage } from 'utils/mm'
import ComSave from '../save'
import PropTypes from 'prop-types'
import styles from './index.less'


class ComModal extends React.Component {
    state = {
        fileList: []
    }

    // 收集表单
    onOk = () => {
       const { modalKey } = this.props
       const { fileList } = this.state
       if ( modalKey === 'add' || modalKey === 'edit' ){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const list =  _mmHandleUploadImage(fileList)
                    values['list'] = list
                    values['image'] = list[0]['image']
                    this.props.onOk(values)
                }
            })
       }
    }
    
    // 关闭模态框，清空表单
    onCancel = () => {
        this.props.onIsShowModal({visible:false,title:'',currentPro:{},editorState:''})
    }
    
    getImageList = (fileList) => {
        this.setState({
            fileList
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
                    width={1000}
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