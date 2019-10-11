import React from 'react'
import { Row, Col, Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import styles from './index.less'


const FormItem = Form.Item;

class Login extends React.Component {

    componentDidMount(){
        //为全局添加回车事件
        document.body.addEventListener('keydown', this.handleEnterKey,false);

    }

    componentWillUnmount(){
        //为全局卸载回车事件
        document.body.removeEventListener('keydown',this.handleEnterKey)
    }

    //提交登陆
    handleSubmit = () => {
        this.props.form.validateFields((err,values)=>{
            if (!err) {
                this.props.effectsLogin(values)
                console.log(values)
            }
        })
    }

    //回车事件
    handleEnterKey = (e) => {
        if(e.keyCode === 13){
            this.handleSubmit()
        }
    }


    render() {
        const { imgcode, UpdateImgCode } = this.props
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="ant-advanced-search-form" layout='vertical'>
                <Row className={styles.login}>
                    <Col span={5} className={styles.loginLeft}>
                        <div className={styles.content}>
                            <img alt="" src={require('./images/images_1.png')} />
                            <img alt="" src={require('./images/logo.png')} className={styles.logo} />
                            <p>中国"互联网+口腔"领跑品牌</p>
                        </div>
                    </Col>
                    <Col span={19} className={styles.loginRight}>
                        <div className={styles.content}>
                            <img alt="" src={require('./images/logo.png')} className={styles.logo} />
                            <p>登录</p>
                            <FormItem>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入账号' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入账号" size="large"/>
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" size="large"/>
                                )}
                            </FormItem>
                            <Row>
                                <Col span={17}>
                                    <FormItem>
                                        {getFieldDecorator('code', {
                                            rules: [{ required: true, message: '请输入验证码' }],
                                        })(
                                            <Input placeholder="请输入验证码" size="large"/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={1}></Col>
                                <Col span={6}>
                                    <img src={imgcode} onClick={UpdateImgCode} style={{width:"100%",height:40,borderRadius:4}}/>
                                </Col>
                            </Row>
                            <Checkbox>记住密码</Checkbox><br /><br />
                            <Button type="primary" size="large" onClick={this.handleSubmit}>立即登录<Icon type="caret-right" /></Button>
                        </div>
                    </Col>
                </Row>
            </Form>
         )
    }

}

const mapStateToProps = (state) => {
    return {
        imgcode: state['login'].imgcode
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        UpdateImgCode: () => {
            dispatch({
                type:'login/UPDATE_IMG_CODE'
            })
        },
        effectsLogin: (values) => {
            dispatch({
                type: 'app/EFFECTS_LOGIN',
                payload: values
            })
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login)))
