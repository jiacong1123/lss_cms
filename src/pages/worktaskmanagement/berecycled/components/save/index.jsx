import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon} from 'antd';
import moment from 'moment'
import city from 'utils/city'
import PropTypes from 'prop-types'
import styles from './index.less'
import store from 'store'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
}


const Option = Select.Option;
const RadioGroup = Radio.Group
const { TextArea } = Input;

class ComSave extends React.Component {

    state = {
        loading: false,
        imageUrl:null
    }
    getBase64 = (img, callback) => {
         const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file) => {

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return  isLt2M;
    }

    //上传成功显示上传的照片
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
        }
        if (info.file.status === 'done') {
        // Get this url from response in real world.
        this.getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
        }));
        }
    }
    handleSourceChange = value => {
      this.props.onGetSourceChild({
        tagid: value,
      })
    }

    handleSourceChild = value => {
      this.props.onSetSourceChild({
        tagid2: value,
      })
    }

    onChangeSearch (key,e)  {
        // let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        let myreg = /^1[3456789]\d{9}$/     //20190910改
        if ( e.target.value.length === 11) {

            if(myreg.test(e.target.value)){
                this.props.onJudgeUserIsExist({[key]:e.target.value})
            }else{
                message.error('手机号格式不正确')
            }
        }
    }

    render() {
        const { currentOrder,clinicdropmenu, jobordersource,reservedpro,electriclist,jobtitle,token, times,jobordersourcechild, modalKey} = this.props
        const { getFieldDecorator } = this.props.form
        const { user } = currentOrder
        const userinfo = store.get('userinfo')

        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='客户姓名' {...formItemLayout}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入客户姓名'
                                    }
                                ],
                                initialValue: user ? user.name : ""
                            })(
                                <Input placeholder="请输入客户姓名" disabled={ user && user.name ? true : false}/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='联系电话' {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        required:true,
                                        pattern: '^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\\d{8}$',
                                        message: '请输入正确的联系电话'
                                    }
                                ],
                                initialValue: user ? user.phone : ""
                            })(
                                <Input placeholder="请输入联系电话" disabled={ user && user.phone ? true : false} onChange={this.onChangeSearch.bind(this,'phone')}/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='客户年龄' {...formItemLayout}>
                            {getFieldDecorator('age', {
                                initialValue: user ? user.age : ""
                            })(
                                <Input placeholder="请输入客户年龄" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='性别' {...formItemLayout}>
                            {getFieldDecorator('sex', {
                                initialValue: user && user.sex ? user.sex : 3
                            })(
                                <RadioGroup>
                                    <Radio value={1}>男</Radio>
                                    <Radio value={2}>女</Radio>
                                    <Radio value={3}>未知</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12} id="addressCascader">
                        <Form.Item label='所在省市' {...formItemLayout} >
                            {getFieldDecorator('addressKey', {
                                initialValue: user ? user.addressKey : ""
                            })(
                                <Cascader
                                    style={{ width: '100%' }}
                                    options={city}
                                    placeholder='请选择省市'
                                    getPopupContainer={() =>
                                        document.getElementById('addressCascader')
                                    }
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                         <Form.Item label='工单来源' {...formItemLayout}>
                            {getFieldDecorator('sourceid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择工单来源'
                                    }
                                ],
                                initialValue: user && user.sourceid? user.sourceid : ''
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '47%',marginRight:'5%' }}
                                    placeholder="请选择工单来源"
                                    onChange={this.handleSourceChange}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    disabled={ user && user.sourceid ? true : false}
                                >
                                    <Option key='' value=''>选择来源</Option>
                                    {jobordersource && jobordersource.length > 0 ? jobordersource.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                            {getFieldDecorator('sourceid2', {
                                initialValue: user && user.sourceid2? user.sourceid2 : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="二级来源"
                                    onChange={this.handleSourceChild}
                                    style={{ width: '47%' }}
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                      disabled={ user && user.sourceid2 ? true : false}
                                >
                                    <Option key='' value=''>选择二级来源</Option>
                                    {jobordersourcechild && jobordersourcechild.length > 0 ? jobordersourcechild.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                       <Form.Item label='来源日期' {...formItemLayout}>
                            {getFieldDecorator('sourcedate', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择来源日期'
                                    }
                                ],
                                initialValue: user && user.sourcedate ? moment(user.sourcedate, 'YYYY/MM/DD') : ''
                            })(
                                <DatePicker format='YYYY/MM/DD' disabled={ user && user.sourcedate ? true : false}/>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                         <Form.Item label='所属门诊' {...formItemLayout}>
                            {getFieldDecorator('clinicid', {
                                initialValue: currentOrder && currentOrder.clinicid ? currentOrder.clinicid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择门诊"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择门诊</Option>
                                    { clinicdropmenu && clinicdropmenu.length > 0 ? clinicdropmenu.map(item => {
                                        return <Option key={item.clinicid} value={item.clinicid}>{item.shortname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>


                    <Col span={12}>
                         <Form.Item label='主诉' {...formItemLayout}>
                            {getFieldDecorator('projectid', {
                              rules: [
                                  {
                                      required: true,
                                      message: '请选择主诉'
                                  }
                              ],
                                initialValue: currentOrder && currentOrder.projectid ? currentOrder.projectid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择主诉"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>请选择主诉</Option>
                                    { reservedpro && reservedpro.length > 0 ? reservedpro.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                       <Form.Item label='预约日期' {...formItemLayout}>
                            {getFieldDecorator('reservedate', {
                                initialValue: currentOrder && currentOrder.reservedate ? moment(currentOrder.reservedate, 'YYYY/MM/DD') : ''
                            })(
                                <DatePicker format='YYYY/MM/DD'/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                          <Form.Item label='预约时间' {...formItemLayout}>
                              {getFieldDecorator('reservetime', {
                                  initialValue: currentOrder && currentOrder.reservetime ? currentOrder.reservetime : ''
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
                    <Col span={12}>
                         <Form.Item label='跟进人员' {...formItemLayout}>
                            {getFieldDecorator('adminid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择跟进人员'
                                    }
                                  ],
                                  initialValue: currentOrder && currentOrder.adminid && modalKey == 'edit'? currentOrder.adminid : userinfo.adminid
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择跟进人员"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择跟进人员</Option>
                                    { electriclist && electriclist.length > 0 ? electriclist.map(item => {
                                        return <Option key={item.adminid} value={item.adminid}>{item.name}</Option>
                                    }) : null}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='患者主诉' {...formItemLayout}>
                            {getFieldDecorator('complaint', {
                                initialValue: currentOrder && currentOrder.complaint?  currentOrder.complaint : ""
                            })(
                                <TextArea rows={4} placeholder="请输入患者主诉"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='备注' {...formItemLayout}>
                            {getFieldDecorator('worknotes', {
                                initialValue: currentOrder && currentOrder.worknotes?  currentOrder.worknotes : ""
                            })(
                                <TextArea rows={4} placeholder="请输入备注"/>
                            )}
                        </Form.Item>
                    </Col>

                </Row>
            </Form>
        </div>
        )
    }
}


export default ComSave
