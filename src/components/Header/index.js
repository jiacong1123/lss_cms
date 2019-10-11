/* global window */
/* global document */
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import withRouter from 'umi/withRouter'
import router from 'umi/router'
import store from 'store'
import { BackTop, Layout, Icon ,Menu,Switch ,Avatar, Popover, Badge, List, Button, Modal, Input, message, notification  } from 'antd'
import moment from 'moment'
import { Ellipsis } from 'ant-design-pro'
import styles from './index.less'
import MyIcon from 'utils/icon.js'
import { parseTime } from 'utils/mm'

const {Header} = Layout;
const { SubMenu } = Menu
const confirm = Modal.confirm;


class ComHeader extends PureComponent {
  state = {
    visible: false,
    telphone: '',
    timer: null,
    showDot: true,
  }

  showPhone = e => {
    this.setState({
      visible: true,
      telphone: ''
    });
  }



  handleOk = e => {
    this.setState({
      visible: false,
      telphone: ''
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      telphone: ''
    });
  };

  onChangeSearch (key,e)  {
      // let myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      let myreg = /^1[3456789]\d{9}$/     //20190910改
      if ( e.target.value.length === 11) {
          if(myreg.test(e.target.value)){
            this.setState({ telphone: e.target.value });
            this.props.onJudgeUserIsExist({[key]:e.target.value})
          }else{
              message.error('手机号格式不正确')
          }
      }
  }

  // 拨打电话
  handleMakeCall = (e) => {
    const { telphone } = this.state
    if (telphone) {
      this.props.onBindCallPhone({ number: telphone, type: 'headerCall' })
      this.setState({ visible: false, telphone: '' })
    } else {
      message.error('请先输入手机号码')
    }
  }

  //查看客户回收通知
  recoveryCustomer = (e) => {
    router.push({
      pathname: '/worktaskmanagement/berecycled'
    })
  }

  //查看未接来电
  handleMissedCalls = (e) => {
    router.push({
      pathname: '/worktaskmanagement/missedcalls'
    })
  }

  //查看待回访列表
  handleReturnVisit = (e) => {
    router.push({
      pathname: '/worktaskmanagement/returnvisit'
    })
  }

  render() {
    const { collapsed, recoveryCustomerNum, missedCallNum, returnCount, reserveCount } = this.props
    const userinfo = store.get('userinfo')
    const totalCount = recoveryCustomerNum + missedCallNum + returnCount
    const rightContent = [
        <Menu key="user" mode="horizontal" onClick={this.handleClickMenu}>
            <SubMenu
            title={
                <Fragment>
                    <span style={{ color: '#999', marginRight: 4 }}>
                       你好，
                    </span>
                    <span>{ userinfo && userinfo.name ? userinfo.name : ''}</span>
                    <Avatar style={{ marginLeft: 8 }} src={ userinfo && userinfo.avatar ? userinfo.avatar : require('../../assets/timg.jpg')} />
                </Fragment>
            }
            >
                <Menu.Item key="UpdatePassword" onClick={this.props.showUpdatePasModal}>
                   修改密码
                </Menu.Item>
                <Menu.Item key="SignOut" onClick={this.props.onLogout}>
                    退出登录
                </Menu.Item>
            </SubMenu>
        </Menu>,
    ]

    rightContent.unshift(
        <div className={styles.disFlex}>
        <MyIcon className={styles.iconweixin1} type="icondianhua" onClick={e => this.showPhone()} title="拨号"/>

          <Popover
            placement="bottomRight"
            key="notifications"
            className={styles.notificationPopover}
            trigger="hover"
            content={
              <div>
              { recoveryCustomerNum && recoveryCustomerNum > 0 ?
                    <p className={styles.newList}>
                      <span className={styles.checkDetail}>客户回收通知：你有 <span className={styles.red}>{ recoveryCustomerNum }</span> 位客户即将回收</span>
                      <Button size="small" type="primary" onClick={this.recoveryCustomer} >查看</Button>
                    </p> : ''
              }
              { missedCallNum && missedCallNum > 0 ?
                      <p className={styles.newList}>
                        <span className={styles.checkDetail}>未接来电通知：你有 <span className={styles.red}>{ missedCallNum }</span> 个未接来电</span>
                        <Button size="small" type="primary" onClick={this.handleMissedCalls} >查看</Button>
                      </p> : ''
              }
              { returnCount && returnCount > 0 ?
                  <p className={styles.newList}>
                      <span className={styles.checkDetail}>回访提醒：你有 <span className={styles.red}>{ returnCount }</span> 个客户待回访</span>
                      <Button size="small" type="primary"  onClick={this.handleReturnVisit} >查看</Button>
                  </p>  : ''
              }
              </div>
            }
          >
            <Badge
              dot={ totalCount > 0 ? true : false }
              offset={[-10, 10]}
              className={styles.iconButton}
            >
              <Icon className={styles.iconFont} type="bell" />
            </Badge>
          </Popover>


        </div>
      )


    return (

      <div>
          <Header className={styles.globalHeader} style={{width: `calc(100% - ${collapsed ? 80 : 256 }px)`}}>
              <span className={styles.trigger} onClick={this.props.effectsToggle}>
                <Icon type={ collapsed ? 'menu-unfold' : 'menu-fold'} />
              </span>
              <div className={styles.rightContainer}>{rightContent}</div>
          </Header>
          { this.state.visible ?
                <Modal
                  title="拨打电话"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer = {false}
                >
                <div>
                  <Input placeholder="请输入联系电话"  onChange={this.onChangeSearch.bind(this,'phone')}/>
                  <span className={styles.phone}>
                    <MyIcon type="icondianhua" onClick={e => this.handleMakeCall()} title="拨号"/>
                  </span>
                </div>
              </Modal> : ''
           }



      </div>
    )
  }
}



export default ComHeader
