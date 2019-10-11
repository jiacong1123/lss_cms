import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon} from 'antd';
import moment from 'moment'
import city from 'utils/city'
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
const RadioGroup = Radio.Group
const { TextArea } = Input;

class ComSave extends React.Component {
    state = {
        isChangeClinic: false
    }
    onChangeClinic = (key,value) => {
        this.props.form.resetFields(['doctorid', ''])
        this.setState({isChangeClinic:true})
        this.props.onGetDoctorDropmenu({[key]: value})
    }

    render() {
        const { currentScience,clinicdropmenu,doctordropmenu } = this.props
        const { getFieldDecorator } = this.props.form
        const { isChangeClinic } = this.state
        if ( isChangeClinic ) currentScience['doctorid'] = ''
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label='标题' {...formItemLayout}>
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入标题'
                                    }
                                ],
                                initialValue: currentScience ? currentScience.title : ""
                            })(
                                <Input placeholder="请输入标题"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='回答' {...formItemLayout}>
                            {getFieldDecorator('answer', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入回答'
                                    }
                                ],
                                initialValue: currentScience && currentScience.answer?  currentScience.answer : ""
                            })(
                                <TextArea rows={4} placeholder="请输入回答"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                         <Form.Item label='诊所' {...formItemLayout}>
                            {getFieldDecorator('clinicid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择诊所'
                                    }
                                ],
                                initialValue: currentScience && currentScience.clinicid? currentScience.clinicid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择诊所"
                                    optionFilterProp="clinicid"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange={this.onChangeClinic.bind(this,'clinicid')}
                                >
                                    <Option key='' value=''>选择诊所</Option>
                                    {clinicdropmenu && clinicdropmenu.length > 0 ? clinicdropmenu.map(item => {
                                        return <Option key={item.clinicid} value={item.clinicid}>{item.shortname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                         <Form.Item label='医生' {...formItemLayout}>
                            {getFieldDecorator('doctorid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择医生'
                                    }
                                ],
                                initialValue: currentScience && currentScience.doctorid ? currentScience.doctorid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择医生"
                                    optionFilterProp="doctorid"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    disabled={ doctordropmenu && doctordropmenu.length > 0 ? false : true}
                                >
                                    <Option key='' value=''>选择医生</Option>
                                    {doctordropmenu && doctordropmenu.length > 0 ? doctordropmenu.map(item => {
                                        return <Option key={item.doctorid} value={item.doctorid}>{item.name}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                       <Form.Item label='回答时间' {...formItemLayout}>
                            {getFieldDecorator('answertime', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择回答时间'
                                    }
                                ],
                                initialValue: currentScience && currentScience.answertime ? moment(currentScience.answertime, 'YYYY/MM/DD') : ''
                            })(
                                <DatePicker format='YYYY/MM/DD'/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='状态设置' {...formItemLayout}>
                            {getFieldDecorator('status', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择状态'
                                    }
                                ],
                                initialValue: currentScience && currentScience.status ? currentScience.status : 1
                            })(
                                <RadioGroup>
                                    <Radio value={1}>启用</Radio>
                                    <Radio value={2}>禁用</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
        )
    }
}


export default ComSave