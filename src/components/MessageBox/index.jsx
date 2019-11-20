import React from 'react';
import { BackTop, Layout, Icon ,Menu,Switch ,Avatar, Popover, Badge, List, Button, Modal, Input, message, notification  } from 'antd'
import styles from './index.less'
import router from 'umi/router'

class MessageBox extends React.Component {
  state = {
    timer: null,
    interval: null
  }

  componentDidMount() {
    this.props.getReserveCount()
    this.state.timer = setInterval(()=>{
      this.props.getReserveCount()
    }, 1200000)

    this.props.getReturnCount()
    //10分钟轮训一次回访提醒
    this.state.interval = setInterval(()=>{
      this.props.getReturnCount()
    }, 600000)
  }
    //销毁
  componentWillUnmount() {
      if(this.state.timer != null) {
        clearInterval(this.state.timer);
      }
      if(this.state.interval != null) {
        clearInterval(this.state.interval);
      }
  }

  //查看预约
  reserveMessageBox = e => {
    const { reserveCount } = this.props
    if (reserveCount && reserveCount > 0) {

      //显示预约提醒弹窗
      const btn = (
        <Button type="primary" size="small" onClick={e => this.handleAlreadySeserved()}>
          查看
        </Button>
      )
      const key = 'updatable'
      notification.open({
        message: '预约提醒',
        description: '你有'+ e +'个客户预约时间临近，请注意跟进！',
        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
        duration: null,
        top:75,
        onClose: this.closeMessageBox,
        btn,
        key
      })
    }
  }

  closeMessageBox = e => {
     this.props.clearReserveCount()
  }

  handleAlreadySeserved = e => {
    this.props.clearReserveCount()
    notification.destroy()
    router.push({
      pathname: '/worktaskmanagement/alreadyreserved',
      query: {  type: 'checkAlreadyReserved' }
    })
  }

  //查看回访
  returnMessageBox = e => {
    const { returnCount } = this.props
    if (returnCount && returnCount > 0) {

      //显示回访提醒弹窗
      const btn = (
        <Button type="primary" size="small" onClick={e => this.handleReturnVisit()}>
          查看
        </Button>
      )
      const key = 'updatableReturn'
      notification.open({
        message: '回访提醒',
        description: '你有'+ e +'个客户回访时间临近，请注意跟进！',
        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
        duration: null,
        top:75,
        onClose: this.closeReturnBox,
        btn,
        key
      })
    }
  }

  handleReturnVisit = e => {
    this.closeReturnBox()
    this.props.clearReturnCount() //前端清空props缓存的returnCount
    notification.destroy()
    router.push({
      pathname: '/worktaskmanagement/returnvisit',
      query: {}
    })
  }

  closeReturnBox = e => {
    console.log(e);
  }



  render() {
    const { reserveCount, returnCount } = this.props
    return (
        <div>
        {
            reserveCount && reserveCount > 0 ? this.reserveMessageBox(reserveCount) : ''
        }

        {
            returnCount && returnCount > 0 ? this.returnMessageBox(returnCount) : ''
        }
        </div>

    )
  }
}

export default MessageBox
