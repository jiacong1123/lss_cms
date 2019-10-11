import React, { Fragment }  from 'react'
import {
     Button, Icon, Table, Alert,Dropdown,Menu,Upload,message
} from 'antd';
import PropTypes from 'prop-types'
import styles from './index.less'
import {_mmStampToTime} from 'utils/mm'


class Oper extends React.Component {

    onShowModal = (title,modalKey) => {
        this.props.onIsShowModal({
            visible:true,
            title,
            modalKey
        })
    }

    handleExportUrl = (data) =>{
        let str = ""
        for(let key in data ){
            if( data[key] ) {
                str = str + '&' + key + '=' + data[key]
            }

        }
        return '?'+str
    }

    render(){
        const { hasSelected, selectedRowKeys, cleanSelectedKeys, searchValue } = this.props
        const exporturl = this.handleExportUrl(_mmStampToTime(searchValue,['start','end'],'YYYY-MM-DD'))
        const templateUrl = `${window.imagesUrl}%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%E6%A8%A1%E6%9D%BF.xls`
        const UploadProps = {
            name: 'upfile',
            action: window.baseURL+'/user/batchadd',
            showUploadList:false,
            withCredentials:true,
            onChange: (info)=> {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    //上传后重新获取所有客户列表刷新
                    this.props.onGetCustomList({page:1,limit: 10})
                    message.success(info.file.response.msg,30);

                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件导入失败.`,30);
                }
            }
        }
        return (
            <div className={styles.oper}>
                <Button type="primary" icon="plus" onClick={this.onShowModal.bind(this,'新增客户','add')}>新增客户</Button>
                <Upload {...UploadProps}>
                    <Button type="primary" icon="folder-add">
                    批量导入
                    </Button>
                </Upload>
                <Button type="primary"  icon="export" href={window.baseURL+'/user/batchexport' + exporturl}>批量导出</Button>
                <Button type="primary" htmlType="submit" icon="file-excel"  href={templateUrl}>下载模板</Button>
                {/* <Dropdown overlay={
                <Menu>
                    <Menu.Item key="3">功能暂未开发</Menu.Item>
                </Menu>
                }  disabled={!hasSelected}>
                <Button type="primary">
                    批量处理<Icon type="down" />
                </Button>
                </Dropdown> */}
                <br /> <br />
                <div>
                <Alert message={
                    < Fragment >
                    已选择 < a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    <a onClick={cleanSelectedKeys} style={{ marginLeft: 24 }}>
                        清空
                </a>
                    </Fragment>
                } type="info" showIcon />
                </div>
           </div>
        )
    }
}

Oper.propTypes = {
    hasSelected: PropTypes.bool,
    cleanSelectedKeys: PropTypes.func,
    selectedRowKeys: PropTypes.array
}


export default Oper
