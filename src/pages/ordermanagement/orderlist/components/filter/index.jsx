import React from 'react'
import {
  Form, Row, Col, Input, Button, Card,Select,DatePicker
} from 'antd';
import styles from './index.less'
import moment from 'moment'

const Option = Select.Option;

class Filter extends React.Component {

    // 收集表单
    handleSearch = () => {
        const { validateFields } = this.props.form
        validateFields((err,values)=>{
            if(!err){
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
        // 查询数据
        this.props.onGetSearchValue(fields)
        this.props.onGetOrderList({...fields,page:1, limit:10})
    }

    render(){
        const { form, jobordersource, searchValue } = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.serchBox}>
                <Form
                    layout='inline'
                >
                    <Row>
                    <Col span={4}>
                            <Form.Item label='电话查询'>
                            {getFieldDecorator('phone', {
                                initialValue: searchValue && searchValue.phone ? searchValue.phone : ''
                            })(
                                <Input placeholder="请输入电话查询" />
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