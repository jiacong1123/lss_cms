import React from 'react'
import {
    Form, Row, Col, Input, Button, Card, Select, DatePicker, Cascader
} from 'antd';
import city from 'utils/city'
import styles from './index.less'
import moment from 'moment'

const Option = Select.Option;

class Filter extends React.Component {

    // 收集表单
    handleSearch = () => {
        const { validateFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {
              if (values.startDate != null) {
                values.startDate = moment(values.startDate).format('YYYY-MM-DD')
              } else {
                values.startDate = ''
              }

              if (values.endDate != null) {
                values.endDate = moment(values.endDate).format('YYYY-MM-DD')
              } else {
                values.endDate  = ''
              }              
                this.props.onGetSearchValue(values)
                this.props.onGetAudioList({ ...values, page: 1, limit: 10 })
            }
        })
    }

    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetAudioList({ page: 1, limit: 10 })
        this.props.form.resetFields()
    }

    handleChange = (key, values) => {
        const { form, onFilterChange } = this.props
        const { getFieldsValue } = form

        let fields = getFieldsValue()
        fields[key] = values
        // 查询数据
        if (fields.startDate != null) {
          fields.startDate = moment(fields.startDate).format('YYYY-MM-DD')
        } else {
          fields.startDate = ''
        }
        if (fields.endDate != null) {
          fields.endDate = moment(fields.endDate).format('YYYY-MM-DD')
        } else {
          fields.endDate = ''
        }

        this.props.onGetSearchValue(fields)
        this.props.onGetAudioList({ ...fields, page: 1, limit: 10 })
    }

    render() {
        const { form, clinicdropmenu, searchValue } = this.props
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
                                    <Input placeholder="请输入员工姓名" />
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
                                {getFieldDecorator('cusNo', {
                                    initialValue: searchValue && searchValue.cusNo ? searchValue.cusNo : ''
                                })(
                                    <Input placeholder="请输入客户电话" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label='拨打时间'>
                              {getFieldDecorator('startDate', {
                                  initialValue: searchValue && searchValue.startDate ? moment(searchValue.startDate, 'YYYY/MM/DD') : null
                              })(
                                  <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }}  onChange={this.handleChange.bind(this, 'startDate')}/>
                              )}
                          </Form.Item>
                      </Col>
                      <Col span={4}>
                          <Form.Item label='-至-'>
                              {getFieldDecorator('endDate', {
                                  initialValue: searchValue && searchValue.endDate ? moment(searchValue.endDate, 'YYYY/MM/DD') : null
                              })(
                                  <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }}  onChange={this.handleChange.bind(this, 'endDate')}/>
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
