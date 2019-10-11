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
                this.props.onGetCustomList({ ...values, page: 1, limit: 10 })
            }
        })
    }

    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetCustomList({ page: 1, limit: 10 })
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

        // if(key == 'sourceid2') {
        //   this.props.onSetSourceChild({
        //     tagid2: values,
        //   })
        //
        //   const { sourceChild } = this.props
        //   const { tagname } = sourceChild
        //   fields[tagname] = tagname
        // }

        // 查询数据
        console.log(fields)
        this.props.onGetSearchValue(fields)
        this.props.onGetCustomList({ ...fields, page: 1, limit: 10})
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
                            <Form.Item label='客户姓名'>
                                {getFieldDecorator('name', {
                                    initialValue: searchValue && searchValue.name ? searchValue.name : ''
                                })(
                                    <Input placeholder="请输入姓名" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='客户手机'>
                                {getFieldDecorator('phone', {
                                    initialValue: searchValue && searchValue.phone ? searchValue.phone : ''
                                })(
                                    <Input placeholder="请输入手机号" />
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item label='开始日期'>
                                {getFieldDecorator('start', {
                                    initialValue: searchValue && searchValue.start ? moment(searchValue.start, 'YYYY/MM/DD') : null
                                })(
                                    <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'start')} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='结束日期'>
                                {getFieldDecorator('end', {
                                    initialValue: searchValue && searchValue.end ? moment(searchValue.end, 'YYYY/MM/DD') : null
                                })(
                                    <DatePicker format='YYYY/MM/DD' style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'end')} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='客户来源'>
                                {getFieldDecorator('sourceid', {
                                    initialValue: searchValue && searchValue.sourceid ? searchValue.sourceid : ''
                                })(
                                    <Select
                                        showSearch
                                        style={{ width: 120 }}
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
                              {/*  {getFieldDecorator('sourceid2', {
                                    initialValue: searchValue && searchValue.sourceid2 ? searchValue.sourceid2 : ''
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择来源"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        onChange={this.handleChange.bind(this, 'sourceid2')}
                                    >
                                        <Option key='' value=''>选择来源</Option>
                                        {jobordersourcechild && jobordersourcechild.length > 0 ? jobordersourcechild.map(item => {
                                            return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                        }) : null}
                                    </Select>
                                )}*/}
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
