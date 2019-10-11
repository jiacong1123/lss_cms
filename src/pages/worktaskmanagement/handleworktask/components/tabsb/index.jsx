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



class Tabsb extends React.Component {

  state = {
    tabKey: '2'
  }

  callback = (key) => {
    this.props.callback(key)
    this.setState({
      tabKey:key
    })
  }

  onChangeClinic = (key,value) => {
    this.props.form.resetFields(['doctorid', ''])
    this.props.onGetDoctorDropmenu({[key]: value})
}

  render() {
    const { clinicdropmenu,electriclist,times } =this.props
    const { getFieldDecorator } = this.props.form
    const { tabKey } = this.state
    const { key } =  this.props.history.location.query

    return (
        <Tabs defaultActiveKey={tabKey} onChange={this.callback} animated={false} style={{backgroundColor: '#ffffff'}}>
            <TabPane tab="已到店" key="1">
                { tabKey == "1" ? <div className={styles.tabContent}>
                   {/* <Col span={24}>
                         <Form.Item label='诊所' {...formItemLayout}>
                            {getFieldDecorator('clinicid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择诊所'
                                    }
                                ],
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择诊所"
                                    optionFilterProp="clinicid"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange={this.onChangeClinic.bind(this,'clinicid')}
                                >
                                    <Option key='' value=''>选择诊所</Option>
                                    {clinicdropmenu && clinicdropmenu.length > 0 ? clinicdropmenu.map(item => {
                                        return <Option key={item.clinicid} value={item.clinicid}>{item.shortname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col> */}
                    <Col span={24}>
                         <Form.Item label='医生' {...formItemLayout}>
                            {getFieldDecorator('doctorid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择医生'
                                    }
                                ]
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择医生"
                                    optionFilterProp="doctorid"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    disabled={ electriclist && electriclist.length > 0 ? false : true}
                                >
                                    <Option key='' value=''>选择医生</Option>
                                    {electriclist && electriclist.length > 0 ? electriclist.map(item => {
                                        return <Option key={item.adminid} value={item.adminid}>{item.name}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                </div> : null }
            </TabPane>
            <TabPane tab='未到店' key="2">
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
            <TabPane tab="修改预约时间" key="3">
                { tabKey == '3' ? <div>
                 {/* <Col span={24}>
                         <Form.Item label='预约诊所' {...formItemLayout}>
                            {getFieldDecorator('clinicid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择诊所'
                                    }
                                ],
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择诊所"
                                    optionFilterProp="clinicid"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    onChange={this.onChangeClinic.bind(this,'clinicid')}
                                >
                                    <Option key='' value=''>选择诊所</Option>
                                    {clinicdropmenu && clinicdropmenu.length > 0 ? clinicdropmenu.map(item => {
                                        return <Option key={item.clinicid} value={item.clinicid}>{item.shortname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                  </Col> */}
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
                          <Form.Item label='预约时间' {...formItemLayout}>
                              {getFieldDecorator('reservetime', {
                                  rules: [
                                    {
                                        required: true,
                                        message: '请选择预约时间'
                                    }
                                  ],
                                  initialValue: '9:00~9:30'
                              })(
                                  <Select
                                      showSearch
                                      placeholder="请选择预约时间"
                                      optionFilterProp="children"
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                  >
                                        { times.map(time=>(
                                               <Option value={time} key={time}>{time}</Option>
                                        ))}
                                  </Select>
                              )}
                          </Form.Item>
                      </Col>
                </div> : null}
            </TabPane>
          </Tabs>
    )
  }
}

export default Tabsb
