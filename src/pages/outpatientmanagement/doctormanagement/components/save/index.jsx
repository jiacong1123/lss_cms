import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon} from 'antd';
import moment from 'moment'
import city from 'utils/city'
import PropTypes from 'prop-types'
import styles from './index.less'

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

    render() {
        const { currentDoctor,clinicdropmenu,departmentlist, jobtitle,token} = this.props
        const { getFieldDecorator } = this.props.form

        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='医生头像' {...formItemLayout}>
                            {getFieldDecorator('photo', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传医生头像'
                                    }
                                ],
                                valuePropName: 'photo',
                                initialValue: currentDoctor ? currentDoctor.photo : ''
                            })(
                                <Upload
                                    name="file"
                                    accept="image/jpg,image/jpeg,image/png,image/bmp"
                                    listType="picture-card"
                                    className={styles.avatarUploader}
                                    showUploadList={false}
                                    action={window.actionUrl}
                                    data={{token}}
                                    headers={
                                        {
                                            'Access-Control-Allow-Headers': 'X-File-Name, X-File-Type, X-File-Size',
                                            'Access-Control-Allow-Methods': 'OPTIONS, HEAD, POST',
                                            'Access-Control-Allow-Origin': '*'
                                        }
                                    }
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.handleChange}
                                    multiple={true}
                                    withCredentials={false}
                                >
                                    { this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" /> : ( currentDoctor && currentDoctor.photo ?  <img src={currentDoctor.photo} alt="avatar" />: (<div>
                                        <Icon type={this.state.loading ? 'loading' : 'plus'} />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>))}
                                </Upload>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='医生姓名' {...formItemLayout}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入医生姓名'
                                    }
                                ],
                                initialValue: currentDoctor ? currentDoctor.name : ""
                            })(
                                <Input placeholder="请输入医生姓名" />
                            )}
                        </Form.Item>
                    </Col>
                    
                    <Col span={12}>
                        <Form.Item label='性别' {...formItemLayout}>
                            {getFieldDecorator('sex', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择性别'
                                    }
                                ],
                                initialValue: currentDoctor && currentDoctor.sex ? currentDoctor.sex : 1
                            })(
                                <RadioGroup>
                                    <Radio value={1}>男</Radio>
                                    <Radio value={2}>女</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                         <Form.Item label='医生职称' {...formItemLayout}>
                            {getFieldDecorator('titleid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择职称'
                                    }
                                ],
                                initialValue: currentDoctor && currentDoctor.titleid? currentDoctor.titleid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择职称"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择职称</Option>
                                    {jobtitle && jobtitle.length > 0 ? jobtitle.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                         <Form.Item label='所在诊所' {...formItemLayout}>
                            {getFieldDecorator('clinicid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择诊所'
                                    }
                                ],
                                initialValue: currentDoctor && currentDoctor.clinicid ? currentDoctor.clinicid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择诊所"
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
                    <Col span={12}>
                         <Form.Item label='科室' {...formItemLayout}>
                            {getFieldDecorator('ksid', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择科室'
                                    }
                                ],
                                initialValue: currentDoctor && currentDoctor.ksid ? currentDoctor.ksid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择科室"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择科室</Option>
                                    { departmentlist && departmentlist.length > 0 ? departmentlist.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label='联系电话' {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        required:true,
                                        pattern: '^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[6|7|8]|18[0|1|2|3|5|6|7|8|9])\\d{8}$',
                                        message: '请输入正确的联系电话'
                                    }
                                ],
                                initialValue: currentDoctor ? currentDoctor.phone : ""
                            })(
                                <Input placeholder="请输入联系电话" disabled={currentDoctor && currentDoctor.phone ? true : false}/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='擅长' {...formItemLayout}>
                            {getFieldDecorator('goodat', {
                                rules: [
                                    {
                                        required:true,
                                        message: '请输入擅长'
                                    }
                                ],
                                initialValue: currentDoctor && currentDoctor.goodat?  currentDoctor.goodat : ""
                            })(
                                <TextArea rows={4} placeholder="请输入擅长"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='医生简介' {...formItemLayout}>
                            {getFieldDecorator('synopsis', {
                                rules: [
                                    {
                                        required:true,
                                        message: '请输入医生简介'
                                    }
                                ],
                                initialValue: currentDoctor && currentDoctor.synopsis?  currentDoctor.synopsis : ""
                            })(
                                <TextArea rows={4} placeholder="请输入医生简介"/>
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