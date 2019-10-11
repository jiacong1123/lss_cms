import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon} from 'antd';
import moment from 'moment'
import PropTypes from 'prop-types'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { ImageUtils } from 'braft-finder'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import city from 'utils/city'

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
        smallIconUrl: null,
        percent:0,
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    }

    componentDidMount = () => {
        const { content } = this.props.currentNews
        this.setState({
            editorState: BraftEditor.createEditorState(content)
        })
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
    uploadHandler = (key,info) => {
            // Get this url from response in real world.
            if( key === 'image'){
                if (info.file.status === 'uploading') {
                    this.setState({ loading: true });
                    return;
                }
                if (info.file.status === 'done') {
                    this.getBase64(info.file.originFileObj, imageUrl => this.setState({
                        imageUrl,
                        loading: false,
                    }))
                }
            } else if (key === 'contentImage') {
                this.setState({
                    percent: info.event? info.event.percent : 0
                })
                if (info && info.file && info.file.response) {
                    message.success('上传成功!', 1)
                    this.setState({
                        editorState: ContentUtils.insertMedias(this.state.editorState, [{
                            type: 'IMAGE',
                            url: window.imagesUrl + info.file.response.key,
                            percent:0
                        }])
                    })
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

    handleEditorChange = (editorState) => {
        this.props.form.setFieldsValue({'content': editorState.toHTML()})
        this.setState({ editorState })
    }


    render() {
        const { currentNews,token} = this.props
        const { getFieldDecorator } = this.props.form
        const { editorState } = this.state
        const controls = ['undo', 'redo', 'separator',
        'font-size', 'line-height', 'letter-spacing', 'separator',
        'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
        'superscript', 'subscript', 'remove-styles',  'separator', 'text-indent', 'text-align', 'separator',
        'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
        'link', 'separator', 'hr', 'separator',
        'media', 'separator',
        'clear']
        const extendControls = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        accept="image/jpg,image/jpeg,image/png,image/bmp"
                        showUploadList={false}
                        action={window.actionUrl}
                        data={{ token }}
                        headers={
                            {
                                'Access-Control-Allow-Headers': 'X-File-Name, X-File-Type, X-File-Size',
                                'Access-Control-Allow-Methods': 'OPTIONS, HEAD, POST',
                                'Access-Control-Allow-Origin': '*'
                            }
                        }
                        onChange={this.uploadHandler.bind(this,'contentImage')}
                        multiple={true}
                        withCredentials={false}
                    >
                        {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                        <button type="button" className="control-item button upload-button" data-title="插入图片">
                            <Icon type="picture" theme="filled" />
                        </button>
                    </Upload>
                )
            }
        ]

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
                                initialValue: currentNews ? currentNews.title : ""
                            })(
                                <Input placeholder="请输入标题"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='副标题' {...formItemLayout}>
                            {getFieldDecorator('subtitle', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入副标题'
                                    }
                                ],
                                initialValue: currentNews && currentNews.subtitle?  currentNews.subtitle : ""
                            })(
                                <Input placeholder="请输入副标题"/>
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
                                initialValue: currentNews && currentNews.type? currentNews.type : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择类型"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择类型</Option>
                                    <Option key='' value={1}>新闻动态</Option>
                                    <Option key='' value={2}>部落动态</Option>
                                    <Option key='' value={3}>公益活动</Option>
                                </Select>,
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
                                initialValue: currentNews && currentNews.status ? currentNews.status : 1
                            })(
                                <RadioGroup>
                                    <Radio value={0}>禁用</Radio>
                                    <Radio value={1}>启用</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='主图' {...formItemLayout}>
                            {getFieldDecorator('image', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传插图'
                                    }
                                ],
                                valuePropName: 'image',
                                initialValue: currentNews ? currentNews.image : ''
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
                                    { this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" /> : ( currentNews && currentNews.image ?  <img src={currentNews.image} alt="avatar" />: (<div>
                                        <Icon type={this.state.loading ? 'loading' : 'plus'} />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>))}
                                </Upload>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='小图(750*300)' {...formItemLayout}>
                            {getFieldDecorator('smallIcon', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传小图'
                                    }
                                ],
                                valuePropName: 'smallIcon',
                                initialValue: currentNews ? currentNews.smallIcon : ''
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
                                    { this.state.smallIconUrl ? <img src={this.state.smallIconUrl} alt="avatar" /> : ( currentNews && currentNews.smallIcon ?  <img src={currentNews.smallIcon} alt="avatar" />: (<div>
                                        <Icon type={this.state.loading ? 'loading' : 'plus'} />
                                        <div className="ant-upload-text">Upload</div>
                                    </div>))}
                                </Upload>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='新闻链接' {...formItemLayout}>
                            {getFieldDecorator('url', {
                                initialValue: currentNews && currentNews.url ? currentNews.url : ""
                            })(
                                <Input placeholder="请输入新闻链接"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='新闻内容' {...formItemLayout}>
                           {getFieldDecorator('content', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入新闻内容'
                                    }
                                ],
                                initialValue: currentNews ? currentNews.content : ''
                            })(
                                <div>
                                    <BraftEditor
                                        value={editorState}
                                        onChange={this.handleEditorChange}
                                        controls={controls}
                                        extendControls={extendControls}
                                        placeholder="请输入新闻内容"
                                        ref={instance => this.editorInstance = instance}
                                        style={{border: '1px solid #eeeeee'}}
                                    />
                                    <Input style={{display:'none'}}/>
                                </div>
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