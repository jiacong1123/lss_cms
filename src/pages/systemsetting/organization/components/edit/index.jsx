import React from 'react'
import {  Form, Row, Col, Input, TreeSelect, Button } from 'antd';
import styles from './index.less'

const SelectTreeNode = TreeSelect.TreeNode;

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

@Form.create()

class Edit extends React.Component {
    state = {
     value: undefined,
    };

    onChange = value => {
       this.setState({ value: value });
    };

    editSubmit = () => {
      this.props.form.validateFields((err,values)=>{
          if (!err) {
              this.props.onEditOrganization(values)
          }
      })
    };

    deleteSubmit =() => {
      console.log('删除机构')
    };

    selectTree = data => {
      return data ? data.map((item,index)=> {
        if (item.child) {
          return (
            <SelectTreeNode value={item.id} title={item.orgName} key={item.id}>
              {this.selectTree(item.child)}
            </SelectTreeNode>
          )
        }
        return (
            <SelectTreeNode value={item.id} title={item.orgName} key={item.id}></SelectTreeNode>
          )
      }) : null
    }


    render() {
        const { orgList, clickTree } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <div>
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
                          initialValue: clickTree ? clickTree.editName : ""
                        })(
                          <Input placeholder="请输入机构名称" disabled={clickTree.editId == 1 ? true : false}/>)
                        }
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
                          initialValue: clickTree ? clickTree.editParentId : ""
                        })(
                            <TreeSelect
                                disabled={clickTree.editId == 1 ? true : false}
                                value={this.state.value}
                                dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                                placeholder="请选择"
                                treeDefaultExpandAll
                                onChange={this.onChange}>

                                <SelectTreeNode value={orgList.id} title={orgList.orgName} key={orgList.id}>
                                  {this.selectTree(orgList.child)}
                                </SelectTreeNode>
                              </TreeSelect>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label='备注' {...formItemLayout}>
                        {getFieldDecorator('remark', {
                          initialValue: clickTree ? clickTree.editRemark : ""
                        })(
                          <TextArea rows={4} placeholder="请输入备注" disabled={clickTree.editId == 1 ? true : false}/>
                        )}
                        </Form.Item>
                        <Button type="primary" onClick={this.editSubmit} disabled={clickTree.editId == 1 ? true : false}>保存</Button>
                        {/*<Button type="primary" onClick={this.deleteSubmit} className={styles.marLeft}>删除</Button>*/}
                    </Col>

                </Row>
            </Form>
        </div>
        )
    }
}


export default Edit
