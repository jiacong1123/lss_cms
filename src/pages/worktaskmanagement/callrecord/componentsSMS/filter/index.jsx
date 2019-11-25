import React from 'react'
import {
    Form, Row, Col, Input, Button, Card, Select, DatePicker, Cascader
} from 'antd';
import city from 'utils/city'
import styles from './index.less'
import moment from 'moment'
import store from 'store'

const Option = Select.Option;

class Filter extends React.Component {

    // 收集表单
    handleSearch = () => {
        const { validateFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {
                this.props.onGetSearchValue(values)
                this.props.onGetSMSList({ ...values, page: 1, limit: 10, })
            }
        })
    }

    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetSMSList({ page: 1, limit: 10, })
        this.props.form.resetFields()
    }

    handleChange = (key, values) => {
        const { form, onFilterChange } = this.props
        const { getFieldsValue } = form

        let fields = getFieldsValue()
        fields[key] = values
        // 查询数据
        this.props.onGetSearchValue(fields)
        this.props.onGetSMSList({ ...fields, page: 1, limit: 10, })
    }

    render() {
        const { form, clinicdropmenu, searchValue, personnelList } = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.serchBox}>
                <Form
                    layout='inline'
                >
                    <Row>
                    <Col span={4}>
                         <Form.Item label='所属人员'>
                            {getFieldDecorator('adminid', {
                                initialValue: searchValue && searchValue.adminid ? searchValue.adminid : ''
                            })(
                                <Select
                                    showSearch
                                    style={{ width: 180 }}
                                    placeholder="请选择所属人员"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择所属人员</Option>
                                    { personnelList && personnelList.length > 0 ? personnelList.map(item => {
                                        return <Option key={item.adminid} value={item.adminid}>{item.name}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                        <Col span={4}>
                            <Form.Item label='客户姓名'>
                                {getFieldDecorator('userName', {
                                    initialValue: searchValue && searchValue.userName ? searchValue.userName : ''
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
                                    <Input placeholder="请输入电话" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='状态'>
                                {getFieldDecorator('status', {
                                     initialValue: searchValue && searchValue.status ? searchValue.status : ''
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择"
                                        style={{ width: 100 }}
                                        onChange={this.handleChange.bind(this, 'status')}
                                    >
                                        <Option value="">全部</Option>
                                        <Option value="1">成功</Option>
                                        <Option value="2">失败</Option>
                                    </Select>
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
