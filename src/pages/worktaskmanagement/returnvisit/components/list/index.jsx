import React from 'react'
import {
    ConfigProvider, Table ,Modal,Avatar,Button,Icon,Radio, Tooltip
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import mixin from 'themes/mixin.less'
import MyIcon from 'utils/icon.js'
import { parseTime } from 'utils/mm'

const confirm = Modal.confirm;
const RadioGroup = Radio.Group
let radioArr = {}
let userLabes = []
let userid = ''

class List extends React.Component {

      state = {
        pagination: {},
        visible: false,
        userTags: []
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
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/handleworktask?key=1&orderno=${orderno}`
          // window.open(url)
          this.props.history.push({
            pathname: '/worktaskmanagement/handleworktask',
            query: {
              orderno,
              key: 1,
              type: 'returnVisit'
            },
          })
        } else if (e === 3) {
          // let url = `${window.location.origin}/gd/#/worktaskmanagement/worktaskdetail?key=worktaskdetail&orderno=${orderno}`
          // window.open(url)
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
      this.props.updateIsReturn(record)
      this.props.clearCurrentCallInfo()
      this.props.onBindCallPhone(record)
    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
        const { searchValue } =  this.props
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetOrderList({page: pagination.current, limit:10,...searchValue})
    }


    rendChatBtn (record) {
      let table = record.personMembers.map((item, index)=> {
        let guidMember = store.get('guidMember')
        if(item.memberNoGm == guidMember.memberNoGuid){
          return  <Button key={index} size="small" type="primary" onClick={e => this.sendChatMessage(item)}><MyIcon className={styles.iconweixin1} type="iconweixin1" /></Button>
        } else {
          return ''
        }
      })
      return table
    }

    rendAddBtn (record) {
        return <Button size="small" type="primary" onClick={e => this.sendAddFriends(record)}><Icon type="usergroup-add" /></Button>
    }

    //跳转IM聊天
    sendChatMessage = (record) => {
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

    //添加、编辑客户标签
    handleLabels = (record) => {
      userLabes = []
      const { lablenames } = record
      if (lablenames != null) {
        this.setState({
          userTags: lablenames.split(',')
        });
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
      if (Object.keys(radioArr).length > 0) {
        for(var i in radioArr){
          userLabes.push(radioArr[i])
        }
        userLabes = Array.from(new Set(userLabes))
      }
      if (userLabes.length > 0) {
        this.props.onChangeLabels({
          labels: userLabes.join(','),
          userid: userid
        })
      }
    };

    handleCancel = e => {
      this.setState({
        visible: false,
      });
    };

    onChangeRadio = (e, index) => {
       radioArr[index+'_ind'] = e.target.value
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
            key: 'lablenames',
            width: 300,
            render: (text, record) => {
              const { lablenames, lableremarks } = record
              return (
                <p>
                <span style={{marginRight:20}}>{lablenames}</span>
                {
                  lablenames === null ?
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
            title: '意愿等级',
            dataIndex: 'level',
            width: 60,
          },
          {
            title: '回访时间',
            key: 'returndate',
            width: 160,
            render: (text, record) => {
              const { returndate } = record
              return (
                <span>{returndate ? parseTime(returndate) : ''}</span>
              )
            }
          },
          {
            title: '状态',
            key: 'status',
            render: (text,record) => {
              const { isReturn } = record
              return (
                <span>{isReturn == 1 ? '待回访' : '已回访'}</span>
              )
            }
          },
          {
            title: '联系客户',
            key: 'concatcustom',
            fixed: 'right',
            render: (text, record) => {
              const { orderno,isclue } = record
              return (
              <div className={styles.operBtnBox}>
                <Button size="small" type="primary" onClick={e => this.handleMakeCall(record)}><Icon type="phone" /></Button>
            {/*  {
                  record.personMembers == null ? this.rendAddBtn(record) : this.rendChatBtn(record)
                }  */}
              </div>
              )
            }
          },
          {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 250,
            render: (text, record) => {
              const { orderno,isclue } = record
              return (
              <div className={styles.operBtnBox}>
                <Button type="danger" size="small" onClick={e => this.handleMenuClick(orderno, 2)}>处理</Button>
        {/*   {isclue === 0 ? <Button type="primary" size="small" onClick={e => this.handleMenuClick(orderno, 4)}>创建线索</Button> : ''}
                <Button size="small" onClick={e => this.handleMenuClick(orderno, 1)}>编辑</Button>    */}
                <Button size="small" onClick={e => this.handleMenuClick(orderno, 3)}>详情</Button>
              </div>
              )
            }
          }
      ]
      const { rowSelection,orderlist, loading, total, currentPage, customerTagsList } = this.props
      const { pagination, userTags } = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      let labelA = []
      if(userTags.length > 0) {
        labelA = userTags
      }

      return (
        <div>
          <ConfigProvider>
              <Table
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
          { customerTagsList.map((item,index) => {
              return <div  style={{marginBottom: 20}}>
                <p className={styles.borBottom}>{item.tagname}</p>
                <div >

                <Radio.Group onChange={e => this.onChangeRadio(e, index)}  size="small" buttonStyle="solid">
                  { item.child.map( (op) => {
                        return (
                                <Radio.Button
                                style={{marginRight: 20, marginBottom: 10}}
                                name="radio"
                                value={op.tagname}>
                                  {op.tagname}
                                </Radio.Button>
                        )
                  })}
                </Radio.Group>
                </div>
              </div>
          }) }
        </Modal>
        </div>
      )
    }
}


List.propTypes = {

}


export default List
