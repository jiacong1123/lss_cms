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
                let status;
                values.status ? status = values.status : status = '99'
                if (values.tag && values.tag.length) {
                  values.tag = values.tag.join(',')
                }
                this.props.onGetSearchValue(values)
                this.props.onGetOrderList({ ...values, page: 1, limit: currentSize, status: status, })
            }
        })
    }

    handleReset = () => {
        const { currentSize } = this.props
        this.props.onResetSearchValue()
        this.props.onGetOrderList({ page: 1, limit: currentSize, status:'99' })
        this.props.form.resetFields()
    }

    changeStatus = (key, values) => {
      const { form, onFilterChange, currentSize } = this.props
      const { getFieldsValue } = form

      let fields = getFieldsValue()
      fields[key] = values
      // 查询数据
      this.props.onGetSearchValue(fields)
      this.props.onGetOrderList({ ...fields, page: 1, limit: currentSize })
    }

    handleChange = (key, values) => {
      if(key == 'sourceid') {
        this.props.onGetSourceChild({
          tagid: values,
        })
      }
        const { form, onFilterChange, currentSize } = this.props
        const { getFieldsValue } = form

        let fields = getFieldsValue()
        fields[key] = values
        // 查询数据
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
          fields.followupTimeEnd = ''
        }

        let status;
        fields.status ? status = fields.status : status = '99'
        if (fields.tag && fields.tag.length) {
          fields.tag = fields.tag.join(',')
        } else {
          fields.tag = ''
        }

        // console.log(fields)
        this.props.onGetSearchValue(fields)
        this.props.onGetOrderList({ ...fields, page: 1, limit: currentSize, status: status })
    }

    render() {
        const { form, clinicdropmenu, searchValue,jobordersource, personnelList, searchTags } = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.serchBox}>
                <Form
                    layout='inline'
                >
                    <Row style={{marginBottom: 15}}>
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
                            <Form.Item label='状态'>
                                {getFieldDecorator('status', {
                                    initialValue: searchValue && searchValue.status ? searchValue.status : '99'
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
                                      <Option value="4">已完成</Option>
                                    {/*<Option value="5">已关闭</Option>*/}
                                      <Option value="99">全部</Option>
                                  </Select>
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
                                        style={{ width: 100 }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={this.handleChange.bind(this, 'level')}
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
                                  <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }}  onChange={this.handleChange.bind(this, 'followupTimeStart')}/>
                              )}
                          </Form.Item>
                      </Col>
                      <Col span={4}>
                          <Form.Item label='-至-'>
                              {getFieldDecorator('followupTimeEnd', {
                                  initialValue: searchValue && searchValue.followupTimeEnd ? moment(searchValue.followupTimeEnd, 'YYYY/MM/DD') : null
                              })(
                                  <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }}  onChange={this.handleChange.bind(this, 'followupTimeEnd')}/>
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
                                        placeholder="请选择客户来源"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={this.handleChange.bind(this, 'sourceid')}
                                    >
                                        <Option key='' value=''>选择客户来源</Option>
                                        {jobordersource && jobordersource.length > 0 ? jobordersource.map(item => {
                                            return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                        }) : null}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>*/}
                    </Row>
                    <Row>
                      <Col span={8}>
                         <Form.Item label='标签搜索'>
                            {getFieldDecorator('tag', {

                            })(
                                <Select
                                    mode="multiple"
                                    showSearch
                                    style={{ width: 420 }}
                                    placeholder="请选择标签"
                                    onChange={this.handleChange.bind(this, 'tag')}
                                >
                                    { searchTags && searchTags.length > 0 ? searchTags.map(item => {
                                        return <Option key={item.tagid} value={item.tagname}>{item.tagname}</Option>
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
