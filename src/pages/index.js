import React from 'react'
import Redirect from 'umi/redirect'

class Dashbord extends React.Component{
    render () {
        return <Redirect to={`/usercenter`}/>
    }
}

export default Dashbord