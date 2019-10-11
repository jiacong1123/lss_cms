import React from 'react'
import {  Form, Row, Col, Input, Select, Radio,Table, Cascader, DatePicker ,message, Upload, Icon,ConfigProvider} from 'antd';
import moment from 'moment'
import city from 'utils/city'
import PropTypes from 'prop-types'
import styles from './index.less'

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 16},
        sm: { span: 16 },
    },
}


const formItemLayout1 = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24},
        sm: { span: 20 },
    },
}

const Option = Select.Option;
const RadioGroup = Radio.Group
const { TextArea } = Input;
const Search = Input.Search;

class ComDisClue extends React.Component {

    state = {
        loading: false,
        imageUrl:null
    }

    render() {
        const { usertype,servicelist,reservedpro, loading,times } = this.props
        const { getFieldDecorator } = this.props.form
        const { pagination , currentPage} = this.state
        const columns =  [
            {
              title: '序号',
              key: 'num',
              render: (text, record,index) => {
                return (<span>{index+1}</span>)
              }
            },
            {
                title: '诊所名称',
                dataIndex: 'clinicName',
            }, {
                title: '服务名称',
                dataIndex: 'serverName',
            }, {
                title: '服务类型',
                dataIndex: 'serviceTypeName',
            },
            {
                title: '可用次数',
                dataIndex: 'unuserNum',
            },
            {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 60,
                render: (text, record) => {
                  return (<Button type="primary" size="small" onClick={e => this.confirmDispatch(record)}>确认派单</Button>)
                }
              }
        ]
        
        return (
            <div className={styles.save}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Search
                      placeholder="诊所名称"
                      onSearch={value => this.searchClinic(value)}
                      style={{ width: 200 }}
                    />
                <br /><br />
                <ConfigProvider>
                    <Table 
                        columns={columns} 
                        dataSource={servicelist}
                        bordered
                        loading={loading} 
                        pagination={pagination} 
                        onChange={this.handleTableChange} 
                    />
                </ConfigProvider>
            </Form>
        </div>
        )
    }
}


export default ComDisClue