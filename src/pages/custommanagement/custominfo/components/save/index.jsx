import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker } from 'antd';
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
const RadioGroup = Radio.Group;
const { TextArea } = Input;


class ComSave extends React.Component {

  //在编辑时获取对应二级来源
  componentDidMount() {
      const { modalKey, currentUser } = this.props
      const { sourceid, sourceid2 } = currentUser

      if (modalKey == 'edit' && sourceid2) {
        //显示出对应的二级来源
        this.props.onGetSourceChild({
          tagid: sourceid,
        })
        //存储对应二级来源
        this.props.onSetSourceChild({
          tagid2: sourceid2,
        })
      }
  }

  handleSourceChange = value => {
    this.props.onGetSourceChild({
      tagid: value,
    })
  }

  handleSourceChild = value => {
    this.props.onSetSourceChild({
      tagid2: value,
    })
  }


    render() {
        const { currentUser, jobordersource, jobordersourcechild } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='姓名' {...formItemLayout}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入姓名'
                                    }
                                ],
                                initialValue: currentUser ? currentUser.name : ""
                            })(
                                <Input placeholder="请输入姓名" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='性别' {...formItemLayout}>
                            {getFieldDecorator('sex', {
                                initialValue: currentUser && currentUser.sex ? currentUser.sex : 3
                            })(
                                <RadioGroup>
                                    <Radio value={1}>男</Radio>
                                    <Radio value={2}>女</Radio>
                                    <Radio value={3}>未知</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='年龄' {...formItemLayout}>
                            {getFieldDecorator('age', {
                                initialValue: currentUser ? currentUser.age : ""
                            })(
                                <Input placeholder="请输入年龄" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='手机号' {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        required: true,
                                        pattern: '^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[6|7|8]|18[0|1|2|3|5|6|7|8|9])\\d{8}$',
                                        message: '请输入正确的手机号'
                                    }
                                ],
                                initialValue: currentUser ? currentUser.phone : ""
                            })(
                                <Input placeholder="请输入手机号" disabled={currentUser && currentUser.phone ? true : false}/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='微信昵称' {...formItemLayout}>
                            {getFieldDecorator('wechat', {
                                initialValue: currentUser ? currentUser.wechat : ""
                            })(
                                <Input placeholder="请输入微信昵称" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12} id="addressCascader">
                        <Form.Item label='地址' {...formItemLayout} >
                            {getFieldDecorator('addressKey', {
                                initialValue: currentUser ? currentUser.addressKey : ""
                            })(
                                <Cascader
                                    style={{ width: '100%' }}
                                    options={city}
                                    placeholder='请选择地址'
                                    getPopupContainer={() =>
                                        document.getElementById('addressCascader')
                                    }
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='来源' {...formItemLayout}>
                            {getFieldDecorator('sourceid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择一级来源'
                                    }
                                ],
                                initialValue: currentUser && currentUser.sourceid? currentUser.sourceid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="一级来源"
                                    style={{ width: '47%',marginRight:'5%' }}
                                    optionFilterProp="children"
                                    onChange={this.handleSourceChange}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择一级来源</Option>
                                    {jobordersource && jobordersource.length > 0 ? jobordersource.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                            {getFieldDecorator('sourceid2', {
                                initialValue: currentUser && currentUser.sourceid2? currentUser.sourceid2 : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="二级来源"
                                    onChange={this.handleSourceChild}
                                    style={{ width: '47%' }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择二级来源</Option>
                                    {jobordersourcechild && jobordersourcechild.length > 0 ? jobordersourcechild.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='来源日期' {...formItemLayout}>
                            {getFieldDecorator('sourcedate', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择来源日期'
                                    }
                                ],
                                initialValue: currentUser && currentUser.sourcedate? moment(currentUser.sourcedate, 'YYYY/MM/DD') : ''
                            })(
                                <DatePicker format='YYYY/MM/DD'/>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label='备注' {...formItemLayout}>
                            {getFieldDecorator('notes', {
                                initialValue: currentUser && currentUser.notes?  currentUser.notes : ""
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
