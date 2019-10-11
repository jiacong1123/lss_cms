import React from 'react'
import {
  Form, Row, Col, Input, Button
} from 'antd'
import PropTypes from 'prop-types'
import city from 'utils/city'
import styles from './index.less'


class Filter extends React.Component {

    // 搜索
    handleSearch = () => {
        const { validateFields } = this.props.form
        validateFields((err,values)=>{
            if(!err){
               this.props.onGetAdminList({...values,page:1, limit:10})
            }
        })
    }
    
    // 重置
    handleReset = () => {
        this.props.onResetSearchValue()
        this.props.onGetAdminList({page:1, limit:10})
        this.props.form.resetFields()
    }
    

    render(){
        const { form, searchValue} = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.serchBox}>
                <Form
                    layout='inline'
                >
                <Row>
                    <Col span={4}>
                        <Form.Item label='姓名' >
                            {getFieldDecorator('name', {
                                initialValue: searchValue && searchValue.name ? searchValue.name : ''
                            })(
                                <Input placeholder="请输入姓名" />
                            )}
                        </Form.Item>
                   </Col>
                   <Col span={4}>
                        <Form.Item label='手机号' >
                            {getFieldDecorator('phone', {
                                initialValue: searchValue && searchValue.phone ? searchValue.phone : ''
                            })(
                                <Input placeholder="请输入手机号" />
                            )}
                        </Form.Item>
                   </Col>
                   <Col span={4}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={  this.handleReset }>重置</Button>
                        </Form.Item>
                   </Col>
                </Row>
              </Form>
            </div>
               
       
        )
    }
}

Filter.propTypes = {
    onAdd: PropTypes.func,
    form: PropTypes.object,
    filter: PropTypes.object,
    onFilterChange: PropTypes.func,
}


export default Form.create({ name: 'Accountmanagement_search' })(Filter)