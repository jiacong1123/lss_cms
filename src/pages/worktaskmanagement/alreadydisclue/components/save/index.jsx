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
        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row className={styles.infoBox}>
                    <Col span={24}>
                        <Col span={12}>
                            <Form.Item label='客户姓名 : ' {...formItemLayout}>
                                {currentClue && currentClue.name ? currentClue.name : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='电话号码 : ' {...formItemLayout}>
                                {currentClue && currentClue.phone ? currentClue.phone : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='性别 : ' {...formItemLayout}>
                                {currentClue && currentClue.sex ?
                                  <span>
                                  {currentClue.sex == 1 ? '男' : ''}
                                  {currentClue.sex == 2 ? '女' : ''}
                                  {currentClue.sex == 3 ? '未知' : ''}
                                  {currentClue.sex == null ? '未知' : ''}
                                </span> : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='年龄 : ' {...formItemLayout}>
                                {currentClue && currentClue.age ? currentClue.age : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='所在省市 : ' {...formItemLayout}>
                                {currentClue && currentClue.province ? currentClue.province  : ''}/{currentClue && currentClue.city ? currentClue.city  : ''}/{currentClue && currentClue.area ? currentClue.area  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='主诉 : ' {...formItemLayout}>
                                {currentClue && currentClue.project ? currentClue.project  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='预约时间 : ' {...formItemLayout}>
                                {currentClue && currentClue.reservedate ? currentClue.reservedate  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='客户类型 : ' {...formItemLayout}>
                                {currentClue && currentClue.usertypename ? currentClue.usertypename  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='来源 : ' {...formItemLayout}>
                                {currentClue && currentClue.source ? currentClue.source  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='来源日期 : ' {...formItemLayout}>
                                {currentClue && currentClue.sourcedate ? currentClue.sourcedate  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='接单门诊 : ' {...formItemLayout}>
                                {currentClue && currentClue.clinicname ? currentClue.clinicname  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='状态 : ' {...formItemLayout}>
                                {currentClue && currentClue.cluestatus ? (currentClue.cluestatus === 0 ? '可抢' : ( currentClue.cluestatus === 1 ? '已接诊': '冻结中') ) : ''}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item label='接单时间 : ' {...formItemLayout}>
                            {currentClue && currentClue.visitingtime ? currentClue.visitingtime  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={24} >
                            <Form.Item label='主诉 : ' {...formItemLayout}>
                                {currentClue && currentClue.complaint ? currentClue.complaint  : ''}
                            </Form.Item>
                        </Col>
                        <Col span={24} >
                            <Form.Item label='备注 : ' {...formItemLayout}>
                                {currentClue && currentClue.worknotes ? currentClue.worknotes  : ''}
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
            </Form>
        </div>
        )
    }
}


export default ComSave
