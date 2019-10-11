import React from 'react';
import { connect } from 'dva'
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
  Form
} from 'antd'
import withRouter from 'umi/withRouter';
import styles from './index.less'

const namespace = 'orderdetail'
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

@connect(({orderdetail}) => ({
  ...orderdetail,
}))

class Orderdetail extends React.Component {

  handleGoBack = () => {
    this.props.history.goBack()
  }

  render() {
    const { orderdetail } = this.props
    return (
      <div className={styles.orderdetailPage}>
        <Card title="订单信息" style={{ marginBottom: 24 }} bordered={false} 
           extra={
            <div>
                <Button style={{ marginLeft: 8 }} htmlType="submit" onClick={this.handleGoBack}>返回</Button>
            </div>
          }
        >
          <Row>
                  <Col span={24}>
                  { orderdetail && orderdetail.orderno ? <Col span={8}>
                     <Form.Item label='订单编号: ' {...formItemLayout}>
                       { orderdetail.orderno } 
                     </Form.Item>
                  </Col> : null }
                  { orderdetail && orderdetail.title ? <Col span={8} >
                     <Form.Item label='产品名称:' {...formItemLayout}>
                       { orderdetail.title } 
                     </Form.Item>
                  </Col> : null }
                  { orderdetail && orderdetail.price ? <Col span={8} >
                      <Form.Item label='产品价格:' {...formItemLayout}>
                      { orderdetail.price === 1 ? '男': '女'} 
                     </Form.Item>
                  </Col> : null }
                  { orderdetail &&  orderdetail.createtime ? <Col span={8} >
                      <Form.Item label='创建时间:' {...formItemLayout}>
                      { orderdetail.createtime }
                     </Form.Item>
                  </Col> : null }
                  { orderdetail && orderdetail.paytime ? <Col span={8} >
                     <Form.Item label='支付时间：' {...formItemLayout}>
                     { orderdetail.paytime } 
                     </Form.Item>
                  </Col> : null }
                  { orderdetail && orderdetail.phone ? <Col span={8} >
                      <Form.Item label='电话：' {...formItemLayout}>
                      { orderdetail.phone }
                     </Form.Item>
                  </Col> : null }
                  { orderdetail && orderdetail.name ? <Col span={8} >
                     <Form.Item label='名称：' {...formItemLayout}>
                      { orderdetail.name }
                     </Form.Item>
                  </Col> : null }
                  { orderdetail && orderdetail.paytype ? <Col span={8} >
                     <Form.Item label='支付类型: ' {...formItemLayout}>
                      { orderdetail.paytype === 1 ? '微信支付' : '银行转账'}
                     </Form.Item>
                  </Col> : null }
                  { orderdetail && orderdetail.status ? <Col span={8} >
                     <Form.Item label='状态: ' {...formItemLayout}>
                      { orderdetail.status === 0 ? <Badge status="error" text="未支付" /> : <Badge status="success" text="已支付" /> }
                     </Form.Item>
                  </Col> : null }
              </Col>
          </Row>
        </Card>
      </div>
    )
  }
}

export default Orderdetail
