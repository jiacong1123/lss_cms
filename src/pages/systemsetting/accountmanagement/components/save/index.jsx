import React from 'react'
import {  Form, Row, Col, Input, Select, TreeSelect } from 'antd';
import PropTypes from 'prop-types'
import styles from './index.less'
const TreeNode = TreeSelect.TreeNode;


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

class ComSave extends React.Component {
    state = {
     value: undefined,
    };
 
    onSelect = (value, node, extra) => {
      this.props.OnSelectOrg({
        editId: node.props.value,
        editName: node.props.title,
      })
    };

    onChange = value => {
       this.setState({ value: value });
    };

    selectTree = data => {
      return data ? data.map((item,index)=> {
        if (item.child) {
          return (
            <TreeNode value={item.id} title={item.orgName} key={item.id}>
              {this.selectTree(item.child)}
            </TreeNode>
          )
        }
        return (
          <TreeNode value={item.id} title={item.orgName} key={item.id}></TreeNode>
        )
      }) : null
    }

    render() {
        const { currentAdmin, clinicdropmenu, orgList } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label='姓名' {...formItemLayout}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入姓名'
                                    }
                                ],
                                initialValue: currentAdmin ? currentAdmin.name : ""
                            })(
                                <Input placeholder="请输入姓名" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='手机号' {...formItemLayout}>
                            {getFieldDecorator('phone', {
                                rules: [
                                    {
                                        required: true,
                                        pattern: '^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[6|7|8]|18[0|1|2|3|5|6|7|8|9])\\d{8}$',
                                        message: '请输入正确的手机号'
                                    }
                                ],
                                initialValue: currentAdmin ? currentAdmin.phone : ""
                            })(
                                <Input placeholder="请输入手机号" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='账号' {...formItemLayout}>
                            {getFieldDecorator('loginame', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入账号'
                                    }
                                ],
                                initialValue: currentAdmin ? currentAdmin.loginame : ""
                            })(
                                <Input placeholder="请输入账号" disabled={currentAdmin && currentAdmin.loginame ? true : false} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='机构' {...formItemLayout}>
                          {getFieldDecorator('orgId', {
                            rules: [
                              {
                                required: true,
                                message: '请选择机构'
                              }
                            ],
                            initialValue: currentAdmin ? currentAdmin.orgId : ""
                          })(<TreeSelect
                                  value={this.state.value}
                                  dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                                  placeholder="请选择"
                                  treeDefaultExpandAll
                                  onChange={this.onChange}
                                  onSelect={this.onSelect}>
                                  <TreeNode value={orgList.id} title={orgList.orgName} key={orgList.id}>
                                    {this.selectTree(orgList.child)}
                                  </TreeNode>
                                </TreeSelect>
                          )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='微信号' {...formItemLayout}>
                            {getFieldDecorator('noWx', {
                                rules: [
                                    {
                                        required: currentAdmin ? false : true,
                                        message: '请输入微信号'
                                    }
                                ],
                                initialValue: currentAdmin ? currentAdmin.noWx : ""
                            })(
                                <Input placeholder="请输入微信号" type="text" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='密码' {...formItemLayout}>
                            {getFieldDecorator('loginpwd', {
                                rules: [
                                    {
                                        required: currentAdmin ? false : true,
                                        message: '请输入密码'
                                    }
                                ],
                            })(
                                <Input placeholder="请输入密码" type="password" />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='选择诊所' {...formItemLayout}>
                            {getFieldDecorator('clinicid', {
                                initialValue: currentAdmin && currentAdmin.clinicid? currentAdmin.clinicid : ''
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择诊所"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option key='' value=''>选择诊所</Option>
                                    {clinicdropmenu && clinicdropmenu.length > 0 ? clinicdropmenu.map(item => {
                                        return <Option key={item.clinicid} value={item.clinicid}>{item.shortname}</Option>
                                    }) : null}
                                </Select>,
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
