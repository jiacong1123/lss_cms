import React from 'react';
import { BackTop, Layout, Icon ,Menu,Switch ,Avatar, Popover, Badge, List, Button, Modal, Input, message, notification  } from 'antd'
import styles from './index.less'
import router from 'umi/router'

class MessageBox extends React.Component {
  state = {
    timer: null
  }

  componentDidMount() {
    this.props.getReserveCount()
    this.state.timer = setInterval(()=>{
      this.props.getReserveCount()
    }, 1200000)
  }
    //销毁
  componentWillUnmount() {
      if(this.state.timer!= null) {
        clearInterval(this.state.timer);
      }
  }


  showMessageBox = e => {
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

  render() {
    const { reserveCount } = this.props
    return (
        <div>
        {
            reserveCount && reserveCount > 0 ? this.showMessageBox(reserveCount) : ''
        }
        </div>

    )
  }
}

export default MessageBox
