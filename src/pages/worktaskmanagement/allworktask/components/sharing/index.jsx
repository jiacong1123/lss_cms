import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon} from 'antd';
import moment from 'moment'
import city from 'utils/city'
import PropTypes from 'prop-types'
import styles from './index.less'

const Option = Select.Option;

class Sharing extends React.Component {
    render() {
        const { electriclist, selectedList } = this.props
        const { getFieldDecorator } = this.props.form
        let str = ''
        let arr = []
        if (selectedList.length > 0) {
          selectedList.forEach( e => {
              arr.push(e.name)
          })
          str = arr.join(',')
        }
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                  <Col span={24}>
                    <p className={styles.title}><i  className={styles.red}>* </i>共选择{arr.length}个需要共享的客户</p>
                    <span className={styles.text}>{str}</span>
                  </Col>
                    <Col span={24}>
                         <Form.Item label='请选择需要共享的同事'>
                            {getFieldDecorator('adminid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择需要共享的同事'
                                    }
                                ]
                            })(
                                <Select
                                    style={{ width: '100%' }}
                                    mode="multiple"
                                    showSearch
                                    labelInValue="true"
                                    placeholder="请选择需要共享的同事"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    { electriclist && electriclist.length > 0 ? electriclist.map(item => {
                                        return <Option key={item.adminid} value={item.adminid}>{item.name}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
        )
    }
}


export default Sharing
