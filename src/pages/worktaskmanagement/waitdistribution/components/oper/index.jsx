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
        const { hasSelected, selectedRowKeys, cleanSelectedKeys } = this.props
        return (
            <div className={styles.oper}>
                <Button type="primary" icon="plus" onClick={this.onShowModal.bind(this,'新增工单','add')}>新增工单</Button>
                <Dropdown overlay={
                <Menu>
                    <Menu.Item key="3" onClick={this.onShowModal.bind(this,'批量分配','batch')}>批量分配</Menu.Item>
                </Menu>
                }  disabled={!hasSelected}>
                <Button type="primary">
                    批量处理<Icon type="down" />
                </Button>
                </Dropdown>
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