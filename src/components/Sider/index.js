/* global window */
/* global document */
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import withRouter from 'umi/withRouter'
import Navlink from 'umi/navlink'
import { Layout, Icon ,Menu,Switch } from 'antd'
import styles from './index.less'
const { Sider } = Layout;
const { SubMenu } = Menu

class ComSider extends PureComponent {

  //切换主题
  changeTheme = (value) => {
    if(value){
        this.props.effectsSwitchTheme('dark')
    }else{
        this.props.effectsSwitchTheme('light')
    }
  }

  onOpenChange = openKeys => {
    const newOpenKeys = openKeys.slice(-1)
    this.props.onUpdateSiderKeys({openKeys:newOpenKeys})
  }
  onClickItem= ({ item, key, keyPath })=>{
    if(keyPath.length === 1){
      this.props.onUpdateSiderKeys({openKeys:[]})
    } else {
      const newOpenKeys = keyPath.slice(-1)
      this.props.onUpdateSiderKeys({openKeys:newOpenKeys})
    }
  }
  onSelectItem= ({ item, key, selectedKeys })=>{
    this.props.onUpdateSiderKeys({selectedKeys:[key]})
  }


  generateMenus = data => {
    return data ? data.map((item,index)=> {
      if (item.list) {
        return (
          <SubMenu
            key={item.url}
            title={
              <Fragment>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.name}</span>
              </Fragment>
            }
          >
            {this.generateMenus(item.list)}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.url}>
          <Navlink to={item.url || '#'} replace>
            {item.icon && <Icon type={item.icon} />}
            <span>{item.name}</span>
          </Navlink>
        </Menu.Item>
      )
    }) : null
  }

  render() {
    const { collapsed, theme ,openKeys ,selectedKeys, menulist } = this.props
    const props = !collapsed ? {
      openKeys: openKeys
    } : {
      defaultOpenKeys: openKeys
    }
    return (
        <div className={ theme ==='dark' ? styles.layoutdark : styles.layoutlight}>
            <Sider
            trigger={null}
            collapsible={true}
            collapsed={collapsed}
            className={styles.siderMenu}
            width={256}
            >
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <img alt="logo" src={require('../../assets/bitbug_favicon.ico')} />
                        { !collapsed ? <h1>乐莎莎管理后台</h1> : null}
                    </div>
                </div>
                <div className={styles.menuContainer}>
                   <div className={styles.scrollbarContainer}>
                        <Menu
                          theme={theme}
                          mode="inline"
                          className={styles.menuInline}
                          onOpenChange={this.onOpenChange}
                          onClick={this.onClickItem}
                          onSelect={this.onSelectItem}
                          {...props}
                          selectedKeys={selectedKeys}
                        >
                            {this.generateMenus(menulist)}
                        </Menu>
                   </div>
                </div>
                { !collapsed ? <div className={styles.switchTheme}>
                    <span>
                    <Icon type="bulb" />切换主题
                    </span>
                    <Switch defaultChecked={ theme === "dark" ? true : false} onChange={this.changeTheme} checkedChildren="暗" unCheckedChildren="明"/>
                </div> : null}
            </Sider>
        </div>
    )
  }
}


export default ComSider
