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
                <Button type="primary" icon="plus" onClick={this.onShowModal.bind(this,'新增产品','add')}>新增产品</Button>
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