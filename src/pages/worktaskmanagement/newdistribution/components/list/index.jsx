import React from 'react'
import {
    ConfigProvider, Table ,Modal,Button,Icon, Radio,Tooltip, Checkbox, Menu, Dropdown, message
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import mixin from 'themes/mixin.less'
import MyIcon from 'utils/icon.js'
import { parseTime } from 'utils/mm'

const confirm = Modal.confirm;
const RadioGroup = Radio.Group
let userLabes = []
let userid = ''
let tagsName = []

class List extends React.Component {

      state = {
        pagination: {
          showSizeChanger: true,
          onShowSizeChange: (current,pageSize) => this.onShowSizeChange(current,pageSize),
          pageSizeOptions: ['10', '20', '50', '100']
        },
        visible: false,
        userTags: []
      }

      rendChatBtn (record) {
        let table = record.personMembers.map((item, index)=> {
          let guidMember = store.get('guidMember')
          if(item.memberNoGm == guidMember.memberNoGuid){
            return  <Button key={index} size="small" type="primary" onClick={e => this.sendChatMessage(item, record)}><MyIcon className={styles.iconweixin1} type="iconweixin1" /></Button>
          } else {
            return ''
          }
        })
        return table
      }

      rendAddBtn (record) {
          return <Button size="small" type="primary" onClick={e => this.sendAddFriends(record)}><Icon type="usergroup-add" /></Button>
      }

      // 点击操作按钮
      handleMenuClick = (orderno, e) => {
        if ( e === 1 ) {
          // 获取当前工单信息
          this.props.onGetCurrentOrder({orderno})
          this.timer = setTimeout(()=>{
              let { currentOrder } = this.props
              if(Object.keys(currentOrder).length != 0 ) {
                let { user } = currentOrder
                let { sourceid, sourceid2 } = user
                  //显示出对应的二级来源
                  this.props.onGetSourceChild({
                    tagid: sourceid,
                  })
                  //存储对应二级来源
                  this.props.onSetSourceChild({
                    tagid2: sourceid2,
                  })
              }
          },2000)
          // 弹出编辑工单modal
          this.props.onIsShowModal({
            visible:true,
            title: '编辑工单',
            modalKey: 'edit'
          })

        } else if (  e === 2 ) {
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/handleworktask?key=10&orderno=${orderno}`
          // window.open(url)
          // return false
          this.props.history.push({
            pathname: '/worktaskmanagement/handleworktask',
            query: {
              orderno,
              key: 10
            },
          })
        } else if ( e === 3 ) {
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/worktaskdetail?key=worktaskdetail&orderno=${orderno}`
          // window.open(url)
          // return false
          this.props.history.push({
            pathname: '/worktaskmanagement/worktaskdetail',
            query: {
              orderno,
              key: 'worktaskdetail'
            },
          })
        } else if ( e === 4 ) {
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/createclue?key=createclue&orderno=${orderno}`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/createclue',
            query: {
              orderno,
              key: 'createclue'
            },
          })
        }
    }

    // 拨打电话
    handleMakeCall = (record) => {
      if (name == 'carl') {
        this.props.clearCurrentCallInfo()
        this.props.onBindCallPhone(record)
      } else {
        let userinfo = store.get('userinfo')
        const { ecUserId } = userinfo
        if (!ecUserId) {
            message.error('请先绑定EC账号!')
            return false
        }
        this.props.carlCallPhone({...record, ecUserId})
      }
    }

    //跳转IM聊天
    sendChatMessage = (record, list) => {
        //增加一条聊天记录
        record.orderno = list.orderno
        this.props.creatChatRecord(record)

        let guidMember = store.get('guidMember')
        let host = window.location.host
         // let url = `${host}/im-web/login?token=${guidMember.token}&wxId=${record.shopWx}&code=${record.code}&memberNoGm=${record.memberNoGm}&memberNo=${record.memberNo}`
        let url = `http://192.168.3.3/im-web?token=${guidMember.token}&wxId=${record.shopWx}&code=${record.code}&memberNoGm=${record.memberNoGm}&memberNo=${record.memberNo}`
        window.open(url)
    }

    //跳转IM添加好友
    sendAddFriends = (record) => {
      let guidMember = store.get('guidMember')
      let host = window.location.host
      // let url = `${host}/im-web/login?token=${guidMember.token}&addFriends=true&phone=${record.phone}`
      let url = `http://192.168.3.3/im-web?token=${guidMember.token}&addFriends=true&phone=${record.phone}`
      window.open(url)
    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetOrderList({page: pagination.current, limit:pagination.pageSize,...searchValue})
    }
    //改变每页条数
    onShowSizeChange = (current, pageSize) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentSize(pageSize)
      this.props.onGetOrderList({page: 1, limit:pageSize, ...searchValue })
    }

    //添加、编辑客户标签
    handleLabels = (record) => {
      userLabes = []
      const { lablenames } = record
      const { customerTagsList } = this.props
      // console.log(lablenames);
      if (lablenames != null) {
        this.setState({
          userTags: lablenames.split(',')
        });
        let aaa = lablenames.split(',')

        customerTagsList.forEach( (op, key) => {
          op.child.forEach((c) => {
            aaa.forEach( (e, index) => {
              if (c.tagname == e) {
                userLabes[key] = e
              }
            })
          })
        })
        // console.log(userLabes)
        // userLabes = userLabes.concat(aaa)
      }

      userid = record.userid
      this.setState({
        visible: true,
      });
    }

    handleOk = e => {
      this.setState({
        visible: false,
      });
      const { userTags } = this.state
      let aa = []
      let bb = []
      userLabes.forEach( (index) => {
        if (typeof(index) == 'object') {
          aa.push(index)
          aa = aa.flat()
        }
        if (typeof(index) == 'string') {
          bb.push(index)
        }
         tagsName = aa.concat(bb)
      })
      if (tagsName.length > 0) {
        this.props.onChangeLabels({
          labels: tagsName.join(','),
          userid: userid
        })
      } else {
        this.props.onChangeLabels({
          labels: '',
          userid: userid
        })
      }
      userLabes = []
      tagsName = []

    };

    handleCancel = e => {
      this.setState({
        visible: false,
      });
    };
    onChangeLaels = (e, index) => {
      userLabes[index] = e
      // userLabes = Array.from(new Set(userLabes))
    }

    render(){
      const columns = [
          {
            title: '客户姓名',
            key: 'name',
            render: (text, record) => {
              const { name } = record
              return (
                <div className={mixin.lightHeight}>{name}</div>
              )
            }
          },
          {
            title: '电话',
            key: 'phone',
            render: (text, record) => {
              const { phone } = record
              return (
                <div className={mixin.lightHeight}>{phone}</div>
              )
            }
          },
          {
            title: '客户标签',
            dataIndex: 'lablenames',
            width: 300,
            render: (text, record) => {
              const { lablenames, lableremarks } = record
              return (
                <p>
                <span style={{marginRight:20}}>{lablenames}</span>
                {
                  lablenames === null || lablenames == "" ?
                  <Button size="small" type="primary" onClick={e => this.handleLabels(record)}>
                  <Icon type="plus-circle" theme="twoTone" /></Button> :
                  <Button size="small" type="primary" onClick={e => this.handleLabels(record)}>
                  <Icon type="edit" theme="twoTone" /></Button>
                }
                </p>
              )
            }
          },
          {
            title: '最近联系',
            key: 'followuptime',
            onCell: () => {
              return {
                style: {
                  maxWidth: 200,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow:'ellipsis',
                  cursor:'pointer'
                }
              }
            },
            render: (text, record) => {
              const { followuptime, followupremarks } = record
              return (
                <Tooltip placement="top" title = {followuptime ? parseTime(followuptime) + followupremarks : followupremarks}>
                  {followuptime ? parseTime(followuptime) + followupremarks : followupremarks}
                </Tooltip>
              )
            }
          },
          {
            title: '分配日期',
            dataIndex: 'allottime',
            width: 150,
            render: (text, record) => {
              const { allottime } = record
              return (
                <span>{allottime ? parseTime(allottime) : ''}</span>
              )
            }
          },
          {
            title: '所属人员',
            dataIndex: 'adminname',
          },

          {
            title: '联系客户',
            key: 'concatcustom',
            fixed: 'right',
            // width: 278,
            render: (text, record) => {
              const { orderno,isclue } = record
              return (
              <div className={styles.operBtnBox}>
              <Dropdown overlay={
                <Menu>
                    {/*<Menu.Item key="1" onClick={ e => this.handleMakeCall(record, 'carl') } >卡尔话机</Menu.Item>*/}
                    <Menu.Item key="2" onClick={ e => this.handleMakeCall(record, 'EC') } >EC话机</Menu.Item>
                </Menu>
                }>
                <Button type="primary" size="small">
                    <Icon type="phone" />
                </Button>
                </Dropdown>
              {
                record.personMembers == null ? this.rendAddBtn(record) : this.rendChatBtn(record)
              }

              </div>
              )
            }
          },


          {
            title: '操作',
            key: 'operation',
           fixed: 'right',
            width: 278,
            render: (text, record) => {
              const { orderno,isclue } = record
              return (
              <div className={styles.operBtnBox}>
                <Button type="danger" size="small" onClick={e => this.handleMenuClick(orderno, 2)}>处理</Button>
                {isclue === 0 ? <Button type="primary" size="small" onClick={e => this.handleMenuClick(orderno, 4)}>创建线索</Button> : ''}
                <Button size="small" onClick={e => this.handleMenuClick(orderno, 1)}>编辑</Button>
                <Button size="small" onClick={e => this.handleMenuClick(orderno, 3)}>详情</Button>
              </div>
              )
            }
          }
      ]
      const { rowSelection, orderlist, loading, total, currentPage, customerTagsList } = this.props
      const { pagination, userTags } = this.state
      pagination['total'] = total
      pagination['current'] = currentPage

      return (
        <div>
          <ConfigProvider>
              <Table
                 rowSelection={rowSelection}
                 columns={columns}
                 dataSource={orderlist}
                 bordered
                 scroll={{ x: 1300 }}
                 loading={loading}
                 pagination={pagination}
                 onChange={this.handleTableChange}
              />
          </ConfigProvider>
          <Modal
            title="标签管理"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >

          { customerTagsList ? customerTagsList.map((item,index) => {
              return <div  style={{marginBottom: 20}}>
                <p className={styles.borBottom}>{item.tagname}</p>
                <div >
                  <Checkbox.Group onChange={e => this.onChangeLaels(e, index)} key={index} defaultValue={userTags}>
                    { item.child.map( (op) => {

                          return (
                                  <Checkbox
                                    style={{marginRight: 10, marginBottom: 10}}
                                    value={op.tagname}
                                  >
                                    {op.tagname}
                                  </Checkbox>
                          )

                    })}
                  </Checkbox.Group>
                </div>
              </div>
          }) : '' }
        </Modal>
        </div>

      )
    }
}


List.propTypes = {

}


export default List
