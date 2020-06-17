import { checkEnv } from '../utils'
// import axios from 'axios'
// import wx from 'wx'
export default function shareInit(OPTION) {
  const app_info = checkEnv()
  const wxpub_id = app_info.wxpub_id
  let title = OPTION.title || '分享标题'
  let url = OPTION.url || window.location.href
  let logo =
    OPTION.logo ||
    OPTION.thumbUrl ||
    OPTION.thumbnail ||
    'https://yxs-app.oss-cn-beijing.aliyuncs.com/7afea67a09b7b83b2c8ab219d2bd8b10'
  let content = OPTION.content || ''
  let jsApiList = [
    'hideAllNonBaseMenuItem',
    'showAllNonBaseMenuItem',
    'hideMenuItems',
    'showMenuItems',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQZone',
    'getLocation',
    'chooseImage',
    'chooseWXPay',
  ]
  if (OPTION.jsApiList) jsApiList = jsApiList.concat(OPTION.jsApiList)
  return new Promise((resolve, reject) => {
    return axios
      .post(process.env.WEB_HOST + '/base/wx_config', {
        web_url: encodeURIComponent(window.location.href),
        wxpub_id,
      })
      .then(({ data: result }) => {
        wx.config({
          debug: false,
          appId: result.data.appid,
          timestamp: result.data.timestamp,
          nonceStr: result.data.noncestr,
          signature: result.data.signature,
          jsApiList: jsApiList,
        })
        wx.ready(() => {
          let menuList = [
            'menuItem:share:QZone',
            'menuItem:share:qq',
            'menuItem:share:email',
            'menuItem:openWithSafari',
            'menuItem:openWithQQBrowser',
            'menuItem:readMode',
            'menuItem:favorite',
          ]
          if (OPTION.menuList) {
            menuList = menuList.concat(OPTION.menuList)
          }
          wx.hideMenuItems({
            menuList: menuList,
          })
          wx.onMenuShareAppMessage({
            title: title,
            desc: content,
            link: url,
            imgUrl: logo,
            success: (res) => {
              resolve('wx')
            },
            cancel: (err) => {
              reject(err)
            },
          })
          wx.onMenuShareTimeline({
            title: title,
            desc: content,
            link: url,
            imgUrl: logo,
            success: (res) => {
              resolve('pyq')
            },
            cancel: (err) => {
              reject(err)
            },
          })
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}
