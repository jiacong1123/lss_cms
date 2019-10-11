import React from 'react'
import {
    ConfigProvider, Table ,Modal,Avatar,Button,Icon,Form, Row, Col, Input,DatePicker,message,InputNumber,Tooltip
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import mixin from 'themes/mixin.less'
import { parseTime } from 'utils/mm'
import {_mmStampToTime, _mmTimeToStamp } from 'utils/mm'

const confirm = Modal.confirm
const { TextArea } = Input
const { RangePicker } = DatePicker

const formItemLayout = {
    labelCol: {
        xs: { span: 18 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
    },
}

class PayForm extends React.Component {

      state = {
        pagination: {},
        visible: false
      }
      // 点击操作按钮
      handleMenuClick = (record, e) => {
        if ( e.key === '1' ) {
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/worktaskdetail?key=worktaskdetail&orderno=${record.orderno}&type=alreadydeal`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/worktaskdetail',
            query: {
              orderno: record.orderno,
              key: 'worktaskdetail',
              type: 'alreadydeal'
            },
          })
        }
        if( e.key === '2' ) {
          this.setState({
            visible: true,
            orderno: record.orderno,
            lastReceive: record.receivablesamt, //应收
            lastAmount: record.amount,   //实收
          });
        }
    }

    handleOk = e => {
      const { validateFields } = this.props.form
      const { orderno, lastReceive, lastAmount } = this.state
      validateFields((err, values) => {
          if (!err) {
            values.orderno = orderno
            values.amount = Number(values.amount) * 100   //本次实收
            values.receivablesamt = lastReceive - lastAmount   //本次应收
            values.debtamt = lastReceive - lastAmount - Number(values.amount) //本次欠收

            this.props.onChargeSave(values)
            this.setState({ visible: false });
          }
      })
    };

    handleCancel = e => {
      this.setState({
        visible: false,
      });
    };


    // 拨打电话
    handleMakeCall = (record) => {
      this.props.clearCurrentCallInfo()
      this.props.onBindCallPhone(record)
    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetOrderList({page: pagination.current, limit:10,...searchValue})
    }

    render(){
      const columns = [
          {
            title: '客户姓名',
            key: 'name',
            render: (text, record) => {
              const { name } = record
              return (
                <div className={mixin.lightHeight}>{name}</div>
              )
            }
          },
          {
            title: '电话',
            key: 'phone',
            render: (text, record) => {
              const { phone } = record
              return (
                <div className={mixin.lightHeight}>{phone}</div>
              )
            }
          },
          {
            title: '客户标签',
            key: 'lablenames',
            width: 250,
            render: (text, record) => {
              const { lablenames, lableremarks } = record
              return (
                <p>
                <span style={{marginRight:20}}>{lablenames}</span>
                </p>
              )
            }
          },
          {
            title: '最近联系',
            key: 'followuptime',
            onCell: () => {
              return {
                style: {
                  maxWidth: 200,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow:'ellipsis',
                  cursor:'pointer'
                }
              }
            },
            render: (text, record) => {
              const { followuptime, followupremarks } = record
              return (
                <Tooltip placement="top" title = {followuptime ? parseTime(followuptime) + followupremarks : followupremarks}>
                  {followuptime ? parseTime(followuptime) + followupremarks : followupremarks}
                </Tooltip>
              )
            }
          },
          {
            title: '所属门诊',
            dataIndex: 'clinicname',
          },
          {
            title: '预约项目',
            dataIndex: 'project',

          },
          {
            title: '所属人员',
            dataIndex: 'adminname',
          },
          {
            title: '应收金额',
            key: 'receivablesamt',
            render: (text, record) => {
              const { receivablesamt } = record
              return (
              <p>{ receivablesamt / 100 }</p>
              )
            }
          },
          {
            title: '实收金额',
            key: 'amount',
            render: (text, record) => {
              const { amount } = record
              return (
              <p>{ amount / 100 }</p>
              )
            }
          },
          {
            title: '联系客户',
            key: 'concatcustom',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              const { orderno,isclue } = record
              return (
              <div className={styles.operBtnBox}>
                <Button size="small" type="primary" onClick={e => this.handleMakeCall(record)}><Icon type="phone" /></Button>
              </div>
              )
            }
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => {
              return (
              <DropOption
                  onMenuClick={e => this.handleMenuClick(record, e)}
                  menuOptions={[
                     { key: '1', name: '详情' },
                     { key: '2', name: '收费登记' }
                  ]}
              />
              )
            }
          }
      ]

      const { rowSelection, orderlist, loading, total, currentPage, form } = this.props
      const { getFieldDecorator } = form
      const { pagination, lastReceive, lastAmount } = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
        <div>
            <ConfigProvider>
                <Table
                   columns={columns}
                   dataSource={orderlist}
                   bordered
                   scroll={{ x: 1300 }}
                   loading={loading}
                   pagination={pagination}
                   onChange={this.handleTableChange}
                />
            </ConfigProvider>
            <Modal
              title="收费登记"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
            <Form layout='inline' >
              <Row gutter={24}>
              <Col span={24}>
                  <Form.Item label='欠收费用' {...formItemLayout}>
                    {getFieldDecorator('receivablesamt', {})(
                        <p>{ (lastReceive - lastAmount)/100 }元</p>
                    )}
                  </Form.Item>
              </Col>
                <Col span={24}>
                    <Form.Item label='收费时间' {...formItemLayout}>
                    {getFieldDecorator('payTime', {
                      rules: [
                          {
                              required: true,
                              message: '请输入收费时间'
                          }
                      ]
                    })(
                      <DatePicker showTime />
                    )}

                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label='本次收费' {...formItemLayout}>
                    {getFieldDecorator('amount', {
                      rules: [
                          {
                              required: true,
                              message: '请输入收费'
                          }
                      ]
                    })(
                      <InputNumber  style={{width: '100%'}} suffix="元"/>
                    )}
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label='备注' {...formItemLayout}>
                      {getFieldDecorator('remark', {})(
                        <TextArea rows={6} />
                      )}
                    </Form.Item>
                </Col>
              </Row>
            </Form>

            </Modal>
        </div>
      )
    }
}


const List = Form.create()(PayForm);
export default List;
