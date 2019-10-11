import React from 'react'
import {
  Form, Row, Col, Input, Button, Card,Select,DatePicker,Cascader
} from 'antd';
import city from 'utils/city'
import styles from './index.less'
import moment from 'moment'

const Option = Select.Option;

class Filter extends React.Component {

    // 收集表单
    handleSearch = () => {
        const { validateFields } = this.props.form
        validateFields((err,values)=>{
            if(!err){
              if (values.allottimeStart != null) {
                values.allottimeStart = moment(values.allottimeStart).format('YYYY-MM-DD')
              } else {
                values.allottimeStart = ''
              }

              if (values.allottimeEnd != null) {
                values.allottimeEnd = moment(values.allottimeEnd).format('YYYY-MM-DD')
              } else {
                values.allottimeEnd  = ''
              }
              if (values.followupTimeStart != null) {
                values.followupTimeStart = moment(values.followupTimeStart).format('YYYY-MM-DD')
              } else {
                values.followupTimeStart = ''
              }

              if (values.followupTimeEnd != null) {
                values.followupTimeEnd = moment(values.followupTimeEnd).format('YYYY-MM-DD')
              } else {
                values.followupTimeEnd  = ''
              }
               this.props.onGetSearchValue(values)
               this.props.onGetOrderList({...values,page:1, limit:10})
            }
        })
    }

    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetOrderList({page:1, limit:10})
        this.props.form.resetFields()
    }

    handleChange = (key, values) => {
        const { form, onFilterChange } = this.props
        const { getFieldsValue } = form

        let fields = getFieldsValue()
        fields[key] = values
        if (fields.allottimeStart != null) {
          fields.allottimeStart = moment(fields.allottimeStart).format('YYYY-MM-DD')
        } else {
          fields.allottimeStart = ''
        }
        if (fields.allottimeEnd != null) {
          fields.allottimeEnd = moment(fields.allottimeEnd).format('YYYY-MM-DD')
        } else {
          fields.allottimeEnd = ''
        }
        if (fields.followupTimeStart != null) {
          fields.followupTimeStart = moment(fields.followupTimeStart).format('YYYY-MM-DD')
        } else {
          fields.followupTimeStart = ''
        }

        if (fields.followupTimeEnd != null) {
          fields.followupTimeEnd = moment(fields.followupTimeEnd).format('YYYY-MM-DD')
        } else {
          fields.followupTimeEnd  = ''
        }
        // 查询数据
        this.props.onGetSearchValue(fields)
        this.props.onGetOrderList({...fields,page:1, limit:10})
    }

    render(){
        const { form, clinicdropmenu, searchValue, personnelList } = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.serchBox}>
                <Form
                    layout='inline'
                >
                    <Row style={{marginBottom: 15}}>
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
                      <Form.Item label='分配日期'>
                          {getFieldDecorator('allottimeStart', {
                              initialValue: searchValue && searchValue.allottimeStart ? moment(searchValue.allottimeStart, 'YYYY/MM/DD') : null
                          })(
                              <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }}  onChange={this.handleChange.bind(this, 'allottimeStart')}/>
                          )}
                      </Form.Item>
                  </Col>
                  <Col span={4}>
                      <Form.Item label='-至-'>
                          {getFieldDecorator('allottimeEnd', {
                              initialValue: searchValue && searchValue.allottimeEnd ? moment(searchValue.allottimeEnd, 'YYYY/MM/DD') : null
                          })(
                              <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }}  onChange={this.handleChange.bind(this, 'allottimeEnd')}/>
                          )}
                      </Form.Item>
                  </Col>
                    <Col span={4}>
                        <Form.Item label='最近联系'>
                            {getFieldDecorator('followupTimeStart', {
                                initialValue: searchValue && searchValue.followupTimeStart ? moment(searchValue.followupTimeStart, 'YYYY/MM/DD') : null
                            })(
                                <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'followupTimeStart')} placeholder="开始日期"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label='至'>
                            {getFieldDecorator('followupTimeEnd', {
                                initialValue: searchValue && searchValue.followupTimeEnd ? moment(searchValue.followupTimeEnd, 'YYYY/MM/DD') : null
                            })(
                                <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'followupTimeEnd')} placeholder="结束日期"/>
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
