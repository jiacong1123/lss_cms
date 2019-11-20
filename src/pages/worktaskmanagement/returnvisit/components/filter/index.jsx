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
                    <Row style={{marginBottom: 15}}>
                        <Col span={4}>
                            <Form.Item label='意愿等级'>
                                {getFieldDecorator('level', {
                                     initialValue: searchValue && searchValue.level ? searchValue.level : ''
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择意愿等级"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={this.handleChange.bind(this, 'level')}
                                    >
                                        <Option value="">请选择意愿等级</Option>
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
                            <Form.Item label='状态'>
                                {getFieldDecorator('isReturn', {
                                    initialValue: searchValue && searchValue.isReturn ? searchValue.isReturn : ''
                                })(
                                  <Select
                                      showSearch
                                      placeholder="请选择"
                                      style={{ width: 100 }}
                                      optionFilterProp="children"
                                  >
                                      <Option value="">全部</Option>
                                      <Option value="1">待回访</Option>
                                      <Option value="2">已回访</Option>
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
