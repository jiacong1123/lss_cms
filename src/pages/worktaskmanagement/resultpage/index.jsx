import React from 'react';
import { connect } from 'dva'
import Result from 'ant-design-pro/lib/Result';
import { Button, Row, Col, Icon,Spin,Timeline } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.min.css';
import styles from './index.less'



const namespace = 'resultpage'

@connect(({layout,worktaskmanagement,resultpage}) => ({
  ...layout,
  ...worktaskmanagement,
  ...resultpage,
}))

class Resultpage extends React.Component {

  handleGoBack = () => {
    const { selectedKeys } = this.props
    this.props.history.push(selectedKeys[0])
  }
 
  render() {
    const { loading, orderdetail } = this.props
    return (
      <div className={styles.resultpagePage}>
         <Result
          type="success"
          title="处理完成"
          extra={
            <div>
              <Row style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>工单号：</span>
                  { orderdetail ? orderdetail.orderno : null }
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>所属人员: </span>
                  { orderdetail ? orderdetail.adminname: null}
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                  <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>创建时间：</span>
                 { orderdetail ? orderdetail.createtime: null}
                </Col>
              </Row>
              <br />
              <Timeline>
                { orderdetail && orderdetail.records ? orderdetail.records.map((item,index)=>(
                    <Timeline.Item key={index}>
                        <p>{item.time}</p>
                        <p>{item.name}</p>
                        <span>{item.content}</span>
                    </Timeline.Item>
                )):null}
              </Timeline>
            </div>
          }
          actions={
            <Button type="primary" onClick={this.handleGoBack}>返回列表</Button>
          }
          style={{ width: '100%' }}
        />
        { loading ? <div className={styles.loadingBox}>
            <Spin tip="Loading..." size='large'/>
        </div> : null }
      </div>
    )
  }
}

export default Resultpage
