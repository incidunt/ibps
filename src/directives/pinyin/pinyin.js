
import pinyin from '@/utils/pinyin'
import { once } from 'element-ui/src/utils/dom'

/**
 * 绑定pinyin指令
 * @param {*} el
 * @param {*} binding
 * @param {*} vnod
 */
const bindPinyin = function(el, binding, vnod) {
  const { value } = binding
  const { vm, py, config = {}, callback } = value
  const isInput = (e) => {
    return e.tagName.toLocaleLowerCase() === 'input'
  }
  let inputEl = el
  if (!isInput(inputEl) && inputEl.children && inputEl.children.length > 0) {
    inputEl = inputEl.children[0]
    if (!isInput(inputEl) && inputEl.children && inputEl.children.length > 0) {
      inputEl = inputEl.children[0]
    }
  }
  once(inputEl, 'blur', (e) => {
    if (py && py.length > 0 && py instanceof Array) {
      py.forEach(o => {
        const op = JSON.parse(JSON.stringify(config))
        const option = JSON.parse(JSON.stringify(Object.assign(op, o)))
        pinyin(vm, option)
      })
    } else {
      pinyin(vm, value)
    }
    if (callback) {
      callback(vm)
    }
  })
}

/**
 * v-pinyin
 *
 * eg.:
 *  vm: 【必填】表单要拼音的对象
 *  py：【选填】[多个对象有效] 如果要转换多个多个对象 py 是个数组，如果不是直接使用就行了
 *  config：【选填】[多个对象有效]默认配置，多个配置用这个配置
 *  callback:回调
 */
export default {
  inserted(el, binding, vnode) {
    bindPinyin(el, binding, vnode)
  },
  update(el, binding, vnode) {
    bindPinyin(el, binding, vnode)
  }
}
