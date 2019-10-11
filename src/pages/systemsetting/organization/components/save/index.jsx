import React from 'react'
import {  Form, Row, Col, Input, TreeSelect } from 'antd';
import moment from 'moment'
import city from 'utils/city'
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


const { TextArea } = Input;

class ComSave extends React.Component {
    state = {
     value: undefined,
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
        const { form, orgList } = this.props
        const { getFieldDecorator } = form
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label='机构名称' {...formItemLayout}>
                          {getFieldDecorator('orgName', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入机构名称'
                                }
                            ],
                          })(<Input placeholder="请输入机构名称" />
                        )}
                        </Form.Item>
                    </Col>
                    <Col span={24} id="addressCascader">
                        <Form.Item label='上级机构' {...formItemLayout} >
                        {getFieldDecorator('parentId', {
                          rules: [
                            {
                              required: true,
                              message: '请选择上级机构'
                            }
                          ],
                        })(<TreeSelect
                                value={this.state.value}
                                dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                                placeholder="请选择"
                                treeDefaultExpandAll
                                onChange={this.onChange}>

                                <TreeNode value={orgList.id} title={orgList.orgName} key={orgList.id}>
                                  {this.selectTree(orgList.child)}
                                </TreeNode>
                              </TreeSelect>
                        )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='备注' {...formItemLayout}>
                        {getFieldDecorator('remark', {
                        })(<TextArea rows={4} placeholder="请输入备注"/>
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
