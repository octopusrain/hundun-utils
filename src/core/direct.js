import { formatTime } from '../utils'
/**
 * 指令：倒计时
 */
export const directiveCountDown = {
  inserted: (el, binding, vnode) => {
    const defaultTime = binding.value || 0
    let countDownTime = defaultTime

    if (typeof countDownTime !== 'number') return

    const timerTask = () => {
      if (countDownTime > 0) {
        el.innerHTML = formatTime(countDownTime)
        countDownTime -= 1
      } else {
        timer && clearInterval(timer)
        setTimeout(() => {
          window.location.reload()
        }, 800)
      }
    }
    timerTask()
    const timer = setInterval(() => {
      timerTask()
    }, 1000)

    directiveCountDown.timer = timer
  },
  unbind: (el, binding, vnode) => {
    clearInterval(directiveCountDown.timer)
  },
}
// ios滚动穿透问题解决指令
export const touchFix = {
  bind: function (el, binding, vnode) {
    el.addEventListener(
      'touchmove',
      (e) => {
        // 滚动容器阻止冒泡，因此是否prevent由当前函数决定
        e.stopPropagation()
        let scrollEl = e.currentTarget
        // 判定当前滚动容器是否可以滚动
        if (scrollEl.scrollHeight <= scrollEl.offsetHeight) {
          // 不能滚动的时候依然需要阻止滚动穿透
          e.preventDefault()
        }
      },
      false
    )
  },
}
export default {
  directiveCountDown,
  touchFix,
}
