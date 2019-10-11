import React from 'react'
import { Form, Icon, Input, Modal, Button } from 'antd'
import styles from './index.less'

const formItemLayout = {
  labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
  },
  wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
  },
}


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UpdatePassword extends React.Component {

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
         this.props.handleOk(values)
      }
    });
  }

  handleCancel = () => {
    this.props.onIsShowModal({
      visible: false,
      title: '修改密码',
    })
  }

  render() {
    const { visible, title } = this.props
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <Form.Item label='旧密码' {...formItemLayout}>
              {getFieldDecorator('oldpassword', {
                rules: [
                  {
                    required: true,
                    message: '请输入旧密码'
                  }
                ]
              })(
                <Input placeholder="请输入旧密码"/>
              )}
            </Form.Item>
            <Form.Item label='新密码' {...formItemLayout}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入新密码'
                  }
                ]
              })(
                <Input placeholder="请输入新密码" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create({ name: 'horizontal_UpdatePassword' })(UpdatePassword)
