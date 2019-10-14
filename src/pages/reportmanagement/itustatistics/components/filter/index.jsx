import React from 'react'
import {
    Form, Row, Col, Input, Button, Card, Select, DatePicker
} from 'antd';
import styles from './index.less'
import moment from 'moment'

const Option = Select.Option;

class Filter extends React.Component {

    // 收集表单
    handleSearch = () => {
        const { validateFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {
                this.props.onGetSearchValue(values)
                this.props.onGetMonthList({ ...values, page: 1, limit: 10 })
                this.props.onGetMonthListCount({...values,initEntry: false})
            }
        })
    }

    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetMonthList({ page: 1, limit: 10 })
        this.props.form.resetFields()
        this.props.onGetMonthListCount({initEntry: false})
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
