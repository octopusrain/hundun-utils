# hundun-utils 混沌 h5 常用工具方法

## usage

### install

`yarn add hundun-utils --save-dev`
or
`npm install hundun-utils -S`

### use

模块化按需引入，为了 tree-shake,工具库默认打包出来到 es 模块，非 umd

```
import {
getUserBaseInfo,
hdLog,
direct,
appApi,
query,
getBaseEnvironment,
payFilter,
checkVersion,
getBase64Url,
} from 'hundun-utils'

```

```
await Promise.all([hdLog.saInit(),hdLog.sentryInit()])
const userInfo = await getUserBaseInfo(query('user_id'))
```

#### tips

1. **getUserBaseInfo** 来源于原来 hd-sdk get_user_base_info 支持参数:

```
   user_id@string default:''
   channel@string default:''
   web_host@string default:process.env.WEB_HOST
   user_host@string default:process.env.USER_HOST
```

2. **hdLog** 提供两个方法: **saInit**,**sentryInit** 同 hd-sdk 原方法 sa_init,sentry_init

3. **direct** 提供指令: **directiveCountDown** 倒计时指令 **touchFix** ios 滚动穿透指令

4. **appApi** 提供 app 交互常用方法
   - **getVersionName** 获取版本号 params：none
   - **sharewx** 分享
   - **shareImg**, 分享图片弹出选择模式
   - **shareImgWx**, 分享图片直接到微信好友
   - **shareImgCircle**, 分享图片直接到微信朋友圈
   ##### 以上分享方法同原来 hd-sdk
   - **paySku** ( sku 支付) params 如下：

```
      sku_mode, 必须
      url = '', 成功回调，h5地址
      pay_callback_page_url = '', // 成功回调 app路由，一般会拼在url上，优先级高于url
      other_parameter = '' // 其它补充参数
```

- **paySku2Group**, sku2 人团支付
- **paySku3Group**, sku3 人团支付 params:

```
      sku_mode, 必须
      url = '', 成功回调，h5地址
      group_id 必须 团id
      pay_callback_page_url = '', // 成功回调 app路由，一般会拼在url上，优先级高于url
      other_parameter = '' // 其它补充参数
```

5. 工具类方法
   - **query**, // 获取 url 参数
   - **getBaseEnvironment**, // 获取页面环境 value:wx,app,other
   - **payFilter**, // 支付前的判断，示例：
     `payFilter(phone).then(()=>pay()).catch(()=>login())`
   - **checkVersion**, // 判断版本号 params: curVersion,tarVersion
   - **getBase64Url**, // 将图片链接转成 base64,常用于截图 params: img_url
