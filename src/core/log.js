export const saInit = (server_url = process.env.SA_HOST) => {
  return new Promise((resolve, reject) => {
    try {
      ;(function (para) {
        let p = para.sdk_url,
          n = para.name,
          w = window,
          d = document,
          s = 'script',
          x = null,
          y = null
        w['sensorsDataAnalytic201505'] = n
        w[n] =
          w[n] ||
          function (a) {
            return function () {
              ;(w[n]._q = w[n]._q || []).push([a, arguments])
            }
          }
        let ifs = [
          'track',
          'quick',
          'register',
          'registerPage',
          'registerOnce',
          'trackSignup',
          'trackAbtest',
          'setProfile',
          'setOnceProfile',
          'appendProfile',
          'incrementProfile',
          'deleteProfile',
          'unsetProfile',
          'identify',
          'login',
          'logout',
          'trackLink',
          'clearAllRegister',
          'getAppStatus',
        ]
        for (let i = 0; i < ifs.length; i++) {
          w[n][ifs[i]] = w[n].call(null, ifs[i])
        }
        if (!w[n]._t) {
          ;(x = d.createElement(s)), (y = d.getElementsByTagName(s)[0])
          x.async = 1
          x.src = p
          x.setAttribute('charset', 'UTF-8')
          y.parentNode.insertBefore(x, y)
          w[n].para = para
        }
      })({
        sdk_url:
          'https://yxs-web.oss-cn-beijing.aliyuncs.com/sensorsdata.min.js',
        heatmap_url:
          'https://yxs-web.oss-cn-beijing.aliyuncs.com/heatmap.min.js',
        heatmap: {
          clickmap: 'default',
          scroll_notice_map: 'default',
        },
        name: 'sa',
        server_url,
        show_log: true,
      })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
export const sentryInit = (sentry_host = process.env.SENTRY_HOST) => {
  return new Promise((resolve, reject) => {
    try {
      let ravenOptions = {
        ignoreErrors: [
          'WeixinJSBridge is not defined',
          'TouTiao is not defined',
          "Can't find variable: ZhihuiOS",
          'x5onSkinSwitch is not defined',
          'main is not defined',
          "Can't find variable: main",
        ],
        includePaths: [/https?:\/\/(t)?tools\.hundun\.cn/],
      }
      Raven.config(sentry_host, ravenOptions).install()
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
export default {
  sa_init,
  sentry_init,
}
