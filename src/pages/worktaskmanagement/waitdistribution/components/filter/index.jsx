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
                this.props.onGetOrderList({ ...values, page: 1, limit: 10 })
            }
        })
    }

    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetOrderList({ page: 1, limit: 10 })
        this.props.form.resetFields()
    }

    handleChange = (key, values) => {
      if(key == 'sourceid') {
        this.props.onGetSourceChild({
          tagid: values,
        })
      }
        const { form, onFilterChange } = this.props
        const { getFieldsValue } = form

        let fields = getFieldsValue()
        fields[key] = values
        // 查询数据
        this.props.onGetSearchValue(fields)
        this.props.onGetOrderList({ ...fields, page: 1, limit: 10 })
    }

    render() {
        const { form, clinicdropmenu, searchValue,jobordersource } = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.serchBox}>
                <Form
                    layout='inline'
                >
                    <Row>
                        <Col span={4}>
                            <Form.Item label='客户姓名'>
                                {getFieldDecorator('name', {
                                    initialValue: searchValue && searchValue.name ? searchValue.name : ''
                                })(
                                    <Input placeholder="请输入客户姓名" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='客户电话'>
                                {getFieldDecorator('phone', {
                                    initialValue: searchValue && searchValue.phone ? searchValue.phone : ''
                                })(
                                    <Input placeholder="请输入客户电话" />
                                )}
                            </Form.Item>
                        </Col>
                        {/*<Col span={4}>
                            <Form.Item label='客户来源'>
                                {getFieldDecorator('sourceid', {
                                    initialValue: searchValue && searchValue.sourceid ? searchValue.sourceid : ''
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择来源"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={this.handleChange.bind(this, 'sourceid')}
                                    >
                                        <Option key='' value=''>选择来源</Option>
                                        {jobordersource && jobordersource.length > 0 ? jobordersource.map(item => {
                                            return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                        }) : null}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>*/}
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
