
import React from 'react';
import { connect } from 'dva'
import {
  Card,
  Button,
  Row,Col,
  Icon,
  Spin,
  Form,
  Timeline,
  Radio,
  Modal,
  Checkbox,
} from 'antd'
import Tabsa from './components/tabsa'
import Tabsb from './components/tabsb'
import Tabsc from './components/tabsc'
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import styles from './index.less'
import mixin from 'themes/mixin.less'

const formItemLayout = {
  labelCol: {
      xs: { span: 24 },
      sm: { span: 6},
  },
  wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
  },
}

const namespace = 'handleworktask'
const RadioGroup = Radio.Group
let userLabes = []
let userid = ''


@connect(({layout,worktaskmanagement,handleworktask}) => ({
  ...layout,
  ...worktaskmanagement,
  ...handleworktask,
}),dispatch=>({
  onGetDoctorPersonnal(payload){
    dispatch(
      _mmAction(
        `layout/EFFECTS_GET_PERSONNAL`,
        payload
      )
    )
  },
  onReserveOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_RESERVE_ORDER`,
        payload
      )
    )
  },
  onFollowOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_FOLLOW_ORDER`,
        payload
      )
    )
  },
  onCloseOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_CLOSE_ORDER`,
        payload
      )
    )
  },
  onArrivalsOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_ARRIVALS_ORDER`,
        payload
      )
    )
  },
  onTurnFollowUpOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_TURNFOLLOWUP_ORDER`,
        payload
      )
    )
  },
  onUpdateReserveOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_UPDATERESERVE_ORDER`,
        payload
      )
    )
  },
  onTransActionOrder(payload){
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_TRANSACTION_ORDER`,
        payload
      )
    )
  },
  onGetProductDropmenu(payload){
    dispatch(
      _mmAction(
        `layout/EFFECTS_GET_PRODUCTDROPMENU`,
        payload
      )
    )
  },
  // 绑定外呼号码并拨号
  onBindCallPhone(payload) {
    dispatch(
      _mmAction(
        `layout/EFFECTS_BINDCALLPHONE`,
        payload
      )
    )
  },
  onChangeLabels(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_ONCHANGELABELS`,
        payload
      )
    )
  },
  getOrderDetails(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_GET_ORDERDETAIL`,
        payload
      )
    )
  },
  //清空当前拨号信息
  clearCurrentCallInfo(payload) {
    dispatch(
      _mmAction(
        `layout/EFFECTS_CLEAR_CURRENTCALLINFO`,
        payload
      )
    )
  },

}))

class Handleworktask extends React.Component {
  componentDidMount () {
    const params = this.props.history.location.query
    this.props.getOrderDetails(params)
  }
  state = {
    times:[
      '9:00~9:30',
      '9:30~10:00',
      '10:00~10:30',
      '10:00~11:00',
      '11:00~11:30',
      '11:30~12:00',
      '14:00~14:30',
      '14:30~15:00',
      '15:00~15:30',
      '15:30~16:00',
      '16:00~16:30',
      '16:30~17:00',
      '17:00~17:30',
      '17:30~18:00'
    ],
    tabKey: '2',
    userTags: []
  }

  handleSubmit = () => {
    const { tabKey } = this.state
    const { key, orderno } =  this.props.history.location.query
    this.props.form.validateFields((err, values) => {
      if (!err) {
         if ( key == 10 || key == 1 ) {
            if ( tabKey == '1') { //立即预约
              this.props.onReserveOrder(values)
            } else if(tabKey == '2') {
              this.props.onFollowOrder(values)
            } else if (tabKey == '3' ) {
              this.props.onCloseOrder(values)
            }
         } else if ( key == 2 ){
            if ( tabKey == '1') {
              this.props.onArrivalsOrder(values)
            } else if(tabKey == '2') {
              this.props.onTurnFollowUpOrder(values)
            } else if (tabKey == '3' ) {
              const { orderdetail } = this.props
              this.props.onUpdateReserveOrder({...values,clinicid:orderdetail.clinicid})
            }
         } else if ( key == 3 ){
          if ( tabKey == '1') {
            values.debtamt = (values.receivablesamt - values.amount)*100
            values.receivablesamt = values.receivablesamt *100
            values.amount = values.amount *100
            this.props.onTransActionOrder(values)
          } else if(tabKey == '2') {
            this.props.onTurnFollowUpOrder(values)
          }
       }

      }
    })
  }
  callback = (key) => {
    this.setState({
      tabKey:key
    })
  }

  handleGoBack = () => {
    this.props.history.goBack()
  }

  renderDom = () => {
    const { key } =  this.props.history.location.query

    if ( key == 10 || key == 1) {
      return <Tabsa {...this.props} callback={this.callback}/>
    } else if ( key == 2 ) {
      return <Tabsb {...this.props} callback={this.callback}/>
    } else if ( key == 3 ) {
      return <Tabsc {...this.props} callback={this.callback}/>
    }
  }

  // 拨打电话
  handleMakeCall = (orderdetail) => {
    this.props.clearCurrentCallInfo()
    this.props.onBindCallPhone(orderdetail)
  }

  //添加、编辑客户标签
  handleLabels = (record) => {
    userLabes = []
    const { lablenames } = record
    // userLabes = userLabes.concat(lablenames.split(','))

    if (lablenames != null) {
      this.setState({
        userTags: lablenames.split(',')
      });
    }

    userid = record.userid
    this.setState({
      visible: true,
    });
  }

  handleOk = e => {
    const { userTags } = this.state
    console.log(userTags)
    console.log(userLabes)
    return false
    this.setState({
      visible: false,
    });
    if (userLabes.length > 0) {
      this.props.onChangeLabels({
        labels: userLabes.join(','),
        userid: userid
      })
    }
    userLabes = []
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

   onChangeLaels = (e, index) => {
     console.log(e)
     userLabes[index+'_ind'] = e
     console.log(userLabes)
     return false
     userLabes = userLabes.concat(e)
     userLabes = Array.from(new Set(userLabes))
   }

  render() {
    const { orderdetail,loading, customerTagsList } = this.props
    const { user } = orderdetail
    const { userTags } = this.state
    return (
      <div className={styles.handleworktaskPage}>
        <div className={styles.worktaskinfo}>
        <Card title="用户信息" style={{ marginBottom: 24 }} bordered={false}
           extra={
            <div>
                <Button style={{ marginLeft: 8 }} htmlType="submit" onClick={this.handleGoBack}>返回</Button>
            </div>
          }
        >
          <Row>
                  <Col span={24}>
                    <Col span={6}>
                      <Form.Item label='客户姓名:' {...formItemLayout}>
                        <span className={mixin.lightHeight}>{ user && user.name ? user.name : ''}</span>
                      </Form.Item>
                    </Col>
                  <Col span={6} >
                     <Form.Item label='电话号码:' {...formItemLayout}>
                       <span className={mixin.lightHeight}>{ user && user.phone ? user.phone : ''}</span>
                       <Button style={{ marginLeft: 10 }} size="small" type="primary" onClick={e => this.handleMakeCall(orderdetail)}><Icon type="phone" /></Button>
                     </Form.Item>
                  </Col>
                 <Col span={6} >
                      <Form.Item label='性别:' {...formItemLayout}>
                      { user && user.sex ?
                        <span>
                          {user.sex ===1 ? '男' : '' }
                          {user.sex ===2 ? '女' : '' }
                          {user.sex ===3 || null ? '未知' : '' }
                        </span>
                     : ''}
                     </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='年龄:  ' {...formItemLayout}>
                      { user && user.age ? user.age : ''}
                     </Form.Item>
                  </Col>
                  <Col span={6} >
                     <Form.Item label='所在省市：' {...formItemLayout}>
                     { user && user.province ? user.province : ''} / { user && user.city ? user.city : ''}
                     </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='来源：' {...formItemLayout}>
                      { user && user.sourcename ? user.sourcename : ''} -
                      { user && user.sourcename2 ? user.sourcename2 : ''}
                     </Form.Item>
                  </Col>
                 <Col span={6} >
                     <Form.Item label='来源日期：' {...formItemLayout}>
                     { user && user.sourcedate ? user.sourcedate : ''}
                     </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='客户标签：' {...formItemLayout}>
                      <span style={{marginRight:20}}>{user && user.lablenames ? user.lablenames : ''}</span>
                      {
                          user && user.lablenames ?
                         <Button size="small" type="primary" onClick={e => this.handleLabels(user)}>
                         <Icon type="edit" theme="twoTone" /></Button> :
                         <Button size="small" type="primary" onClick={e => this.handleLabels(user)}>
                         <Icon type="plus-circle" theme="twoTone" /></Button>
                       }
                      </Form.Item>
                   </Col>
              </Col>
          </Row>
        </Card>
        <Card title="工单信息" style={{ marginBottom: 24 }} bordered={false}>
          <Row>
              <Col span={24}>
              <Col span={6} >
                        <Form.Item label='工单号:' {...formItemLayout}>
                        { orderdetail && orderdetail.orderno ? orderdetail.orderno : ''}
                        </Form.Item>
                  </Col>
                 <Col span={6} >
                      <Form.Item label='所属门诊:' {...formItemLayout}>
                          { orderdetail && orderdetail.clinicname ? orderdetail.clinicname : ''}
                      </Form.Item>
                  </Col>
                   <Col span={6} >
                     <Form.Item label='所属医生：' {...formItemLayout}>
                     { orderdetail && orderdetail.doctorname ? orderdetail.doctorname : ''}
                      </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='预约项目：' {...formItemLayout}>
                      { orderdetail && orderdetail.project ? orderdetail.project : ''}
                      </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='预约日期:' {...formItemLayout}>
                      { orderdetail && orderdetail.reservedate ? orderdetail.reservedate : ''}
                      </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='预约时间:' {...formItemLayout}>
                      { orderdetail && orderdetail.reservetime ? orderdetail.reservetime : ''}
                      </Form.Item>
                  </Col>
                   <Col span={6} >
                      <Form.Item label='跟进人员:' {...formItemLayout}>
                      { orderdetail && orderdetail.adminname ? orderdetail.adminname : ''}
                      </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='意愿等级:' {...formItemLayout}>
                          { orderdetail && orderdetail.level ? orderdetail.level : ''}
                      </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='计划回访日期:' {...formItemLayout}>
                          { orderdetail && orderdetail.returndate ? orderdetail.returndate : ''}
                      </Form.Item>
                  </Col>
                   <Col span={24} >
                      <Form.Item label='主诉:' {...formItemLayout}>
                      { orderdetail && orderdetail.complaint ? orderdetail.complaint : ''}
                      </Form.Item>
                  </Col>
                   <Col span={24} >
                      <Form.Item label='备注:' {...formItemLayout}>
                      { orderdetail && orderdetail.worknotes ? orderdetail.worknotes : ''}
                      </Form.Item>
                  </Col>
              </Col>
          </Row>
        </Card>
        </div>
        <Card title="处理工单" style={{ marginBottom: 24 }} bordered={false} >
          <Form
            className="ant-advanced-search-form"
            layout='vertical'
          >
            { this.renderDom() }
          </Form>
          <Button type="primary" onClick={this.handleSubmit}>立即处理</Button>
        </Card>

        <Card title="流程进度" style={{ marginBottom: 24 }} bordered={false} >
          <Timeline>
              {orderdetail.records ? orderdetail.records.map((item,index)=>(
                  <Timeline.Item key={index}>
                      <p>{item.time}</p>
                      <p>{item.name}</p>
                      <span>{item.content ? item.content : ''} : </span>
                      {
                        item.remark ? item.remark : ''
                      }
                      {
                        item.content == '微信聊天' && item.remark2 ?
                        <span><Button style={{ marginLeft: 20 }} htmlType="submit" onClick={e => this.handleChatDetail(item)}>查看</Button></span>
                         : ''
                      }
                      {
                        item.content == '通话' && item.remark == '通话成功' ?
                        <span><Button style={{ marginLeft: 20 }} htmlType="submit" onClick={e => this.handlePlayAudio(item)}>播放录音</Button></span>
                         : ''
                      }
                  </Timeline.Item>
              )):null}
          </Timeline>
          { orderdetail.records && orderdetail.records.length > 0 ? null : '暂无进度'}
        </Card>


        { loading ? <div className={styles.loadingBox}>
            <Spin tip="Loading..." size='large'/>
        </div> : null }

        { this.state.visible ?
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
                      <Checkbox.Group onChange={e => this.onChangeLaels(e, index)} key={index} defaultValue={userTags}>
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
            </Modal> : ''
        }

      </div>
    )
  }
}

export default Form.create({ name: 'Accountmanagement_Handleworktask' })(Handleworktask)
