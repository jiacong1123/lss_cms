import React from 'react'
import {
    Form, Row, Col, Input, Button, Card, Select, DatePicker
} from 'antd';
import styles from './index.less'
import moment from 'moment'

const Option = Select.Option;
const { RangePicker, MonthPicker } = DatePicker;

class Filter extends React.Component {

    // 收集表单
    handleSearch = () => {
        const { validateFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {          
              if (values.startDateStr) {
                values.startDateStr = moment(values.startDateStr).format('YYYY-MM')
              }
              if (values.endDateStr) {
                values.endDateStr = moment(values.endDateStr).format('YYYY-MM')
              }
                this.props.onGetSearchValue(values)
                this.props.onGetHistoryList({ ...values, page: 1, limit: 10 })
            }
        })
    }

    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetHistoryList({ page: 1, limit: 10 })
        this.props.form.resetFields()
    }

    handleChange = (key, values) => {
        const { form, onFilterChange } = this.props
        const { getFieldsValue } = form

        let fields = getFieldsValue()
        fields[key] = values

        if (fields.startDateStr) {
          fields.startDateStr = moment(fields.startDateStr).format('YYYY-MM')
        }
        if (fields.endDateStr) {
          fields.endDateStr = moment(fields.endDateStr).format('YYYY-MM')
        }
        // 查询数据
        this.props.onGetSearchValue(fields)
        this.props.onGetHistoryList({ ...fields, page: 1, limit: 10})
    }

    render() {
        const { form, jobordersource, searchValue, jobordersourcechild } = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.serchBox}>
                <Form
                    layout='inline'
                >
                    <Row>
                        <Col span={4}>
                            <Form.Item label='员工姓名'>
                                {getFieldDecorator('adminName', {
                                    initialValue: searchValue && searchValue.adminName ? searchValue.adminName : ''
                                })(
                                    <Input placeholder="请输入姓名" />
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label='开始日期'>
                                {getFieldDecorator('startDateStr', {
                                    initialValue: searchValue && searchValue.startDateStr ? moment(searchValue.startDateStr, 'YYYY/MM/DD') : null
                                })(
                                    <MonthPicker style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'startDateStr')} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='结束日期'>
                                {getFieldDecorator('endDateStr', {
                                    initialValue: searchValue && searchValue.endDateStr ? moment(searchValue.endDateStr, 'YYYY/MM/DD') : null
                                })(
                                    <MonthPicker style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'endDateStr')} />
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
