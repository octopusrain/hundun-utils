import axios from 'axios'
import { checkEnv, getBaseEnvironment, query, sendSa } from '../utils/'
const app_info = checkEnv()
const wxpub_id = app_info.wxpub_id
const environment = getBaseEnvironment()
const os = navigator.userAgent.match(/Android/i) ? 'Android' : 'iOS'
const error_handle = () => {
  let searchParams = new URLSearchParams(window.location.search)
  searchParams.delete('code')
  searchParams.delete('state')
  searchParams.delete('v')
  let url = `${window.location.href.split('?')[0]}?${searchParams.toString()}`
  window.location.replace(
    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      app_info.app_id +
      '&redirect_uri=' +
      encodeURIComponent(url) +
      '&response_type=code&scope=snsapi_userinfo&state=' +
      new Date().getTime() +
      '&connect_redirect=1#wechat_redirect'
  )
}

const getAuthrize = (channel = '', web_host = process.env.WEB_HOST) => {
  const localStorage = window.localStorage
  const open_id = localStorage.getItem('openid') || ''
  const userinfo = localStorage.getItem('userinfo') || ''
  // 未授权
  if (!open_id || !userinfo) {
    let code = query('code')
    if (!code) {
      return Promise.resolve(
        window.location.replace(
          'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
            app_info.app_id +
            '&redirect_uri=' +
            encodeURIComponent(window.location.href) +
            '&response_type=code&scope=snsapi_userinfo&state=' +
            new Date().getTime() +
            '&connect_redirect=1#wechat_redirect'
        )
      )
    }
    return new Promise(async (resolve, reject) => {
      try {
        const { openid } = await getOpenidByCode(code, web_host)
        // 存下openid
        localStorage.setItem('openid', openid)
        const data = await getUserinfoByOpenid(openid, web_host)
        // 存下微信授权用户信息
        localStorage.setItem('userinfo', JSON.stringify(data))
        const user_info = await thirlLogin(data, channel)
        resolve(user_info)
      } catch (error) {
        reject(error)
      }
    })
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const user_info = await thirlLogin(JSON.parse(userinfo))
        resolve(user_info)
      } catch (error) {
        reject(error)
      }
    })
  }
}
const getOpenidByCode = (code, web_host) => {
  return new Promise((resolve, reject) => {
    return axios
      .get(web_host + '/base/get_wx_openid', {
        params: {
          code,
          wxpub_id,
        },
      })
      .then(({ data: res }) => {
        if (res.error_no != 0) {
          reject(error_handle())
        } else {
          resolve(res.data)
        }
      })
      .catch(() => {
        reject(error_handle())
      })
  })
}
const getUserinfoByOpenid = (openid, web_host) => {
  return new Promise((resolve, reject) => {
    return axios
      .get(web_host + '/base/get_wx_userinfo', {
        params: {
          openid,
          wxpub_id,
        },
      })
      .then(({ data: res }) => {
        if (res.error_no != 0) {
          reject(error_handle())
        } else {
          resolve(res.data)
        }
      })
      .catch(() => {
        reject(error_handle())
      })
  })
}
const thirlLogin = (userinfo, channel) => {
  const channel_type = query('channel') || query('channel_type') || ''
  const share_uid = query('ambass_id') || query('share_uid') || ''
  const sale_channel = query('sale_channel') || ''
  const pid = query('pid')
  return new Promise((resolve, reject) => {
    return axios
      .post(
        process.env.VUE_APP_USER_HOST + '/thirdparty_login',
        Object.assign(userinfo, {
          head_img: userinfo.headimgurl,
          channel,
          type: 'h5wx',
          pid,
          client_type: 'h5',
          plat_type: `h5_${os}_h5`,
          wxpub_id,
          channel_type,
          share_uid,
          sale_channel,
        })
      )
      .then((res) => {
        resolve(res.data.data)
      })
      .catch((err) => {
        Raven.captureException(err)
        reject(err)
      })
  })
}
const getUserInfo = (uid, user_host) => {
  return new Promise((resolve, reject) => {
    return axios
      .get(`${user_host}/get_user_info?uid=${uid}`)
      .then((res) => {
        resolve(res.data.data)
      })
      .catch((err) => {
        Raven.captureException(err)
        reject(err)
      })
  })
}
export default function getUserBaseInfo(
  user_id,
  channel,
  web_host = process.env.VUE_APP_WEB_HOST,
  user_host = process.env.VUE_APP_USER_HOST
) {
  return new Promise(async (resolve, reject) => {
    try {
      let user_info = null
      if (environment === 'wx') {
        user_info = await getAuthrize(channel, web_host)
      } else {
        if (user_id) {
          user_info = await getUserInfo(user_id, user_host)
        }
      }
      sendSa(user_info)
      resolve(user_info)
    } catch (error) {
      Raven.captureException(error)
      reject(error)
    }
  })
}
