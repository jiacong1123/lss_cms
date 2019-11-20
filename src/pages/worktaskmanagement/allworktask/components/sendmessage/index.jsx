import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon, Button} from 'antd';
import moment from 'moment'
import city from 'utils/city'
import PropTypes from 'prop-types'
import styles from './index.less'

const formItemLayout = {
    labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 15 },
        sm: { span: 15 },
    },
}


const Option = Select.Option;

class ComBatch extends React.Component {
  state ={
    checkedList:[],
  }
  componentDidMount() {
      this.state.checkedList = this.props.selectedList
  }

  handleClose = (item, index) => {
    const { selectedList } = this.props
    const { checkedList } = this.state
    checkedList.splice(index, 1)
    this.setState(checkedList)
    this.props.onSaveSelected(checkedList)

  }

  handleChange = (key, values) => {
    this.props.getMessageContent(values)
  }

    render() {
        const { electriclist, selectedList, messageTemplateList, messageContent } = this.props
        const { getFieldDecorator } = this.props.form
        const { checkedList } = this.state
        return (
            <div className={styles.save}>
              <span><i className={styles.red}>*</i>已选择收信人</span>
              <div className={styles.listBox}>
                { checkedList ?
                  checkedList.map( (item,index) => {
                    return <div>
                              <li>
                                {item.name}
                                <span className={styles.close}><Button onClick={e => this.handleClose(item,index)} type="link"  icon="close" /></span>
                              </li>
                           </div>
                  }) : ''

                }
              </div>
            <Form className="ant-advanced-search-form" layout='vertical'>
                <Row gutter={24}>
                    <Col span={20}>
                         <Form.Item label='短信模板' {...formItemLayout}>
                            {getFieldDecorator('templateId', {
                                rules: [
                                    {
                                        required: true,
                                        message: '短信模板'
                                    }
                                ]
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择短信模板"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange={this.handleChange.bind(this, 'template')}
                                >
                                    { messageTemplateList && messageTemplateList.length > 0 ? messageTemplateList.map(item => {
                                        return <Option key={item.code} value={item.code}>{item.name}</Option>
                                    }) : null }
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={20}>
                      <div className={styles.contentBox}>{messageContent}</div>
                    </Col>

                    <Col span={20}>
                         <Form.Item label='#one#' {...formItemLayout}>
                            {getFieldDecorator('one', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入变量1'
                                    }
                                ]
                            })(
                                  <Input type="text" placeholder="请输入变量1" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={20}>
                         <Form.Item label='#two#' {...formItemLayout}>
                            {getFieldDecorator('two', {})(
                                  <Input type="text" placeholder="请输入变量2"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={20}>
                         <Form.Item label='#three#' {...formItemLayout}>
                            {getFieldDecorator('three', {})(
                                  <Input type="text" placeholder="请输入变量3"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={20}>
                         <Form.Item label='#four#' {...formItemLayout}>
                            {getFieldDecorator('four', {})(
                                  <Input type="text" placeholder="请输入变量4" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={20}>
                         <Form.Item label='#five#' {...formItemLayout}>
                            {getFieldDecorator('five', {})(
                                  <Input type="text" placeholder="请输入变量5" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
        )
    }
}


export default ComBatch
