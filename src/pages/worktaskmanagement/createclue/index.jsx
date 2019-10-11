import React, { Component } from 'react'
import {
    Card,
    Row, Col,
    Form,
    Button,
    Cascader,
    Select,
    Input,
    DatePicker,
    Modal,
    Table,
    ConfigProvider,
    Spin
} from 'antd'
import { connect } from 'dva'
import city from 'utils/city'
import { _mmAction } from 'utils/mm'
import styles from './index.less';
import mixin from 'themes/mixin.less'

const namespace = 'newdistribution'
const parentNamespace = 'worktaskmanagement'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
}

const formItemLayout1 = {
    labelCol: {
        xs: { span: 20 },
        sm: { span: 20 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 },
    },
}

const Option = Select.Option;
const TextArea = Input.TextArea

const Search = Input.Search;


@connect(({ layout, worktaskmanagement, newdistribution }) => ({
    ...worktaskmanagement,
    ...layout,
}), (dispatch) => ({
    getOrderDetail(payload) {
        dispatch(
            _mmAction(
                `${parentNamespace}/EFFECTS_GET_ORDERDETAIL`,
                payload
            )
        )
    },
    getServiceList(payload) {
        dispatch(
            _mmAction(
                `${parentNamespace}/EFFECTS_SERVICE_LIST`,
                payload
            )
        )
    },
    dispatchClue(payload) {
        dispatch(
            _mmAction(
                `${parentNamespace}/EFFECTS_CLUE_DISPATCH`,
                payload
            )
        )
    },
    createClue(payload) {
        dispatch(
            _mmAction(
            `${parentNamespace}/EFFECTS_CREATE_CLUE`,
            payload
            )
        )
    },
    onIsShowModal(payload) {
        dispatch(
          _mmAction(
            `${parentNamespace}/IS_SHOWMODAL`,
            payload
          )
        )
      }
}))

class CreateClue extends Component {

    state = {
        currentPage:1,
        limit: 10,
        loading: false,
        pagination: {},
        searchValue: {},
        values: {}
    }

    componentDidMount() {
        const { orderno ,pathname} = this.props.history.location.query
        this.props.getOrderDetail({ orderno })
    }


