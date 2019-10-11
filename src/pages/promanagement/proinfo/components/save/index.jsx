import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon,Modal} from 'antd';
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
        percent:0,
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null),
        previewVisible: false,
        previewImage: '',
        fileList: [],
    }

    componentDidMount = () => {
        const { editorState,currentPro,modalKey } = this.props
        if( modalKey === 'edit') {
            this.setState({
                editorState: BraftEditor.createEditorState(editorState),
            })
            this.props.getImageList(this.handleKeynameToUrl(currentPro.list))
        }
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
            }
    }

    handleEditorChange = (editorState) => {
        this.props.form.setFieldsValue({'details': editorState.toHTML()})
        this.setState({ editorState })
    }


    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {
        this.props.getImageList(fileList)
    }


    handleKeynameToUrl = (list)=> {
        const arr = []
        list && list.map((item,index)=> {
            arr.push({url: item['image'],uid:index})
        })

        return arr
    }


    render() {
        const { currentPro,token, reservedpro,fileList} = this.props
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
                        beforeUpload={this.beforeUpload}
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

        const { previewVisible, previewImage } = this.state
        const uploadButton = (
        <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
        </div>
        );

        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label='产品名称' {...formItemLayout}>
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入产品名称'
                                    }
                                ],
                                initialValue: currentPro ? currentPro.title : ""
                            })(
                                <Input placeholder="请输入产品名称"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='产品售价' {...formItemLayout}>
                            {getFieldDecorator('price', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入产品售价'
                                    }
                                ],
                                initialValue: currentPro && currentPro.price?  currentPro.price : ""
                            })(
                                <Input placeholder="请输入产品售价"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='市场价' {...formItemLayout}>
                            {getFieldDecorator('costprice', {
                                initialValue: currentPro && currentPro.costprice?  currentPro.costprice : ""
                            })(
                                <Input placeholder="请输入市场价"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                         <Form.Item label='预约项目' {...formItemLayout}>
                            {getFieldDecorator('classid', {
                                initialValue: currentPro && currentPro.classid ? currentPro.classid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择预约项目"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择预约项目</Option>
                                    { reservedpro && reservedpro.length > 0 ? reservedpro.map(item => {
                                        return <Option key={item.tagid} value={item.tagid}>{item.tagname}</Option>
                                    }) : null}
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
                                initialValue: currentPro && currentPro.status ? currentPro.status : 1
                            })(
                                <RadioGroup>
                                    <Radio value={0}>禁用</Radio>
                                    <Radio value={1}>启用</Radio>
                                </RadioGroup>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='产品描述' {...formItemLayout}>
                            {getFieldDecorator('des', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入产品描述'
                                    }
                                ],
                                initialValue: currentPro && currentPro.des?  currentPro.des : ""
                            })(
                                <TextArea rows={4} placeholder="请输入产品描述"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='产品图片' {...formItemLayout}>
                            {getFieldDecorator('list', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传产品图片'
                                    }
                                ],
                                valuePropName: 'list',
                                initialValue: fileList
                            })(
                                <div>
                                    <Upload
                                        action={window.actionUrl}
                                        listType="picture-card"
                                        fileList={ fileList }
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                        data={{token}}
                                        headers={
                                            {
                                                'Access-Control-Allow-Headers': 'X-File-Name, X-File-Type, X-File-Size',
                                                'Access-Control-Allow-Methods': 'OPTIONS, HEAD, POST',
                                                'Access-Control-Allow-Origin': '*'
                                            }
                                        }
                                        multiple={true}
                                        withCredentials={false}
                                    >
                                    { fileList.length >= 8 ? null : uploadButton }
                                    </Upload>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </div>
                            )}
                        </Form.Item>
                    </Col>
                    
                    <Col span={24}>
                        <Form.Item label='活动详情' {...formItemLayout}>
                           {getFieldDecorator('details', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入活动详情'
                                    }
                                ],
                                initialValue: currentPro ? currentPro.details : ''
                            })(
                                <div>
                                    <BraftEditor
                                        value={editorState}
                                        onChange={this.handleEditorChange}
                                        controls={controls}
                                        extendControls={extendControls}
                                        placeholder="请输入活动详情"
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