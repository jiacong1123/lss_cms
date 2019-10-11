import React from 'react';
import {
  Icon,
  Spin
} from 'antd'
import styles from './index.less'
import { wsMakeCallAth,wsMakeCallATA } from 'utils/mm'

let h = 0
let m = 0
let s = 0

let timer

class Callwindow extends React.Component {
  state = {
      callTime: '00:00:00',
      visible_callwindow: false,
  }
  callTime = () => {
    clearInterval(timer)
    timer = setInterval(() => {
        let hh = ''
        let mm = ''
        let ss = ''
        s+=1
        if(s===60){
            s=0
            m+=1
            if(m===60) {
                m=0
                h+=1
            }
        }
        if( s < 10 ) {
            ss = '0' + s
        } else {
            ss= s
        }
        if( m < 10 ) {
            mm = '0' + m
        } else {
            mm = m
        }
        if( hh < 10 ) {
            hh = '0' + h
        } else {
            hh = h
        }
        this.setState({
            callTime: `${hh}:${mm}:${ss}`
        })

        return `${hh}:${mm}:${ss}`

    }, 1000)
  }


  clearTimer = () => {
      h = 0
      m = 0
      s = 0
      clearInterval(timer)
  }

  // 挂断
  handleHangUp = () => {
    wsMakeCallAth()
  }

  // 大小窗口切换
  handleToogleCallWindow = () => {
      const { visible_callwindow } = this.state
      this.setState({
        visible_callwindow:  !visible_callwindow
      })
  }

  // 关闭打电话窗口
  handleCloseCallWindow = () => {
    wsMakeCallAth()
    this.props.onCloseCallWindow({
      visible_calltype: false
    })
  }

  // 重拨
  handleRedail = () => {
    this.props.onBindCallPhone()
  }

  // 接听
  handleAnswerCall =  ()=> {
     wsMakeCallATA()
  }

  render() {
    const { visible_calltype_ATD,visible_calltype_CBEGIN,visible_calltype_CEND ,visible_calltype_CALLING, currentCallInfo, loading, unKnownCall} = this.props
    const { visible_callwindow,callTime  }  = this.state
    { visible_calltype_CBEGIN ? this.callTime() : this.clearTimer()}
    const {user} = currentCallInfo
    return (
        <div>
            { !visible_callwindow ? <div className={styles.callWindowBox}>
                <div className={styles.callInfo}>
                  { Object.keys(currentCallInfo).length > 0  ?
                    <div><span>{currentCallInfo.name || user.name}</span> {currentCallInfo.phone || user.phone}</div> :
                    <div>陌生号码 {unKnownCall.number}</div>
                  }

                </div>
                { visible_calltype_ATD ? <div className={styles.isCall}>正在呼叫...</div> : ''}
                { visible_calltype_CEND ? <div className={styles.callOver}>通话结束</div> : ''}
                { visible_calltype_CBEGIN ?<div className={styles.time}> { callTime } </div> : ''}
                { visible_calltype_CALLING ? <span className={styles.AnswerCall} onClick={ () => this.handleAnswerCall()}>接听</span> : ''}
                { visible_calltype_CEND && !visible_calltype_CALLING ?
                    <span className={styles.Redail} onClick={ () => this.handleRedail()}>重拨</span>  :
                    <span className={styles.hangUpBtn} onClick={ () => this.handleHangUp()}>挂断</span>
                }
                <Icon type="minus" className={styles.minus} onClick={() => this.handleToogleCallWindow() }/>
                <Icon type="close" className={styles.close} onClick={ () => this.handleCloseCallWindow()}/>
            </div> : <div className={styles.smallWindowBox}>
                <div className={styles.callInfo}>
                    <span className={styles.phoneIcon}><Icon type="phone" /></span>
                    { Object.keys(currentCallInfo).length > 0 ? <span>{currentCallInfo.phone || user.phone}</span> : <span>{unKnownCall.number}</span>}
                    { visible_calltype_ATD ? <span className={styles.isCall}>正在呼叫...</span> : ''}
                    { visible_calltype_CEND ? <span className={styles.callOver}>通话结束</span> : ''}
                    { visible_calltype_CBEGIN ?<span className={styles.time}> { callTime } </span> : ''}
                    { visible_calltype_CALLING ? <span className={styles.AnswerCall} onClick={ () => this.handleAnswerCall()}>接听</span> : ''}
                    { visible_calltype_CEND && !visible_calltype_CALLING ?
                      <span className={styles.Redail} onClick={ () => this.handleRedail()}>重拨</span> :
                      <span className={styles.hangUpBtn} onClick={ () => this.handleHangUp()}>挂断</span>
                    }
                </div>
                <Icon type="border" className={styles.minus} onClick={() => this.handleToogleCallWindow() }/>
                <Icon type="close" className={styles.close} onClick={ () => this.handleCloseCallWindow()} />
            </div>}
        </div>

    )
  }
}

export default Callwindow