    handleSaveClue = () => {
        const { orderno } = this.props.history.location.query
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['orderno'] = orderno
                this.props.createClue(values)
            }
        })
    }

    handleDispatchClue = () => {
        const { orderno } = this.props.history.location.query
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['orderno'] = orderno
                values['requestKey'] = 'servicelist'
                values['userType'] = values['usertype']
                this.props.createClue(values)
                this.setState({
                    searchValue: values,
                    values
                })
            }
        })
    }

    confirmDispatch = (record) => {
        const { code, isShop, clinicName} = record
        const { values } = this.state
        const { orderno } = this.props.history.location.query
        this.props.dispatchClue({
            orderno,
            code,
            isShop,
            clinicName,
            values
        })

    }

    searchClinic = (value) => {
       const { limit, searchValue, currentPage } = this.state
       searchValue['clinicName'] = value
       this.setState({searchValue , currentPage: 1})
       this.props.getServiceList({start: (1 - 1) * limit, limit, ...searchValue})
    }

    handleCloseClue = () => {
        this.props.history.goBack()
    }

    handleGoBack = () => {
        this.props.history.goBack()
    }

    handleCancel = ()=>{
        this.props.onIsShowModal({isShowComModal:false, title:'',servicelist:[]})
    }


    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { limit, searchValue } = this.state
      this.setState({ currentPage: pagination.current })
      this.props.getServiceList({start: (pagination.current - 1) * limit, limit, ...searchValue})
    }


    render() {
        const { orderdetail,usertype,isShowComModal, times, servicelist,serviceTotal ,loading} = this.props
        const { user } = orderdetail
        const { getFieldDecorator } = this.props.form
        const { pagination , currentPage} = this.state
        pagination['total'] = serviceTotal
        pagination['current'] = currentPage
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
            <div className={styles.CreateClue}>
            <Form
                className="ant-advanced-search-form"
                layout='vertical'
            >
                <Card
                    title="创建线索"
                    // extra={<Button style={{ marginLeft: 8 }} htmlType="submit" onClick={this.handleGoBack}>返回</Button>}
                    style={{ marginBottom: 24 }} bordered={false}
                >
                    <Row className={styles.infoBox}>
                        <Col span={24}>
                            <Col span={6}>
                                <Form.Item label='客户姓名:' {...formItemLayout}>
                                    <span className={mixin.lightHeight}>{user && user.name ? user.name : ''}</span>
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item label='电话号码:' {...formItemLayout}>
                                  <span className={mixin.lightHeight}>  {user && user.phone ? user.phone : ''}</span>
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item label='性别:' {...formItemLayout}>
                                    {user && user.sex ?
                                      <span>
                                        {user.sex ===1 ? '男' : '' }
                                        {user.sex ===2 ? '女' : '' }
                                        {user.sex ===3 || null ? '未知' : '' }
                                      </span> : ''}
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item label='年龄:  ' {...formItemLayout}>
                                    {user && user.age ? user.age : ''}
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item label='预约项目：' {...formItemLayout}>
                                    {orderdetail && orderdetail.project ? orderdetail.project : ''}
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item label='所属人员：' {...formItemLayout}>
                                    {orderdetail && orderdetail.adminname ? orderdetail.adminname : ''}
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item label='来源：' {...formItemLayout}>
                                    {user && user.sourcename ? user.sourcename : ''}
                                </Form.Item>
                            </Col>
                            <Col span={6} >
                                <Form.Item label='来源日期：' {...formItemLayout}>
                                    {user && user.sourcedate ? user.sourcedate : ''}
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item label='主诉：' {...formItemLayout}>
                                    {orderdetail && orderdetail.complaint ? user.complaint : ''}
                                </Form.Item>
                            </Col>
                        </Col>
                    </Row>
                        <Row>
                            <Col span={6} id="addressCascader">
                                <Form.Item label='所在省市'  {...formItemLayout1} >
                                    {getFieldDecorator('addressKey', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入选择省市'
                                            }
                                        ],
                                        initialValue: user ? user.addressKey : ""
                                    })(
                                        <Cascader
                                            style={{ width: '100%' }}
                                            options={city}
                                            placeholder='请选择省市'
                                            getPopupContainer={() =>
                                                document.getElementById('addressCascader')
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6} id="addressCascader">
                                <Form.Item label='客户类型' {...formItemLayout1}>
                                    {getFieldDecorator('usertype', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入选择客户类型'
                                            }
                                        ],
                                    })(
                                        <Select
                                            showSearch
                                            placeholder="请选择客户类型"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Option key='' value=''>选择</Option>
                                            { usertype && usertype.length > 0 ? usertype.map(item => {
                                                return <Option key={item.code} value={item.code}>{item.lableName}</Option>
                                            }) : null}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label='预约日期' {...formItemLayout1}>
                                    {getFieldDecorator('reservedate', {
                                    })(
                                        <DatePicker format='YYYY/MM/DD'/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                          <Form.Item label='预约时间' {...formItemLayout1}>
                              {getFieldDecorator('reservetime', {
                              })(
                                  <Select
                                      showSearch
                                      placeholder="请选择预约时间"
                                      optionFilterProp="children"
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                  >
                                        <Option key='' value=''>请选择预约时间</Option>
                                        { times.map(time=>(
                                               <Option value={time} key={time}>{time}</Option>
                                        ))}
                                  </Select>
                              )}
                          </Form.Item>
                          </Col>
                            <Col span={24}>
                                <Form.Item label='备注' {...formItemLayout1}>
                                    {getFieldDecorator('worknotes', {
                                        initialValue: orderdetail && orderdetail.worknotes ? orderdetail.worknotes : ''
                                    })(
                                        <TextArea placeholder="请输入备注" autosize={{ minRows: 2, maxRows: 6 }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    <div className={styles.btnBox}>
                        <Button type="primary" onClick={this.handleCloseClue}>关闭</Button>
                        <Button type="primary" onClick={this.handleSaveClue}>保存到线索库</Button>
                        <Button type="primary" onClick={this.handleDispatchClue}>直接派单</Button>
                    </div>
                </Card>
                 <Modal
                    title="派单"
                    visible={isShowComModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={1000}
                    centered
                    footer={false}
                    destroyOnClose={true}
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
                </Modal>

                </Form>
                { loading ? <div className={styles.loadingBox}>
            <Spin tip="Loading..." size='large'/>
        </div> : null }
            </div>
        )
    }
}

export default Form.create()(CreateClue)
