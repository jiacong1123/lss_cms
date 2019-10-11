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

class ComBatch extends React.Component {
    render() {
        const { electriclist} = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={12}>
                         <Form.Item label='请选择需要分配的所属人员' {...formItemLayout}>
                            {getFieldDecorator('adminid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择需要分配的所属人员'
                                    }
                                ]
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择需要分配的所属人员"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>请选择需要分配的所属人员</Option>
                                    { electriclist && electriclist.length > 0 ? electriclist.map(item => {
                                        return <Option key={item.adminid} value={item.adminid}>{item.name}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
        )
    }
}


export default ComBatch