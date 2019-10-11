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
        imageUrl:null,
        smallIconUrl: null
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
         reader.addEventListener('load', () => callback(reader.result));
         reader.readAsDataURL(img);
    }

    beforeUpload = (file) => {

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片不能超过2MB!');
        }
        return  isLt2M;
    }

    //上传成功显示上传的照片
    uploadHandler = (key, info) => {
      if (key === 'image') {
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
      } else if (key === 'smallIcon') {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, smallIconUrl => this.setState({
                smallIconUrl,
                loading: false,
            }))
        }
      }

    }

    render() {
        const { currentCarousel,token} = this.props
        const { getFieldDecorator } = this.props.form


        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='标题' {...formItemLayout}>
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入标题'
                                    }
                                ],
                                initialValue: currentCarousel ? currentCarousel.title : ""
                            })(
                                <Input placeholder="请输入标题"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='图片链接' {...formItemLayout}>
                            {getFieldDecorator('url', {
                              
                                initialValue: currentCarousel && currentCarousel.url?  currentCarousel.url : ""
                            })(
                                <Input placeholder="请输入图片链接"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='类型' {...formItemLayout}>
                            {getFieldDecorator('type', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择类型'
                                    }
                                ],
                                initialValue: currentCarousel && currentCarousel.type ? currentCarousel.type : 1
                            })(
                                <RadioGroup>
                                    <Radio value={1}>首页</Radio>
                                    <Radio value={2}>医生</Radio>
                                    <Radio value={3}>百科</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='状态' {...formItemLayout}>
                            {getFieldDecorator('status', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择状态'
                                    }
                                ],
                                initialValue: currentCarousel && currentCarousel.status ? currentCarousel.status : 1
                            })(
                                <RadioGroup>
                                    <Radio value={0}>禁用</Radio>
                                    <Radio value={1}>启用</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='轮播大图' {...formItemLayout}>
                            {getFieldDecorator('image', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传轮播大图'
                                    }
                                ],
                                valuePropName: 'image',
                                initialValue: currentCarousel ? currentCarousel.image : ''
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
                                    onChange={this.uploadHandler.bind(this,'image')}
                                    multiple={true}
                                    withCredentials={false}
                                >
                                    { this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" /> : ( currentCarousel && currentCarousel.image ?  <img src={currentCarousel.image} alt="avatar" />: (<div>
                                        <Icon type={this.state.loading ? 'loading' : 'plus'} />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>))}
                                </Upload>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='轮播小图(750 * 500)' {...formItemLayout}>
                            {getFieldDecorator('smallIcon', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传轮播小图'
                                    }
                                ],
                                valuePropName: 'smallIcon',
                                initialValue: currentCarousel ? currentCarousel.smallIcon : ''
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
                                    onChange={this.uploadHandler.bind(this,'smallIcon')}
                                    multiple={true}
                                    withCredentials={false}
                                >
                                    { this.state.smallIconUrl ? <img src={this.state.smallIconUrl} alt="avatar" /> : ( currentCarousel && currentCarousel.smallIcon ?  <img src={currentCarousel.smallIcon} alt="avatar" />: (<div>
                                        <Icon type={this.state.loading ? 'loading' : 'plus'} />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>))}
                                </Upload>
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
