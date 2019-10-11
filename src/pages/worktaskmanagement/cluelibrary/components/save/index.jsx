import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon} from 'antd';
import moment from 'moment'
import city from 'utils/city'
import PropTypes from 'prop-types'
import styles from './index.less'

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 16},
        sm: { span: 16 },
    },
}


const formItemLayout1 = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24},
        sm: { span: 20 },
    },
}

const Option = Select.Option;
const RadioGroup = Radio.Group
const { TextArea } = Input;

class ComSave extends React.Component {

    state = {
        loading: false,
        imageUrl:null
    }

    render() {
        const { currentClue,usertype,reservedpro, times} = this.props
        console.log(currentClue);
        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row className={styles.infoBox}>
                    <Col span={24}>
                        <Col span={8}>
                            <Form.Item label='客户姓名:' {...formItemLayout}>
                                {currentClue && currentClue.name ? currentClue.name : ''}
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item label='电话号码:' {...formItemLayout}>
                                {currentClue && currentClue.phone ? currentClue.phone : ''}
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item label='性别:' {...formItemLayout}>
                                {currentClue && currentClue.sex ?
                                  <span>
                                  {currentClue.sex == 1 ? '男' : ''}
                                  {currentClue.sex == 2 ? '女' : ''}
                                  {currentClue.sex == 3 || null ? '未知' : ''}
                                </span> : ''}
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item label='来源:' {...formItemLayout}>
                                {currentClue && currentClue.source ? currentClue.source  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item label='来源日期:' {...formItemLayout}>
                                {currentClue && currentClue.sourcedate ? currentClue.sourcedate  : ''}
                            </Form.Item>
                        </Col>
                    </Col>
                    <Col span={8} id="addressCascader">
                        <Form.Item label='所在省市'  {...formItemLayout1} >
                            {getFieldDecorator('addressKey', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入选择省市'
                                    }
                                ],
                                initialValue: currentClue ? currentClue.addressKey : ""
                            })(
                                <Cascader
                                    style={{ width: '100%' }}
                                    options={city}
                                    placeholder='请选择省市'
                                    getPopupContainer={() =>
                                        document.getElementById('addressCascader')
                                    }
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='主诉' {...formItemLayout1}>
                            {getFieldDecorator('projectid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择主诉'
                                    }
                                ],
                                initialValue: currentClue && currentClue.projectid ? currentClue.projectid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择主诉"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择</Option>
                                    {reservedpro && reservedpro.length > 0 ? reservedpro.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='预约日期' {...formItemLayout1}>
                            {getFieldDecorator('reservedate', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择预约日期'
                                    }
                                ],
                                initialValue: currentClue && currentClue.reservedate ? moment(currentClue.reservedate, 'YYYY/MM/DD') : ''
                            })(
                                <DatePicker format='YYYY/MM/DD'/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='客户类型' {...formItemLayout1}>
                            {getFieldDecorator('usertype', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择客户类型'
                                    }
                                ],
                                initialValue: currentClue && currentClue.usertype ? currentClue.usertype : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择客户类型"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择</Option>
                                    {usertype && usertype.length > 0 ? usertype.map(item => {
                                        return <Option key={item.code} value={item.code}>{item.lableName}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='意愿等级' {...formItemLayout1}>
                            {getFieldDecorator('level', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择意愿等级'
                                    }
                                ],
                                initialValue: currentClue && currentClue.level ? currentClue.level : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择意愿等级"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value=''>选择</Option>
                                    <Option value='A'>A</Option>
                                    <Option value='B'>B</Option>
                                    <Option value='C'>C</Option>
                                    <Option value='D'>D</Option>
                                    <Option value='E'>E</Option>

                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='主诉' {...formItemLayout1}>
                            {getFieldDecorator('complaint', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入主诉'
                                    }
                                ],
                                initialValue: currentClue && currentClue.complaint?  currentClue.complaint : ""
                            })(
                                <TextArea rows={4} placeholder="请输入主诉"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='备注' {...formItemLayout1}>
                            {getFieldDecorator('worknotes', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入备注'
                                    }
                                ],
                                initialValue: currentClue && currentClue.worknotes?  currentClue.worknotes : ""
                            })(
                                <TextArea rows={4} placeholder="请输入备注"/>
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
