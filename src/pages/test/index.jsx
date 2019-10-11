import React from 'react';
import { connect } from 'dva'
import withRouter from 'umi/withRouter';
import styles from './index.less'

const namespace = 'test'

@connect(({test}) => ({
  ...test,
}))

class Test extends React.Component {

  componentDidMount = () => {
 
  }
 
  render() {
    return (
      <div className={styles.testPage}>
        test
      </div>
    )
  }
}

export default Test
