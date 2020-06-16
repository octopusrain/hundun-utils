/**
 * 判断版本号
 * @param {*} version
 * @param {*} targetVersion
 */
export const checkVersion = (version, targetVersion) => {
  const vArr = version.split('.')
  const tArr = targetVersion.split('.')
  const handleArr = function (arr) {
    for (let index = 0; index < arr.length; index++) {
      if (Number(arr[index].length) < 2) arr[index] = '0' + arr[index]
    }
  }
  handleArr(vArr)
  handleArr(tArr)
  return vArr.join('') >= tArr.join('')
}
/**
 * 时间戳格式化为 hh:mm:ss
 * @param {String} time
 */
export const formatTime = (time) => {
  const hours = parseInt(time / 3600)
  const mins = parseInt((time - hours * 3600) / 60)
  const secs = parseInt(time - hours * 3600 - mins * 60)

  return `${hours.toString().padStart(2, 0)}:${mins
    .toString()
    .padStart(2, 0)}:${secs.toString().padStart(2, 0)}`
}
/**
 * 获取url参数值
 * @param {*} prop
 */
export const query = (prop) => {
  let GETURL = {}
  if (location.search.length) {
    let args = location.search.slice(1).split('&')
    for (let i = 0; i < args.length; i++) {
      let arg = args[i].split('=')
      GETURL[arg[0]] = decodeURIComponent(arg[1])
    }
  }
  return GETURL[prop] || ''
}
/**
 *
 * @param {*} phone
 */
export const payFilter = (phone) => {
  return new Promise((resolve, reject) => {
    if (getBaseEnvironment() === 'wx') {
      if (!phone) {
        reject()
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}
/**
 * 图片转化为base64
 * @param {*} url
 * @param {*} ext
 */
export const getBase64Url = (url, ext) => {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = url + '?v=' + new Date().getTime()
    img.onload = function () {
      try {
        canvas.height = img.height
        canvas.width = img.width
        ctx.drawImage(img, 0, 0, img.width, img.height) //参数可自定义
        let dataURL = canvas.toDataURL('image/' + ext)
        canvas = null
        resolve(dataURL)
      } catch (e) {
        reject(err)
      }
    }
  })
}
export const is_weixin = () => {
  const ua = navigator.userAgent
  return ua.toLowerCase().indexOf('micromessenger') > -1
}
/**
 * 页面打开环境（考虑是否用getAppVersion重写）
 */
export const getBaseEnvironment = () => {
  let environment
  let user_id = query('user_id') || ''
  if (is_weixin()) {
    environment = 'wx'
  } else if (user_id && (window.webkit || window.bridge)) {
    environment = 'app'
  } else {
    environment = 'other'
  }
  return environment
}
/**
 * 根据页面域名获取app_id相关信息
 */
export const checkEnv = () => {
  let app_info = {
    app_id: 'wx5ba7e61c94b8c010',
    wxpub_id: 1,
  }
  const host = window.location.host
  // 测试服务号
  if (host === 'ttools.hundun.cn' || host === 'tshare.hundun.cn') {
    app_info = {
      app_id: 'wx5ba7e61c94b8c010',
      wxpub_id: 1,
    }
  } else if (host === 'tools.hundun.cn' || host === 'share.hundun.cn') {
    // 主服务号
    app_info = {
      app_id: 'wxc6566e505e2a6872',
      wxpub_id: 1,
    }
  } else if (host === 'twebpage.hundun.cn') {
    // 测试服务号2
    app_info = {
      app_id: 'wx2c8deadfc0e3f2d9',
      wxpub_id: 2,
    }
  } else if (host === 'webpage.hundun.cn' || host === 'h5page.hundun.cn') {
    // 备用服务号1
    app_info = {
      app_id: 'wxd08b0483f730eead',
      wxpub_id: 2,
    }
  } else if (host === 'activity.hundun.com.cn') {
    // 备用服务号2
    app_info = {
      app_id: 'wx2c8deadfc0e3f2d9',
      wxpub_id: 3,
    }
  }
  return app_info
}
export const sendSa = (user_info) => {
  const channel_type = query('channel') || query('channel_type') || ''
  const share_uid = query('ambass_id') || query('share_uid') || ''
  const sale_channel = query('sale_channel') || ''
  const pid = query('pid') || ''
  const euler_id = query('euler_id') || ''
  const sku_list = user_info.sku_list
  const sku = sku_list.map(function (item) {
    return item.sku_mode
  })
  const community_id = user_info.community_id
  const is_yxs = sku.includes('yxs')
  const is_cxy = sku.includes('cxy')
  const is_sxy = sku.includes('sxy')
  const is_sxy19 = sku.includes('sxy19')
  const is_cxy19 = sku.includes('cxy19')
  const is_ofsxy = sku.includes('ofsxy')
  const is_cxxy = sku.includes('cxxy')
  const is_wlxy = sku.includes('is_wlxy')
  const is_zzxy = sku.includes('is_zzxy')
  const is_czxy = sku.includes('is_czxy')
  const event_params = user_info.event_params
  const os = navigator.userAgent.match(/Android/i) ? 'Android' : 'iOS'
  if (window.sa || typeof sa !== 'undefined') {
    sa.login(user_info.uid)
    sa.registerPage(
      Object.assign(event_params, {
        is_yxs,
        is_cxy,
        is_sxy,
        is_sxy19,
        is_cxy19,
        is_ofsxy,
        is_cxxy,
        is_wlxy,
        is_zzxy,
        is_czxy,
        client_type: 'h5',
        plat_type: `h5_${os}_h5`,
        pid,
        community_id,
        url: window.location.href,
        environment: getBaseEnvironment(),
        referrer: document.referrer,
        share_uid,
        channel_type,
        euler_id,
        sale_channel,
      })
    )
    sa.quick('autoTrack', {})
  }
}
