import React from 'react'
import { connect } from 'dva'
import withRouter from 'umi/withRouter'
import { message,LocaleProvider } from 'antd'
import router from 'umi/router';
import Redirect from 'umi/redirect'
import store from 'store'
import { Layout } from 'antd'
import styles from './index.less'
import * as MyLayout from 'components'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import UpdatePassword from './components/updatepassword'
import { _mmAction } from 'utils/mm'
import Callwindow from './components/callwindow'


const namespace = "layout"
const { Content, Footer } = Layout;
const { ComSider, ComHeader, Breadcrumbs, MessageBox } = MyLayout

@connect(
  ({ app, loading, layout }) => ({ app, loading, ...layout }),
  (dispatch)=>({
     onUpdateSiderKeys(payload){
        dispatch(
          _mmAction(
            `${namespace}/UPDATE_SIDERKEYS`,
            payload
          )
        )
     },
     onLogout(payload){
      dispatch(
        _mmAction(
          `app/EFFECTS_LOGOUT`,
        )
      )
     },
     onUpdatePassword(payload){
      dispatch(
        _mmAction(
          `${namespace}/EFFECTS_UPDATE_PASSWORD`,
          payload
        )
      )
     },
     onIsShowModal(payload) {
      dispatch(
        _mmAction(
          `${namespace}/IS_SHOWMODAL`,
          payload
        )
      )
    },
    onCloseCallWindow(payload) {
      dispatch(
        _mmAction(
          `${namespace}/EFFECTS_SET_CALLTYPE`,
          payload
        )
      )
    },
    // 绑定外呼号码并拨号
    onBindCallPhone(payload) {
      dispatch(
        _mmAction(
          `${namespace}/EFFECTS_BINDCALLPHONE`,
          payload
        )
      )
    },
    onJudgeUserIsExist(payload){
      dispatch(
        _mmAction(
          `${namespace}/EFFECTS_JUDGE_USERISEXIST`,
          payload
        )
      )
    },
    //获取预约回访提醒
    getReserveCount(payload){
      dispatch(
        _mmAction(
          `${namespace}/EFFECTS_GET_RESERVECOUNT`,
          payload
        )
      )
    },
    //清空预约提醒数量
    clearReserveCount(payload){
      dispatch(
        _mmAction(
          `${namespace}/EFFECTS_CLEAR_RESERVECOUNT`,
          payload
        )
      )
    },
    //待回访数量
    getReturnCount(payload){
      dispatch(
        _mmAction(
          `${namespace}/EFFECTS_RETURNCOUNT`,
          payload
        )
      )
    },
    //清空回访数量
    clearReturnCount(payload){
      dispatch(
        _mmAction(
          `${namespace}/EFFECTS_CLEAR_RETURNCOUNT`,
          payload
        )
      )
    }


  })
)

class BasicLayout extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
       window.scrollTo(0, 0);
    }
  }

  // 弹出修改密码
  showUpdatePasModal = () => {
    this.props.onIsShowModal({
      visible:true,
      title: '修改密码',
    })
  }

  // 确认修改
  handleOk = (values) => {
    this.props.onUpdatePassword(values)
  }

  render() {
    const isLogin = store.get('isLogin')
    const { children, location , visible_calltype } = this.props
    if (location.pathname === '/login' && !isLogin) {
      return <div >{children}</div>
    }
    if (!isLogin) {
      return <Redirect to='/login' replace/>
    }
    if (location.pathname === '/login' && isLogin) {
      const targetpathname = store.get('targetpathname')
      router.push(targetpathname ? targetpathname : '/')
    }
    return (
      <LocaleProvider locale={zhCN}>
        <Layout>
          <ComSider {...this.props}></ComSider>
          <Layout>
            <div className={styles.container}>
              <ComHeader {...this.props} showUpdatePasModal={this.showUpdatePasModal}></ComHeader>
              <Breadcrumbs {...this.props} />
              <Content className={styles.mainContent}>
                {this.props.children}
              </Content>
              <UpdatePassword {...this.props} handleOk={this.handleOk}/>
              <MessageBox {...this.props}></MessageBox>
              { visible_calltype ? <Callwindow {...this.props}></Callwindow> : '' }
            </div>
          </Layout>
        </Layout>
      </LocaleProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    collapsed: state[namespace].collapsed,
    menulist: state['app'].menulist,
    theme: state[namespace].theme
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    effectsToggle() {
      dispatch({
        type: `${namespace}/EFFECTS_TOGGLE`
      })
    },
    effectsSwitchTheme(dark) {
      dispatch({
        type: `${namespace}/EFFECTS_SWITCH_THEME`,
        payload: dark
      })
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BasicLayout))
