import React from 'react'
import {
    Form, Row, Col, Input, Button, Card, Select, DatePicker, Cascader
} from 'antd';
import city from 'utils/city'
import styles from './index.less'
import moment from 'moment'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
}

const Option = Select.Option;

class Filter extends React.Component {

    // 收集表单
    handleSearch = () => {
        const { validateFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {
                this.props.onGetSearchValue(values)
                this.props.onGetClinicList({ ...values, page: 1, limit: 10 })
            }
        })
    }

    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetClinicList({ page: 1, limit: 10 })
        this.props.form.resetFields()
    }

    handleChange = (key, values) => {
        const { form, onFilterChange } = this.props
        const { getFieldsValue } = form

        let fields = getFieldsValue()
        fields[key] = values
        // 查询数据
        this.props.onGetSearchValue(fields)
        this.props.onGetClinicList({ ...fields, page: 1, limit: 10 })
    }

    render() {
        const { form, jobordersource, searchValue } = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.serchBox}>
                <Form
                    layout='inline'
                >
                    <Row>
                        <Col span={4}>
                            <Form.Item label='诊所名称'>
                                {getFieldDecorator('name', {
                                    initialValue: searchValue && searchValue.name ? searchValue.name : ''
                                })(
                                    <Input placeholder="请输入诊所名称" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4} id="addressCascader">
                            <Form.Item label='门诊地址'>
                                {getFieldDecorator('addressKey', {
                                    initialValue: searchValue ? searchValue.addressKey : ""
                                })(
                                    <Cascader
                                        style={{ width: '100%' }}
                                        options={city}
                                        placeholder='请选择地址'
                                        getPopupContainer={() =>
                                            document.getElementById('addressCascader')
                                        }
                                        onChange={this.handleChange.bind(this, 'addressKey')}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='门诊类型'>
                                {getFieldDecorator('type', {
                                    initialValue: searchValue && searchValue.type ? searchValue.type : ''
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择门诊类型"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={this.handleChange.bind(this, 'type')}
                                    >
                                        <Option key='' value=''>选择类型</Option>
                                        <Option key={1} value={1}>自有</Option>
                                        <Option key={2} value={2}>合作</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}


export default Form.create({ name: 'Accountmanagement_search' })(Filter)