import React from 'react'
import {
    ConfigProvider, Table ,Modal,Button,Icon
} from 'antd';
import store from 'store'
import { DropOption } from 'components'
import styles from './index.less'
import mixin from 'themes/mixin.less'
import { formatSeconds, hourMinSec, secondToDate } from 'utils/mm'

const confirm = Modal.confirm;


class List extends React.Component {

    state = {
      pagination: {
        showSizeChanger: true,
        onShowSizeChange: (current,pageSize) => this.onShowSizeChange(current,pageSize),
        pageSizeOptions: ['10', '20', '50', '100']
      },
      visible_audio: false
    }


    handleMenuClick = () => {

    }

    // 处理分页
    handleTableChange = (pagination, filters, sorter) => {
      const { searchValue } =  this.props
      console.log(searchValue);
      this.props.onSetCurrentPage(pagination.current)
      this.props.onGetAudioList({page: pagination.current, limit:pagination.pageSize,...searchValue})
    }

    //改变每页条数
    onShowSizeChange = (current, pageSize) => {
      const { searchValue } =  this.props
      this.props.onSetCurrentSize(pageSize)
      this.props.onGetAudioList({page: 1, limit:pageSize, ...searchValue })
    }


    // 录音播放
    handlePlayAudio = (payload) => {
      this.props.onPlayAduio(payload)
    }

    // 暂停
    handlePauseAudio = (payload)=> {
      this.props.onPasueAudio(payload)
    }

    // 下载录音
    handleDownloadAudio = () => {

    }

    render(){
      const columns = [
          {
            title: '员工姓名',
            dataIndex: 'adminName',
          },
          {
            title: '员工手机号码',
            dataIndex: 'empNo',
          },
          {
            title: '客户姓名',
            key: 'userName',
            render: (text, record) => {
              const { userName } = record
              return (
                <div className={mixin.lightHeight}>{userName}</div>
              )
            }
          },
          {
            title: '客户手机号',
            key: 'cusNo',
            render: (text, record) => {
              const { cusNo } = record
              return (
                <div className={mixin.lightHeight}>{cusNo}</div>
              )
            }
          },
          {
            title: '拨打时间',
            dataIndex: 'startTime',
          },
          {
            title: '通话时长',
            key: 'duration',
            render: (text, record) => {
              const { duration } = record
                  return (
                    <div>{secondToDate(duration)}</div>
                  )
            }
          },
          {
            title: '类型',
            key: 'type',
            render: (text, record) => {
              const { type } = record
              return (
              <div className={styles.operBtnBox}>
                { type == 'OutBound_Call' ? '外呼电话' :''}
                { type == 'OutBound_Unkown' ? '陌生去电' :''}
                { type == 'InBound_Call' ? '客户电话' :''}
                { type == 'InBound_Call_Channel' ? '渠道电话' :''}
                { type == 'Unknow_Call' ? '陌生电话' :''}
              </div>
              )
            }
          },
          {
            title: '状态',
            key: 'llResult',
            render: (text, record) => {
              const { llResult } = record
              return (
              <div className={styles.operBtnBox}>
                { llResult === 'ANSWERED' ? '通话成功' :''}
                { llResult === 'BUSY' ? '被叫忙' :''}
                { llResult === 'NO_ANSWER' ? '被叫无应答' :''}
                { llResult === 'REJECT' ? '被叫拒接' :''}
                { llResult === 'HANGUP' ? '主叫提前挂机' :''}
                { llResult === 'INVALID_NUMBER' ? '空号' :''}
                { llResult === 'POWER_OFF' ? '关机' :''}
                { llResult === 'UNAVAILABLE' ? '暂时无法接听' :''}
                { llResult === 'SUSPEND' ? '停机' :''}
                { llResult === 'BLACK' ? '黑名单号码' :''}
                { llResult === 'OTHER' ? '其他失败情形' :''}
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
              const { lssRecordUrl, isPlay, duration } = record
              return (
              <div className={styles.operBtnBox}>
                { isPlay ? <Button type="danger" size="small" onClick={e => this.handlePauseAudio(record)}>暂停</Button> :
                  <Button type="danger" size="small" disabled={duration && duration > 0 ? false : true}
                    onClick={e => this.handlePlayAudio(record)}>录音播放</Button>
                }
                <Button type="primary" size="small" disabled={duration && duration > 0 ? false : true}
                href={lssRecordUrl} target={'_blank'}>下载录音</Button>
              </div>
              )
            }
          }
      ]
      const { rowSelection,callRecordList, loading, total, currentPage } = this.props
      const { pagination} = this.state
      pagination['total'] = total
      pagination['current'] = currentPage
      return (
          <ConfigProvider>
              <Table
                 rowSelection={rowSelection}
                 columns={columns}
                 dataSource={callRecordList}
                 bordered
                 scroll={{ x: 1300 }}
                 loading={loading}
                 pagination={pagination}
                 onChange={this.handleTableChange}
              />
          </ConfigProvider>
      )
    }
}


List.propTypes = {

}


export default List
