import React from 'react'
import {
    ConfigProvider, Table ,Modal,Avatar,Button,Icon, Radio, InputNumber,Form, Row, Col, DatePicker, Input, Tooltip, Checkbox
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import { parseTime } from 'utils/mm'
import mixin from 'themes/mixin.less'

const confirm = Modal.confirm;
const RadioGroup = Radio.Group
const { TextArea } = Input
const { RangePicker } = DatePicker


let userLabes = []
let userid = ''
let tagsName = []

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
        pagination: {
          showSizeChanger: true,
          onShowSizeChange: (current,pageSize) => this.onShowSizeChange(current,pageSize),
          pageSizeOptions: ['10', '20', '50', '100']
        },
        visible: false,
        userTags: [],
        chargeVisible: false
      }

      // 点击操作按钮
      handleMenuClick = (orderno, e, record) => {
        if ( e === 1 ) {  //编辑
          // 获取当前工单信息
          this.props.onGetCurrentOrder({orderno})
          this.timer = setTimeout(()=>{
              let { currentOrder } = this.props
              if(Object.keys(currentOrder).length != 0 ) {
                let { user } = currentOrder
                let { sourceid, sourceid2 } = user
                  //显示出对应的二级来源
                  this.props.onGetSourceChild({
                    tagid: sourceid,
                  })
                  //存储对应二级来源
                  this.props.onSetSourceChild({
                    tagid2: sourceid2,
                  })
              }
          },2000)

          // 弹出编辑工单modal
          this.props.onIsShowModal({
            visible:true,
            title: '编辑工单',
            modalKey: 'edit'
          })
        } else if (  e === 2 ) {
          // 获取当前工单信息
          this.props.onGetCurrentOrder({orderno})
          // 弹出转移客户modal
          this.props.onIsShowModal({
            visible:true,
            title: '转移客户',
            modalKey: 'single'
          })
        } else if (e === 3) {
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/worktaskdetail?key=worktaskdetail&orderno=${orderno}`
          // window.open(url)
          if (record.status == 4) { //已成交显示缴费记录
            this.props.history.push({
              pathname: '/worktaskmanagement/worktaskdetail',
              query: {
                orderno,
                key:  'worktaskdetail',
                type: 'alreadydeal'
              },
            })
          } else {
            this.props.history.push({
              pathname: '/worktaskmanagement/worktaskdetail',
              query: {
                orderno,
                key:  'worktaskdetail'
              },
            })
          }

        } else if ( e === 4 ) {
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/createclue?key=createclue&orderno=${orderno}`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/createclue',
            query: {
              orderno,
              key: 'createclue'
            },
          })
        } else if (  e === 5 ) {  //新分配处理
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/handleworktask?key=10&orderno=${orderno}`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/handleworktask',
            query: {
              orderno,
              key: 10,
              type: 'sharingOut'
            },
          })
        } else if (  e === 6 ) {  //待跟进处理
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/handleworktask?key=1&orderno=${orderno}`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/handleworktask',
            query: {
              orderno,
              key: 1,
              type: 'sharingOut'
            },
          })
        } else if (  e === 7 ) {  //已预约处理
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/handleworktask?key=2&orderno=${orderno}`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/handleworktask',
            query: {
              orderno,
              key: 2,
              type: 'sharingOut'
            },
          })
        } else if (  e === 8 ) {  //已到店处理
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/handleworktask?key=3&orderno=${orderno}`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/handleworktask',
            query: {
              orderno,
              key: 3,
              type: 'sharingOut'
            },
          })
        } else if (e === 9 ) {  //已关闭领取
          confirm({
            title: '你确定要领取： '+ name,
            okText: '是',
            okType: 'success',
            cancelText: '否',
            onOk: () => {
              this.props.onActiveOrder({orderno})
            }
          })
      } else if (e === 10) {  //取消共享
        confirm({
          title: '你确定要取消'+ name+'的共享吗',
          okText: '是',
          okType: 'success',
          cancelText: '否',
          onOk: () => {
            this.props.onCancleSharing({orderno})
          }
        })
      }
    }

    // 拨打电话
    handleMakeCall = (record) => {
      this.props.clearCurrentCallInfo()
      this.props.onBindCallPhone(record)
    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetOrderList({page: pagination.current, limit:pagination.pageSize,...searchValue })
    }

    //改变每页条数
    onShowSizeChange = (current, pageSize) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentSize(pageSize)
      this.props.onGetOrderList({page: 1, limit:pageSize, ...searchValue })
    }

    //添加、编辑客户标签
    handleLabels = (record) => {
      userLabes = []
      const { lablenames } = record
      const { customerTagsList } = this.props

      if (lablenames != null) {
        this.props.SetDefaultLabels(lablenames.split(','))
        this.setState({
          userTags: lablenames.split(',')
        });
        let aaa = lablenames.split(',')

        customerTagsList.forEach( (op, key) => {
          op.child.forEach((c) => {
            aaa.forEach( (e, index) => {
              if (c.tagname == e) {
                userLabes[key] = e
              }
            })
          })
        })
        // console.log(userLabes)
        // userLabes = userLabes.concat(aaa)
      }

      userid = record.userid
      this.setState({
        visible: true,
      });
    }

    handleOk = e => {
      this.setState({
        visible: false,
      });
      const { userTags } = this.state
      let aa = []
      let bb = []
      userLabes.forEach( (index) => {
        if (typeof(index) == 'object') {
          aa.push(index)
          aa = aa.flat()
        }
        if (typeof(index) == 'string') {
          bb.push(index)
        }
         tagsName = aa.concat(bb)
      })
      if (tagsName.length > 0) {
        this.props.onChangeLabels({
          labels: tagsName.join(','),
          userid: userid
        })
      }else {
        this.props.onChangeLabels({
          labels: '',
          userid: userid
        })
      }
      userLabes = []
      tagsName = []
    };

    handleCancel = e => {
      this.setState({
        visible: false,
      });
    };

     onChangeLaels = (e, index) => {
       userLabes[index] = e
       // userLabes = Array.from(new Set(userLabes))
     }
     //收费登记
     handleCharge = (record) => {
        this.setState({
          chargeVisible: true,
          orderno: record.orderno,
          lastReceive: record.receivablesamt, //应收
          lastAmount: record.amount,   //实收
        });
     }

     handleChargeOk = e => {
       const { validateFields } = this.props.form
       const { orderno, lastReceive, lastAmount } = this.state
       validateFields((err, values) => {
           if (!err) {
             values.orderno = orderno
             values.amount = Number(values.amount) * 100   //本次实收
             values.receivablesamt = lastReceive - lastAmount   //本次应收
             values.debtamt = lastReceive - lastAmount - Number(values.amount) //本次欠收

             this.props.onChargeSave(values)
             this.setState({ chargeVisible: false });
           }
       })
     };

     handleChargeCancel = e => {
       this.setState({
         chargeVisible: false,
       });
     };


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
            width: 120,
            render: (text, record) => {
              const { phone } = record
              return (
                <div className={mixin.lightHeight}>{phone}</div>
              )
            }
          },
          {
            title: '状态',
            key: 'status',
            render: (text, record) => {
              const { status, followup } = record
              return (
              <div className={styles.operBtnBox}>
                { status == 1 && followup > 0 ? '待跟进' : ''}
                { status == 1 && followup == 0 ? '新分配' : ''}
                { status == 0 ? '未分配' :''}
                { status == 2 ? '已预约' :''}
                { status == 3 ? '已到店' :''}
                { status == 4 ? '已完成' :''}
                { status == 5 ? '已关闭' :''}
              </div>
              )
            }

          },
          {
            title: '客户意向',
            dataIndex: 'level',
            width: 60,
          },
          {
            title: '客户标签',
            key: 'lablenames',
            width: 300,
            render: (text, record) => {
              const { lablenames, lableremarks } = record
              return (
                <p>
                <span style={{marginRight:20}}>{lablenames}</span>
                {
                  lablenames === null || lablenames == ""  ?
                  <Button size="small" type="primary" onClick={e => this.handleLabels(record)}>
                  <Icon type="plus-circle" theme="twoTone" /></Button> :
                  <Button size="small" type="primary" onClick={e => this.handleLabels(record)}>
                  <Icon type="edit" theme="twoTone" /></Button>
                }
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
                // <span className={styles.taWidth}>{followuptime ? parseTime(followuptime) + followupremarks : followupremarks}</span>
                <Tooltip placement="top" title = {followuptime ? parseTime(followuptime) + followupremarks : followupremarks}>
                  {followuptime ? parseTime(followuptime) + followupremarks : followupremarks}
                </Tooltip>
              )
            }
          },

          {
            title: '被共享人数',
            key: 'toMe',
            width: 100,
            render: (text, record) => {
              const { toMe } = record
              return (
                <span>{toMe ? toMe.split(',').length : ''}</span>
              )
            }
          },

          {
            title: '联系客户',
            key: 'concatcustom',
            fixed: 'right',
            width: 50,
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
            width: 150,
            render: (text, record) => {
              const { orderno, status, isclue } = record
              return (
                <div className={styles.operBtnBox}>
                  {status === 0 ? <Button type="danger" size="small" onClick={e => this.handleMenuClick(orderno, 2)}>分配</Button> : ''}
                  {status === 10 ? <Button type="danger" size="small" onClick={e => this.handleMenuClick(orderno, 5)}>处理</Button> : ''}
                  {status === 1 ? <Button type="danger" size="small" onClick={e => this.handleMenuClick(orderno, 6)}>处理</Button> : ''}
                  {status === 2 ? <Button type="danger" size="small" onClick={e => this.handleMenuClick(orderno, 7)}>处理</Button> : ''}
                  {status === 3 ? <Button type="danger" size="small" onClick={e => this.handleMenuClick(orderno, 8)}>处理</Button> : ''}
                  {status === 5 ? <Button type="danger" size="small" onClick={e => this.handleMenuClick(orderno, 9)}>领取</Button> : ''}
                  {status === 10 && isclue === 0 ?
                    <Button type="primary" size="small" onClick={e => this.handleMenuClick(orderno, 4)}>创建线索</Button> : ''
                  }
                  {status === 2 && isclue === 0 ?
                    <Button type="primary" size="small" onClick={e => this.handleMenuClick(orderno, 4)}>创建线索</Button> : ''
                  }
                  {status === 4 ? <Button size="small" onClick={e => this.handleCharge(record)}>收费登记</Button> : ''}
                  <Button size="small" onClick={e => this.handleMenuClick(orderno, 1)}>编辑</Button>
                  <Button size="small" onClick={e => this.handleMenuClick(orderno, 3, record)}>详情</Button>
                  <Button size="small" onClick={e => this.handleMenuClick(orderno, 10, record)}>取消共享</Button>
                </div>
              )
            }
          }
      ]
      const { rowSelection,orderlist, loading, total, currentPage, customerTagsList, form, defaultLabels, currentSize } = this.props
      const { getFieldDecorator } = form
      const { pagination, userTags, lastReceive, lastAmount } = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
        <div>
          <ConfigProvider>
              <Table
                 rowSelection={rowSelection}
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
            title="标签管理"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
          { customerTagsList ? customerTagsList.map((item,index) => {
              return <div  style={{marginBottom: 20}}>
                <p className={styles.borBottom}>{item.tagname}</p>
                <div >
                  <Checkbox.Group onChange={e => this.onChangeLaels(e, index)} key={index} defaultValue={defaultLabels}>
                    { item.child.map( (op) => {

                          return (
                                  <Checkbox
                                    style={{marginRight: 10, marginBottom: 10}}
                                    value={op.tagname}
                                  >
                                    {op.tagname}
                                  </Checkbox>
                          )

                    })}
                  </Checkbox.Group>
                </div>
              </div>
          }) : '' }

        </Modal>

        <Modal
          title="收费登记"
          visible={this.state.chargeVisible}
          onOk={this.handleChargeOk}
          onCancel={this.handleChargeCancel}
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


const List = Form.create()(PayForm)
export default List
