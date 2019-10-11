import React from 'react';
import { connect } from 'dva'
import { Row, Card, Col, Tabs, Avatar, Icon, Tag, Form, Input, Button } from 'antd'
import store from 'store'
import styles from './index.less'

const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}

const formItemLayout = {
  labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
  },
  wrapperCol: {
      xs: { span: 24 },
      sm: { span: 10 },
  },
}

const buttonItemLayout = {
  wrapperCol: { span: 14, offset: 4 },
}


@connect(({ usercenter }) => ({
  ...usercenter,
}))

class Usercenter extends React.Component {

  componentDidMount = () => {

  }

  render() {
    const userinfo = store.get('userinfo')
    return (
      <div className={styles.usercenterPage}>
        <Card bordered={false} className={styles.leftContent}>
            <div className={styles.header}>
              <Avatar size="large" style={{ backgroundColor: '#87d068' }} icon="user" />
            </div>
            {
              userinfo.name ? <div className={styles.name}>{userinfo.name}</div> : ''
            }

            <div className={styles.userCenter}>
              <p><Icon type="question-circle" />乐莎莎科技有限公司</p>
              <p><Icon type="environment" />广东省-深圳市-宝安区</p>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.userTag}>
              <div className={styles.title}>标签</div>
              <Tag>哈哈</Tag>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.userTeam}>
              <div className={styles.title}>团队</div>
              <Col span={6}><Avatar size="small" src='https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png' />乐莎莎科技-技术部-小王</Col>
              <Col span={6}><Avatar size="small" src='https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png' />乐莎莎科技-技术部-小李</Col>
              <Col span={6}><Avatar size="small" src='https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png' />乐莎莎科技-技术部-老王</Col>
            </div>
          </Card>
      </div>
    )
  }
}

export default Usercenter
