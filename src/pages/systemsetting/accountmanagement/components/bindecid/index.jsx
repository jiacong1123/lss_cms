import React from 'react'
import {  Form, Row, Col, Input, Select } from 'antd';
import PropTypes from 'prop-types'
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


const Option = Select.Option;

class ComBindECId extends React.Component {
    render() {
        const { currentAdmin, clinicdropmenu } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>

                    <Col span={24}>
                        <Form.Item label='话机号码' {...formItemLayout}>
                            {getFieldDecorator('callerNos', {
                                rules: [
                                    {
                                        pattern: '^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\\d{8}$',
                                        message: '请输入正确的话机号码'
                                    }
                                ],
                                initialValue: currentAdmin ? currentAdmin.callerNos : ""
                            })(
                                <Input placeholder="请输入话机号码" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='小号' {...formItemLayout}>
                            {getFieldDecorator('transferNo', {
                                rules: [
                                    {
                                        pattern: '^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\\d{8}$',
                                        message: '请输入正确的小号'
                                    }
                                ],
                                initialValue: currentAdmin ? currentAdmin.transferNo : ""
                            })(
                                <Input placeholder="请输入小号" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            </div>
        )
    }
}


export default ComBindECId
