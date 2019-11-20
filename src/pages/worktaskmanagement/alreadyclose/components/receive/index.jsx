import React from 'react'
import {  Form, Row, Col, Input, Select, Radio, Cascader, DatePicker ,message, Upload, Icon} from 'antd';
import moment from 'moment'
import city from 'utils/city'
import PropTypes from 'prop-types'
import styles from './index.less'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
}


const Option = Select.Option;

class ComReceive extends React.Component {
    render() {
        return (
            <div className={styles.save}>
              <span>是否批量领取已选择的公海客户?</span>
            </div>
        )
    }
}


export default ComReceive
