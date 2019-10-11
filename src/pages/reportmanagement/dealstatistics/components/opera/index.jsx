import React, { Fragment }  from 'react'
import {
     Button, Icon, Table, Alert,Dropdown,Menu,Upload,message
} from 'antd';
import PropTypes from 'prop-types'
import styles from './index.less'
import {_mmStampToTime} from 'utils/mm'


class Oper extends React.Component {

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

        return (
            <div className={styles.oper}>
                <Button type="primary"  icon="export" href={window.baseURL+'/storder/export/currmonth' + exporturl}>批量导出</Button>
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
