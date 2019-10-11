import React from 'react';
import { NavLink } from 'react-router-dom';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import styles from './index.less'
import { connect } from 'dva'
import routes from 'config/routes.config.js'
import { _mmMenulistToBreadcrumbs } from '@/utils/mm'

// breadcrumbs can be any type of component or string
const UserBreadcrumb = ({ match }) =>
  <span>{match.params.userId}</span>; // use match param userId to fetch/display user name

// map & render your breadcrumb components however you want.
// each `breadcrumb` has the props `key`, `location`, and `match` included!


@connect(({ app })=>({
    ...app
}))

class Breadcrumbs extends React.Component{
    render(){
        const { breadcrumbs, thumbs } = this.props
        return (
            <div className={styles.breadcrumbs}>
                {breadcrumbs.map((breadcrumb, index) => (
                <span key={breadcrumb.key}>
                    {/* <NavLink to={breadcrumb.props.match.url} replace>

                    </NavLink> */}
                    {breadcrumb}
                    {(index < breadcrumbs.length - 1) && <i> / </i>}
                </span>
                ))} <i>{thumbs}</i>
            </div>
        )
    }
}

export default withBreadcrumbs(routes)(Breadcrumbs);
