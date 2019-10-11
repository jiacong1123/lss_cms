import React from 'react'
import {  Form, Row, Col, Input, Select, Radio,Table, Cascader, DatePicker ,message, Upload, Icon,ConfigProvider,Button} from 'antd';
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
        pagination: {},
        loading: false,
        limit: 10,
        currentPage: 1, 
        searchValue: {}
    }

    confirmDispatch = (record) => {
        const { code, isShop, clinicName } = record
        this.props.dispatchClue({
            code,
            isShop,
            clinicName
        })

    }

    searchClinic = (value) => {
        const { limit, searchValue, currentPage } = this.state
        searchValue['clinicName'] = value
        this.setState({searchValue , currentPage: 1})
        let start = (currentPage - 1) * limit
        this.props.getServiceList({start: start , limit, ...searchValue})
     }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
        const { limit, searchValue } = this.state
        this.setState({ currentPage: pagination.current })
        let start = (pagination.current - 1) * limit
        this.props.getServiceList({start: start , limit, ...searchValue})
    }

    render() {
        const { usertype,servicelist,reservedpro, loading, serviceTotal } = this.props
        const {  currentPage , limit} = this.state
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
           <div>
               <Search
                      placeholder="诊所名称"
                      onSearch={value => this.searchClinic(value)}
                      style={{ width: 200 }}
                />
                <br /><br />
                    <Table 
                        columns={columns} 
                        dataSource={servicelist}
                        bordered
                        loading={loading} 
                        pagination={{
                            total: serviceTotal,
                            current: currentPage
                        }} 
                        onChange={this.handleTableChange} 
                    />
           </div>
        )
    }
}


export default ComDisClue