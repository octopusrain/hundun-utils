/**
 * 获取app版本号，判断是否为app环境
 */
export const getVersionName = () => {
  return new Promise((resolve, reject) => {
    window.showVersion = (v) => {
      if (!v) {
        reject('请在app打开或升级app版本')
      } else {
        resolve(v)
      }
    }
    // 判断是android还是ios
    if (navigator.userAgent.match(/Android/i)) {
      // android通过alert事件通知app
      if (window.bridge) {
        window.bridge.getAppVersion('showVersion')
      } else {
        reject('请在app打开或升级app版本')
      }
    } else {
      // ios
      if (window.webkit) {
        return window.webkit.messageHandlers['getAppVersion'].postMessage({
          callback: 'showVersion',
        })
      } else {
        reject('请在app打开或升级app版本')
      }
    }
  })
}
/**
 *  微信分享
 *  @params 分享4件套
 */
export const sharewx = (options, callback) => {
  window.sharecallback = (actionId, status) => {
    callback && callback(actionId, status)
  }
  let json_data = {
    url: options.url,
    content: options.content,
    title: options.title,
    thumbUrl: options.thumbUrl || options.logo,
    thumbnail: options.thumbUrl || options.logo,
    shareActionId: options.shareActionId || '',
    media: 'select',
    path: '',
    userName: '',
    imgBase64: '',
    callback: 'sharecallback',
  }
  if (window.bridge) {
    // android
    return Promise.resolve(
      window.bridge.shareWX(
        json_data.url,
        json_data.content,
        json_data.title,
        json_data.thumbUrl,
        json_data.shareActionId,
        json_data.media,
        json_data.path,
        json_data.userName,
        '',
        json_data.callback
      )
    )
  } else if (window.webkit) {
    // ios
    return Promise.resolve(
      window.webkit.messageHandlers['shareWX'].postMessage(json_data)
    )
  } else {
    // weixin 或 浏览器
    return Promise.reject('当前环境不支持分享')
  }
}
/**
 *  微信分享图片
 *  @params {String} img_url
 */
export const shareImg = (img_url, callback) => (media = 'select') => {
  let json_data
  window.sharecallback = (actionId, status) => {
    callback && callback(actionId, status)
  }
  // 判断是否是base64图片
  if (img_url.indexOf('http') > -1 && img_url.indexOf('base64') == -1) {
    json_data = {
      url: img_url,
      content: '',
      title: '',
      thumbUrl: '',
      shareActionId: '',
      media,
      path: '',
      userName: '',
      imgBase64: '',
      callback: 'sharecallback',
    }
  } else {
    // base64
    json_data = {
      url: '',
      content: '',
      title: '',
      thumbUrl: '',
      shareActionId: '',
      media,
      path: '',
      userName: '',
      imgBase64: img_url,
      callback: 'sharecallback',
    }
  }
  if (window.bridge) {
    // android
    return Promise.resolve(
      window.bridge.shareWX(
        json_data.url,
        json_data.content,
        json_data.title,
        json_data.thumbUrl,
        json_data.shareActionId,
        json_data.media,
        json_data.path,
        json_data.userName,
        json_data.imgBase64,
        json_data.callback
      )
    )
  } else if (window.webkit) {
    // ios
    return Promise.resolve(
      window.webkit.messageHandlers['shareWX'].postMessage(json_data)
    )
  } else {
    // weixin 或 浏览器
    return Promise.reject('当前环境不支持分享')
  }
}
/**
 * 微信分享图片
 */
export const shareImgWx = (img_url, callback) =>
  shareImg(img_url, callback)('weixin')
/**
 * 微信分享图片到朋友圈
 */
export const shareImgCircle = (img_url, callback) =>
  shareImg(img_url, callback)('circle')
/**
 *  sku支付 url支付成功app回调url(h5链接)
 *  pay_callback_page_url（app路由）
 *  @params {String} sku_mode
 *  @params {String} url
 *  @params {String} pay_callback_page_url
 */
export const paySku = (
  sku_mode,
  url = '',
  pay_callback_page_url = '',
  other_parameter = ''
) => (join_type = '0', group_id = '') => {
  const app_channel = query('app_channel') || ''
  // v2.23.0新增
  const json_data = {
    order_type: sku_mode,
    join_type,
    use_yxs_month: '0',
    url,
    pay_callback_page_url,
    app_channel,
    group_id,
    other_parameter,
  }
  if (window.webkit) {
    return Promise.resolve(
      window.webkit.messageHandlers['payHDCommon'].postMessage(json_data)
    )
  } else if (window.bridge) {
    return Promise.resolve(
      window.bridge.payHDCommonResult(
        json_data.order_type,
        json_data.join_type,
        json_data.use_yxs_month,
        json_data.pay_callback_page_url || json_data.url,
        json_data.app_channel,
        json_data.group_id,
        json_data.other_parameter
      )
    )
  } else {
    return Promise.reject('当前环境不支持')
  }
}
/**
 * 2人团
 * @param {*} sku_mode
 * @param {*} url
 * @param {*} group_id
 * @param {*} pay_callback_page_url
 * @param {*} other_parameter
 */
export const paySku2Group = (
  sku_mode,
  url = '',
  group_id,
  pay_callback_page_url = '',
  other_parameter = ''
) =>
  paySku(sku_mode, url, pay_callback_page_url, other_parameter)('8', group_id)
/**
 * 3人团
 * @param {*} sku_mode
 * @param {*} url
 * @param {*} group_id
 * @param {*} pay_callback_page_url
 * @param {*} other_parameter
 */
export const paySku3Group = (
  sku_mode,
  url = '',
  group_id,
  pay_callback_page_url = '',
  other_parameter = ''
) =>
  paySku(sku_mode, url, pay_callback_page_url, other_parameter)('1', group_id)

export default {
  getVersionName,
  sharewx,
  shareImg,
  shareImgWx,
  shareImgCircle,
  paySku,
  paySku2Group,
  paySku3Group,
}
