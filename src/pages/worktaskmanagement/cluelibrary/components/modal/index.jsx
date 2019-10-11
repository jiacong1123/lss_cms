import React from 'react'
import { Modal, Form,Button } from 'antd';
import ComSave from '../save'
import ComDisClue from '../disclue'
import PropTypes from 'prop-types'
import styles from './index.less'


class ComModal extends React.Component {

    // 收集表单
    onOk = () => {
       const { modalKey } = this.props
       if ( modalKey === 'add' || modalKey === 'editClue' || modalKey === 'batch' || modalKey === 'single'){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.onOk(values)
                }
            })
       }
    }
    
    // 关闭模态框，清空表单
    onCancel = () => {
        this.props.onIsShowModal({visible:false,title:'',currentClue:{},servicelist:[]})
    }
    
    // 渲染modal的内容
    renderModalChildren = () => {
        const {  modalKey } = this.props
        if ( modalKey === 'add' || modalKey === 'editClue' ) {
            return <ComSave {...this.props}/>
        } 

        if ( modalKey === 'disclue') {
            return <ComDisClue {...this.props}/>
        } 
    }
    

    render() {
        const {  title, visible, modalKey } = this.props
        return (
            <div className={styles.oper}>
                <Modal
                    title={title}
                    visible={visible}
                    onOk={this.onOk}
                    onCancel={this.onCancel}
                    width={1000}
                    centered
                    destroyOnClose={true}
                    footer={ modalKey === 'disclue' ? null : <div><Button onClick={this.onCancel}>取消</Button><Button type="primary" onClick={this.onOk}>确定</Button></div>}
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