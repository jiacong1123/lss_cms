import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon,Modal} from 'antd';
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
const { TextArea } = Input;

class ComSave extends React.Component {

    state = {
        previewVisible: false,
        previewImage: ''
    }

    componentDidMount = () => {
        const { currentClinic,modalKey } = this.props
        if( modalKey === 'edit'){
            this.props.getImageList('fileListA',this.handleKeynameToUrl(currentClinic.milieupicture))
            this.props.getImageList('fileListB',this.handleKeynameToUrl(currentClinic.devicepicture))
            this.props.getImageList('fileListC',this.handleKeynameToUrl(currentClinic.image))
        }
    }

    handleCancel = (key) => this.setState({ [key]: false })

    handlePreview = (key1,key2, file) => {
        this.setState({
            [key1]: file.url || file.thumbUrl,
            [key2]: true,
        });
    }

    handleChange = (key , { fileList }) => {
        this.props.getImageList(key,fileList)
    }

    handleKeynameToUrl = (str)=> {
        const list = str ? str.split(',') : ''
        const arr = []
        list && list.map((item,index)=> {
            arr.push({url: item,uid:index})
        })
        return arr
    }

    

    render() {
        const { currentClinic, token, fileListA, fileListB,fileListC } = this.props
        const { getFieldDecorator } = this.props.form

        const { previewVisible,previewImage } = this.state;
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
                        <Form.Item label='诊所名称' {...formItemLayout}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入诊所名称'
                                    }
                                ],
                                initialValue: currentClinic ? currentClinic.name : ""
                            })(
                                <Input placeholder="请输入诊所名称" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='诊所简称' {...formItemLayout}>
                            {getFieldDecorator('shortname', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入诊所简称'
                                    }
                                ],
                                initialValue: currentClinic ? currentClinic.shortname : ""
                            })(
                                <Input placeholder="请输入诊所简称" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='主治项目' {...formItemLayout}>
                            {getFieldDecorator('mainproject', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入主治项目'
                                    }
                                ],
                                initialValue: currentClinic ? currentClinic.mainproject : ""
                            })(
                                <Input placeholder="请输入主治项目" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='诊所电话' {...formItemLayout}>
                            {getFieldDecorator('telephone', {
                                rules: [
                                    {
                                        required: true,
                                        pattern:'([0-9]{3,4}-)?[0-9]{7,8}',
                                        message:'请输入正确的诊所电话'
                                    }
                                ],
                                initialValue: currentClinic ? currentClinic.telephone : ""
                            })(
                                <Input placeholder="请输入诊所电话" />
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label='负责人姓名' {...formItemLayout}>
                            {getFieldDecorator('principal', {
                                initialValue: currentClinic ? currentClinic.principal : ""
                            })(
                                <Input placeholder="请输入负责人姓名" />
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label='负责人电话' {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        pattern: '^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[6|7|8]|18[0|1|2|3|5|6|7|8|9])\\d{8}$',
                                        message: '请输入正确的负责人电话'
                                    }
                                ],
                                initialValue: currentClinic ? currentClinic.phone : ""
                            })(
                                <Input placeholder="请输入负责人电话" disabled={currentClinic && currentClinic.phone ? true : false}/>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12} id="addressCascader">
                        <Form.Item label='门诊地址' {...formItemLayout} >
                            {getFieldDecorator('addressKey', {
                                rules: [
                                    {
                                        required: true,
                                        message:'请选择门诊地址'
                                    }
                                ],
                                initialValue: currentClinic ? currentClinic.addressKey : ""
                            })(
                                <Cascader
                                    style={{ width: '100%' }}
                                    options={city}
                                    placeholder='请选择地址'
                                    getPopupContainer={() =>
                                        document.getElementById('addressCascader')
                                    }
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='详细地址' {...formItemLayout}>
                            {getFieldDecorator('address', {
                                rules: [
                                    {
                                        required: true,
                                        message:'请输入详细地址'
                                    }
                                ],
                                initialValue: currentClinic ? currentClinic.address : ""
                            })(
                                <Input placeholder="请输入详细地址" />
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
                                initialValue: currentClinic && currentClinic.type ? currentClinic.type : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择类型"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择类型</Option>
                                    <Option key={1} value={1}>自有</Option>
                                    <Option key={2} value={2}>合作</Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='排班说明' {...formItemLayout}>
                            {getFieldDecorator('description', {
                                initialValue: currentClinic && currentClinic.description?  currentClinic.description : ""
                            })(
                                <TextArea rows={4} placeholder="请输入排班说明"/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='门诊主图' {...formItemLayout}>
                            {getFieldDecorator('mainlist', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传门诊主图'
                                    }
                                ],
                                valuePropName: 'mainlist',
                                initialValue: fileListC
                            })(
                                <Upload
                                    action={window.actionUrl}
                                    listType="picture-card"
                                    fileList={ fileListC }
                                    onPreview={this.handlePreview.bind(this,'previewImage','previewVisible')}
                                    onChange={this.handleChange.bind(this,'fileListC')}
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
                                {fileListC.length >= 1 ? null : uploadButton}
                               </Upload>
                               )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='门诊环境图' {...formItemLayout}>
                            {getFieldDecorator('milieulist', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传门诊环境图'
                                    }
                                ],
                                valuePropName: 'milieulist',
                                initialValue: fileListA
                            })(
                                <Upload
                                    action={window.actionUrl}
                                    listType="picture-card"
                                    fileList={ fileListA }
                                    onPreview={this.handlePreview.bind(this,'previewImage','previewVisible')}
                                    onChange={this.handleChange.bind(this,'fileListA')}
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
                                {fileListA.length >= 8 ? null : uploadButton}
                               </Upload>
                                
                               )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='门诊设备图' {...formItemLayout}>
                            {getFieldDecorator('devicelist', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请上传门诊设备图'
                                    }
                                ],
                                valuePropName: 'devicelist',
                                initialValue: fileListB
                            })(
                                <Upload
                                    action={window.actionUrl}
                                    listType="picture-card"
                                    fileList={ fileListB }
                                    onPreview={this.handlePreview.bind(this,'previewImage','previewVisible')}
                                    onChange={this.handleChange.bind(this,'fileListB')}
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
                                {fileListB.length >= 8 ? null : uploadButton}
                               </Upload>
                                
                               )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this,'previewVisible')}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
        )
    }
}


export default ComSave