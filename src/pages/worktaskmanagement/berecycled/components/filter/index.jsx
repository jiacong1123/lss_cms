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
        const { currentSize } = this.props
        const { validateFields } = this.props.form
        validateFields((err, values) => {
            if (!err) {
                if (values.startCloseTime != null) {
                  values.startCloseTime = moment(values.startCloseTime).format('YYYY-MM-DD')
                } else {
                  values.startCloseTime = ''
                }

                if (values.endCloseTime != null) {
                  values.endCloseTime = moment(values.endCloseTime).format('YYYY-MM-DD')
                } else {
                  values.endCloseTime  = ''
                }
                this.props.onGetSearchValue(values)
                this.props.onGetOrderList({ ...values, page: 1, limit: currentSize })
            }
        })
    }

    handleReset = () => {
        const { currentSize } = this.props
        this.props.onResetSearchValue()
        this.props.onGetOrderList({ page: 1, limit: currentSize })
        this.props.form.resetFields()
    }

    handleChange = (key, values) => {
        const { form, onFilterChange, currentSize } = this.props
        const { getFieldsValue } = form

        let fields = getFieldsValue()
        fields[key] = values
        if (fields.startCloseTime != null) {
          fields.startCloseTime = moment(fields.startCloseTime).format('YYYY-MM-DD')
        } else {
          fields.startCloseTime = ''
        }
        if (fields.endCloseTime != null) {
          fields.endCloseTime = moment(fields.endCloseTime).format('YYYY-MM-DD')
        } else {
          fields.endCloseTime  = ''
        }
        // 查询数据
        this.props.onGetSearchValue(fields)
        this.props.onGetOrderList({ ...fields, page: 1, limit: currentSize })
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
                            <Form.Item label='姓名'>
                                {getFieldDecorator('name', {
                                    initialValue: searchValue && searchValue.name ? searchValue.name : ''
                                })(
                                    <Input placeholder="请输入姓名" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='电话'>
                                {getFieldDecorator('phone', {
                                    initialValue: searchValue && searchValue.phone ? searchValue.phone : ''
                                })(
                                    <Input placeholder="请输入电话" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='意愿等级'>
                                {getFieldDecorator('level', {
                                     initialValue: searchValue && searchValue.level ? searchValue.level : ''
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        style={{ width: 90 }}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option value="">请选择</Option>
                                        <Option value="A">A</Option>
                                        <Option value="B">B</Option>
                                        <Option value="C">C</Option>
                                        <Option value="D">D</Option>
                                        <Option value="E">E</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
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
                    </Row>
                    <Row>
                      <Col span={4}>
                          <Form.Item label='掉库日期'>
                              {getFieldDecorator('startCloseTime', {
                                  initialValue: searchValue && searchValue.startCloseTime ? moment(searchValue.startCloseTime, 'YYYY/MM/DD') : null
                              })(
                                  <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'startCloseTime')} placeholder="开始日期"/>
                              )}
                          </Form.Item>
                      </Col>
                      <Col span={4}>
                          <Form.Item label='至'>
                              {getFieldDecorator('endCloseTime', {
                                  initialValue: searchValue && searchValue.endCloseTime ? moment(searchValue.endCloseTime, 'YYYY/MM/DD') : null
                              })(
                                  <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'endCloseTime')} placeholder="结束日期"/>
                              )}
                          </Form.Item>
                      </Col>
                      <Col span={4}>
                          <Form.Item label='状态'>
                              {getFieldDecorator('status', {
                                  initialValue: searchValue && searchValue.status ? searchValue.status : '98'
                              })(
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    style={{ width: 100 }}

                                >
                                  {/*  <Option value="0">待分配</Option>*/}
                                    <Option value="10">新分配</Option>
                                    <Option value="1">待跟进</Option>
                                    <Option value="2">已预约</Option>
                                    <Option value="3">已到店</Option>
                                  {/*<Option value="4">已完成</Option>*/}
                                  {/*<Option value="5">已关闭</Option>*/}
                                    <Option value="98">全部</Option>
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
