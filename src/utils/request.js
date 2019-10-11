import axios from 'axios'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import router from 'umi/router';
import { message,Modal } from 'antd'
import qs from 'qs'
import store from 'store'
import './global'
import md5 from 'js-md5'


const { CancelToken } = axios
window.cancelRequest = new Map()

const service = axios.create({
  baseURL : baseURL,
  withCredentials: true,
  timeout: 120000
})

let catchOff = false

export default function request(options) {
    let { data, url, method = 'get' } = options
    const cloneData = cloneDeep(data)
    let newUrl = '/api/im/chat/lastGmHistoryChat.do'

    if(options.url == newUrl) {
      let userinfo = store.get('userinfo')
      let token = userinfo.guidMember.token
      let paramObj  = {};
      Object.assign(paramObj, data || {}, data || {} );

      let paramJson = JSON.stringify(paramObj);
      let timestamp  = new Date().getTime() //时间撮
      let salt = "013cXuH9vf584W0x"   //盐值
      let signature = md5(md5(paramJson) + timestamp + salt);//签名

      options.data = {
        // ...options.data,
        token,
        timestamp,
        signature,
        paramJson
      }
      options.data = qs.stringify(options.data);
      // console.log(options)
    }

  try {
    let domain = ''
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${url}${isEmpty(cloneData) ? '' : '?'}${qs.stringify(cloneData)}`
      : url

  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  return service(options)
    .then(response => {
      catchOff = false
      const { statusText, status, data } = response
      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }
      if ( data.result === 1 ) {
        const isLogin = store.get('isLogin')
        if (!isLogin) store.set('isLogin',true)
      } else if(data.result === 5 ){
        const isLogin = store.get('isLogin')
        if (isLogin){
          store.set('isLogin',false)
          Modal.confirm({
            title: '对不起，您还没有登录！',
            content: 'Bla bla ...',
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                router.push('/login')
            }
          })
        }
      }

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      const { response } = error

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      if (!catchOff) {
        // catchOff = true
        // Modal.error({
        //   title: '服务器连接不上啦',
        //   content: 'Bla bla ...',
        //   okText: '刷新试试',
        //   cancelText: '取消',
        //   onOk:()=>{
        //     window.location.reload();
        //   }
        // })
      }



      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
