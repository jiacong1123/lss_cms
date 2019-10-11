import React from 'react'
import { Row, Col,  Checkbox } from 'antd';
import PropTypes from 'prop-types'
import styles from './index.less'


class ComRoleSetting extends React.Component {
    state = {
        checkedList: null,
        checkAll: false,
    }
    
    // checkbox
    onChange = (checkedList) => {
        const { rolelist } = this.props
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < rolelist.length),
            checkAll: checkedList.length === rolelist.length,
        })
        this.props.getCheckedList(checkedList)
    }

    // checkboxAll
    onCheckAllChange = (e) => {
        const { rolelist } = this.props
        const checkedList = e.target.checked ? this.handleCurrentAdminRole(rolelist) : []
        this.setState({
            checkedList,
            indeterminate: false,
            checkAll: e.target.checked,
        })
        this.props.getCheckedList(checkedList)
    }
    
    // 处理当前账号初始role列表
    handleCurrentAdminRole = (data) => {
        const arr = []
        if (data && data.length > 0) {
            data.forEach(item => {
                arr.push(item.roleid)
            })
        }
        return arr
    }

    render() {
        const { currentAdmin, rolelist } = this.props
        const { checkedList, checkAll } = this.state
        const initCheckedList = currentAdmin ? this.handleCurrentAdminRole(currentAdmin.roles) : null
        return (
            <div className={styles.oper}>
                <div style={{ borderBottom: '1px solid #E9E9E9', padding: '10px 0' }}>
                    <Checkbox
                        indeterminate={checkedList || initCheckedList.length > 0 ? (checkAll ? false : (checkedList ? (checkedList.length > 0 ? true : false) : true)) : false}
                        onChange={this.onCheckAllChange}
                        checked={checkAll}
                    >
                        选择全部
                </Checkbox>
                </div>
                <br />
                <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} value={checkedList ? checkedList : initCheckedList}>
                    <Row>
                        {rolelist && rolelist.length > 0 ? rolelist.map(item => {
                            return <Col span={6} key={item.roleid}><Checkbox value={item.roleid}>{item.rolename}</Checkbox></Col>
                        }) : null}
                    </Row>
                </Checkbox.Group>
            </div>
        )
    }
}


export default ComRoleSetting