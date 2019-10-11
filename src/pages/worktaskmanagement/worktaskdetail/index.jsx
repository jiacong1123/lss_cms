import React, {Fragment}from 'react';
import {
  Steps,
  Card,
  Popover ,
  Badge,
  Icon,
  Button,
  Row,Col,
  Spin,
  Timeline,
  Form,
  Modal,
  Radio,
  Table
} from 'antd'
import { connect } from 'dva'
import classNames from 'classnames';
import withRouter from 'umi/withRouter';
import { _mmAction, _mmTimeToStamp, _mmAddressSplit} from 'utils/mm'
import styles from './index.less'
import mixin from 'themes/mixin.less'
import store from 'store'
import Audio from './audio'
import { parseTime } from 'utils/mm'

const namespace = 'worktaskdetail'


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
const { Step } = Steps;
const popoverContent = (
  <div style={{ width: 160 }}>
    吴加号
    <span className={styles.textSecondary} style={{ float: 'right' }}>
      <Badge status="default" text={<span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>未响应</span>} />
    </span>
    <div className={styles.textSecondary} style={{ marginTop: 4 }}>
      耗时：2小时25分钟
    </div>
  </div>
);
const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
    dot
  );
@connect(({worktaskmanagement,worktaskdetail}) => ({
  ...worktaskmanagement,
  ...worktaskdetail,
}),(dispatch)=>({
  // 播放录音
  onPlayAduio(payload) {
    dispatch(
      _mmAction(
        `${namespace}/effectsPlayAduio`,
        payload
      )
    )
  },
  // 暂停录音
  onPasueAudio(payload) {
    dispatch(
      _mmAction(
        `${namespace}/effectsPauseAudio`,
        payload
      )
    )
  },
  onCloseAudio(payload){
    dispatch(
      _mmAction(
        `${namespace}/effectsCloseAudio`,
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
  // 获取所有标签
  onGetTags(payload) {
    dispatch(
      _mmAction(
        `layout/EFFECTS_GET_TAGS`,
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
  getPaymentRecords(payload) {
    dispatch(
      _mmAction(
        `${namespace}/EFFECTS_PAYMENTRECORDS`,
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

class Worktaskdetail extends React.Component {
  componentDidMount () {
    const params = this.props.history.location.query
    let paramsType = params.type
    this.props.getOrderDetails(params)
    this.props.onGetTags({type:7})
    if (paramsType && paramsType == 'alreadydeal') {
      this.props.getPaymentRecords(params)
    }

  }

  state = {
    visible: false,
  }

  handleGoBack = () => {
    this.props.history.goBack()
  }

  //查看聊天记录
  handleChatDetail = (item) => {
    let record = JSON.parse(item.remark2)
    // console.log(record)
     let guidMember = store.get('guidMember')
     let host = window.location.host
      // let url = `${host}/im-web/login?token=${guidMember.token}&wxId=${record.shopWx}&code=${record.code}&memberNoGm=${record.memberNoGm}&memberNo=${record.memberNo}`
     let url = `http://192.168.3.3/im-web/login?token=${guidMember.token}&wxId=${record.shopWx}&code=${record.code}&memberNoGm=${record.memberNoGm}&memberNo=${record.memberNo}`
     window.open(url)
  }

  // 录音播放
  handlePlayAudio = (payload) => {
    this.props.onPlayAduio(payload)
        console.log(this.props)
  }

  // 暂停
  handlePauseAudio = (payload)=> {
    this.props.onPasueAudio(payload)
  }

  // 拨打电话
  handleMakeCall = (orderdetail) => {
    this.props.clearCurrentCallInfo()
    this.props.onBindCallPhone(orderdetail)
  }

  render() {
    const columns = [
        {
          title: '收费时间',
          dataIndex: 'payTime',
          width: 200,
          render: (text, record) => {
            const { payTime } = record
            return (
              <p>{ parseTime(payTime) }</p>
            )
          }

        },
        {
          title: '收费金额',
          dataIndex: 'amount',
          width: 200,
          render: (text, record) => {
            const { amount } = record
            return (
              <p>{ amount / 100 }</p>
            )
          }
        },
        {
          title: '登记时间',
          width: 200,
          dataIndex: 'createDate',
          render: (text, record) => {
            const { createDate, lableremarks } = record
            return (
              <p>{parseTime(createDate)}</p>
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 300
        },
    ]
    const { recordUrl, playing, customerTagsList, paymentRecords } = this.props
    const { loading , orderdetail } = this.props
    const { user } = orderdetail
    return (
      <div className={styles.worktaskdetailPage}>
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
                      { user && user.sourcename ? user.sourcename : ''}-
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
                          { orderdetail && orderdetail.returndate ? parseTime(orderdetail.returndate) : ''}
                      </Form.Item>
                  </Col>
                  <Col span={6} >
                      <Form.Item label='最近联系：' {...formItemLayout}>
                      {
                        orderdetail && orderdetail.followuptime ?
                        <span style={{marginRight:20}}>{parseTime(orderdetail.followuptime)}</span> : ''
                      }
                      {
                        orderdetail && orderdetail.followupremarks ?
                        <span>{orderdetail.followupremarks}</span> : ''
                      }
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
        { Object.keys(paymentRecords).length > 0 && paymentRecords[0].orderno == orderdetail.orderno  ?
          <Card title="缴费明细" style={{ marginBottom: 24 }} bordered={false} >

            { orderdetail ? <p className={styles.payDetail}><span>应收金额：</span><span className={styles.payAmount}>{ (orderdetail.receivablesamt)/100 }</span>
                            <span style={{ marginLeft: 40 }}>实收金额：</span><span className={styles.payAmount}>{ (orderdetail.amount)/100 }</span></p> :
                            <p><span>应收金额：</span><span className={styles.payAmount}>0.00</span>
                            <span style={{ marginLeft: 40 }}>实收金额：</span><span className={styles.payAmount}>0.00</span></p>
            }

            { Object.keys(paymentRecords).length > 0 ?
              <Table
                 columns={columns}
                 dataSource={paymentRecords}
                 bordered
                 scroll={{ y: 240 }}
                 loading={loading}
                 pagination= { false }
              /> : ''
            }
          </Card> : ''
        }
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

        { recordUrl ? <Audio {...this.props}></Audio> : '' }

      </div>
    )
  }
}

export default Worktaskdetail
