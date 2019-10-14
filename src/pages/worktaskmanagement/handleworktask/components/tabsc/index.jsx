import React from 'react';
import {
  Row,Col,
  Select,
  Form,
  Tabs,
  Input,
  DatePicker,
  InputNumber
} from 'antd'
import styles from './index.less'

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
      xs: { span: 24 },
      sm: { span: 24},
  },
  wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
  },
}



class Tabsc extends React.Component {

  state = {
    times:[
      '9:00~9:30',
      '9:30~10:00',
      '10:00~10:30',
      '10:30~11:00',
      '11:00~11:30',
      '11:30~12:00',
      '14:00~14:30',
      '14:30~15:00',
      '15:00~15:30',
      '15:30~16:00',
      '16:00~16:30',
      '16:30~17:00',
      '17:00~17:30',
      '17:30~18:00'
    ],
    tabKey: '2',
    thisReceivablesamt: 0,
    thisAmount: 0
  }

  callback = (key) => {
    this.props.callback(key)
    this.setState({
      tabKey:key
    })
  }

  onChangeReservedpro = (key,value) => {
    this.props.form.resetFields(['doctorid', ''])
    this.props.onGetProductDropmenu({[key]: value})
  }

    changeReceivablesamt = (value) => {
      this.setState({ thisReceivablesamt: value})
    }

    changeAmount = (value) => {
      this.setState({ thisAmount: value})
    }



  render() {
    const { clinicdropmenu, doctordropmenu, reservedpro, productdropmenu } =this.props
    const { getFieldDecorator } = this.props.form
    const { tabKey, thisReceivablesamt, thisAmount } = this.state
    const { key } =  this.props.history.location.query
    return (
        <Tabs defaultActiveKey={tabKey} onChange={this.callback} animated={false} style={{backgroundColor: '#ffffff'}}>
            <TabPane tab="已成交" key="1">
                { tabKey == "1" ? <div className={styles.tabContent}>
                   <Col span={24}>
                         <Form.Item label='交易项目' {...formItemLayout}>
                            {getFieldDecorator('classid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择交易项目'
                                    }
                                ],
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择交易项目"
                                    optionFilterProp="classid"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange={this.onChangeReservedpro.bind(this,'classid')}
                                >
                                    <Option key='' value=''>选择交易项目</Option>
                                    {reservedpro && reservedpro.length > 0 ? reservedpro.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                         <Form.Item label='交易产品' {...formItemLayout}>
                            {getFieldDecorator('pid', {})(
                                <Select
                                    showSearch
                                    placeholder="请选择交易产品"
                                    optionFilterProp="doctorid"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择交易产品</Option>
                                    {productdropmenu && productdropmenu.length > 0 ? productdropmenu.map(item => {
                                        return <Option key={item.pid} value={item.pid}>{item.title}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                         <Form.Item label='收费时间' {...formItemLayout}>
                            {getFieldDecorator('payTime', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择收费时间'
                                    }
                                ]
                            })(
                                <DatePicker showTime />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='应收金额' {...formItemLayout}>
                        {getFieldDecorator('receivablesamt', {
                          rules: [
                              {
                                  required: true,
                                  message: '请输入应收金额'
                              }
                          ]
                        })(
                          <InputNumber  style={{width: '100%'}} onChange={this.changeReceivablesamt} suffix="元"/>
                        )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='本次实收' {...formItemLayout}>
                        {getFieldDecorator('amount', {
                          rules: [
                              {
                                  required: true,
                                  message: '请输入本次实收金额'
                              }
                          ]
                        })(
                          <InputNumber  style={{width: '100%'}} onChange={this.changeAmount} suffix="元"/>
                        )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='欠 费' {...formItemLayout}>
                        {getFieldDecorator('debtamt', {})(
                          <p>{ thisReceivablesamt - thisAmount } 元</p>
                        )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='备注' {...formItemLayout}>
                            {getFieldDecorator('worknotes', {})(
                                <TextArea rows={6} placeholder="请输入备注"/>
                            )}
                        </Form.Item>
                    </Col>
                </div> : null }
            </TabPane>
            <TabPane tab='转跟进' key="2">
                { tabKey == '2' ? <div>
                    <Col span={24}>
                        <Form.Item label='原因说明' {...formItemLayout}>
                            {getFieldDecorator('content', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入原因说明'
                                    }
                                ],
                            })(
                                <TextArea rows={6} placeholder="请输入原因说明"/>
                            )}
                        </Form.Item>
                    </Col>
                    <div className={styles.tipBox}>
                        <strong>注意：</strong>
                        <p>未到店将转入待跟进</p>
                    </div>
                </div> : null }
            </TabPane>
          </Tabs>
    )
  }
}

export default Tabsc
