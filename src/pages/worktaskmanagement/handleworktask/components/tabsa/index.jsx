import React from 'react';
import {
  Row,Col,
  Select,
  Form,
  Tabs,
  Input,
  DatePicker
} from 'antd'
import styles from './index.less'
import moment from 'moment'

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



class Tabsa extends React.Component {

  state = {
    tabKey: '2'
  }

  callback = (key) => {
    this.props.callback(key)
    this.setState({
      tabKey:key
    })
  }

  render() {
    const { clinicdropmenu, times, orderdetail } =this.props
    const { getFieldDecorator } = this.props.form
    const { tabKey } = this.state
    const { key } =  this.props.history.location.query
    return (
        <Tabs defaultActiveKey={tabKey} onChange={this.callback} animated={false} style={{backgroundColor: '#ffffff'}}>

            <TabPane tab="立即预约" key="1">
                { tabKey == "1" ? <div className={styles.tabContent}>
                  <div className={styles.tipBox}>
                     <strong>排班信息说明：</strong>
                     <p>每周一有三位医生坐诊断，其中一位休息，周二到周天 有5为医生坐诊断，其中，每周一有三位医生坐诊断，其中一位休息，周二到周天 有5为医生坐诊断，其中；每周一有三位医生坐诊断，其中一位休息</p>
                  </div>
                  <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label='预约日期' {...formItemLayout}>
                              {getFieldDecorator('reservedate', {
                                  rules: [
                                      {
                                          required: true,
                                          message: '请选择预约日期'
                                      }
                                  ],
                              })(
                                  <DatePicker format='YYYY/MM/DD'/>
                              )}
                          </Form.Item>
                    </Col>
                    <Col span={24}>
                          <Form.Item label='预约门诊' {...formItemLayout}>
                              {getFieldDecorator('clinicid', {
                                  rules: [
                                    {
                                        required: true,
                                        message: '请选择预约门诊'
                                    }
                                  ],
                              })(
                                  <Select
                                      showSearch
                                      placeholder="请选择预约门诊"
                                      optionFilterProp="children"
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                  >
                                      <Option key='' value=''>选择诊所</Option>
                                      { clinicdropmenu && clinicdropmenu.length > 0 ? clinicdropmenu.map(item => {
                                          return <Option key={item.clinicid} value={item.clinicid}>{item.shortname}</Option>
                                      }) : null}
                                  </Select>,
                              )}
                          </Form.Item>
                      </Col>
                      <Col span={24}>
                          <Form.Item label='预约时间' {...formItemLayout}>
                              {getFieldDecorator('reservetime', {
                                  rules: [
                                    {
                                        required: true,
                                        message: '请选择预约时间'
                                    }
                                  ],
                                  initialValue: ''
                              })(
                                  <Select
                                      showSearch
                                      placeholder="请选择预约时间"
                                      optionFilterProp="children"
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                  >
                                        <Option key='' value=''>请选择预约时间</Option>
                                        { times.map(time=>(
                                               <Option value={time} key={time}>{time}</Option>
                                        ))}
                                  </Select>
                              )}
                          </Form.Item>
                      </Col>
                  </Row>
                </div> : null }
            </TabPane>
		        <TabPane tab={ key == 10 ? '待定': '回访'} key="2">
            { tabKey == '2' ? <Row gutter={24}>
                <Col span={24}>
                    <Form.Item label='意愿等级' {...formItemLayout}>
                          {getFieldDecorator('level', {
                              rules: [
                                  {
                                      required: true,
                                      message: '请选择意愿等级'
                                  }
                              ],
                              initialValue: orderdetail && orderdetail.level
                          })(
                            <Select
                                  showSearch
                                  placeholder="请选择意愿等级"
                                  optionFilterProp="children"
                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                <Col span={24}>
                    <Form.Item label='计划回访时间' {...formItemLayout}>
                          {getFieldDecorator('returndate', {})(
                              <DatePicker format='YYYY/MM/DD HH:mm:ss' showTime/>
                          )}
                      </Form.Item>
                </Col>
{/*                <Col span={24}>
                      <Form.Item label='沟通时长(分钟)' {...formItemLayout}>
                          {getFieldDecorator('followup', {})(
                            <Input placeholder="请输入沟通时长(分钟)"/>
                          )}
                      </Form.Item>
                  </Col>  */}
                  <Col span={24}>
                      <Form.Item label='沟通内容' {...formItemLayout}>
                          {getFieldDecorator('complaint', {
                              rules: [
                                {
                                    required: true,
                                    message: '请输入沟通内容'
                                }
                              ],
                          })(
                            <TextArea rows={6} placeholder="请输入沟通内容"/>
                          )}
                      </Form.Item>
                  </Col>
              </Row> : null }
        </TabPane>
            <TabPane tab="关闭" key="3">
                { tabKey == '3' ? <div>
                  <Col span={24}>
                      <Form.Item label='关闭原因' {...formItemLayout}>
                          {getFieldDecorator('closereason', {
                              rules: [
                                {
                                    required: true,
                                    message: '请输入关闭原因'
                                }
                              ],
                          })(
                            <TextArea rows={6} placeholder="请输入关闭原因"/>
                          )}
                      </Form.Item>
                  </Col>
                  <div className={styles.tipBox}>
                      <strong>注意：</strong>
                      <p>关闭后将不能预约服务，请谨慎操作！</p>
                  </div>
                </div> : null}
            </TabPane>
          </Tabs>
    )
  }
}

export default Tabsa
