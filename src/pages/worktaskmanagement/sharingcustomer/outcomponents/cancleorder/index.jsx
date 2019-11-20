import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon, Button} from 'antd';
import moment from 'moment'
import city from 'utils/city'
import PropTypes from 'prop-types'
import styles from './index.less'

const formItemLayout = {
    labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 15 },
        sm: { span: 15 },
    },
}


const Option = Select.Option;

class ComBatch extends React.Component {
  state ={

  }

    render() {
        const { selectedList } = this.props
        return (
            <div className={styles.save}>
              <p>已选择</p>
              <div className={styles.list}>
                { selectedList ? selectedList.map( (item,index) => {
                    return <span>{item.name}</span>
                  }) : ''

                }
              </div>
        </div>
        )
    }
}


export default ComBatch
