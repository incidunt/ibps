/**
 *中文转拼音帮助类
 *  推荐使用指令[v-pinyin ]进行中文转拼音
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import _camelcase from 'lodash.camelcase'
const Pinyin = require('pinyin4js/lib/PinyinHelper')
const PinyinHelper = Pinyin.PinyinHelper
const PinyinFormat = Pinyin.PinyinFormat

/**
 *  中文转拼音
 *
 * @param {*} obj 转换的对象
 * @param {*} options 参数
 *   name:要转换的拼音的key,默认是name
 *   key：转换后的拼音的key，默认是key
 *   format：转换的格式：
 *      WITH_TONE_MARK: "WITH_TONE_MARK", //带声调
 *      WITHOUT_TONE: "WITHOUT_TONE", //不带声调
 *      WITH_TONE_NUMBER: "WITH_TONE_NUMBER", //数字代表声调
 *      FIRST_LETTER: "FIRST_LETTER" //首字母风格 【默认】
 *   separator：字符间的分隔符
 *   notEmpty： 不为空转换
 *   filterSpecial：过滤特殊字符
 */
export default function(obj, options = {}) {
  options.name = options.name || 'name'
  options.key = options.key || 'key'
  options.notEmpty = options.notEmpty || true // 不为空转换
  if (options.notEmpty && obj[options.key] !== '') { return }
  const value = obj[options.name]
  if (value === '' || value == null || value === undefined) { return }

  obj[options.key] = convertToPinyin(value, options)
}

/**
 * 数据直接转换拼音
 * @param {*} value 转换值
 * @param {*} options 参数
 */
export const convertToPinyin = function(value, options = {}) {
  if (value === '' || value == null || value === undefined) { return }
  options.name = options.name || 'name'
  options.key = options.key || 'key'
  options.format = options.format || PinyinFormat.FIRST_LETTER
  options.camelCase = options.camelCase || false // 驼峰
  options.separator = options.separator || (options.camelCase ? ' ' : '')// 分隔符
  options.filterSpecial = options.filterSpecial || true // 过滤特殊字符
  options.separatorEnd = options.separatorEnd || false // 最后加分隔符
  // 过滤特殊字符
  if (options.filterSpecial) {
    value = stripSpechars(value)
  }
  let v = PinyinHelper.convertToPinyinString(value, options.separator, options.format)
  if (options.camelCase) { // 驼峰
    v = _camelcase(v)
  }
  if (options.separatorEnd) { // 最后加分隔符
    v = v + options.separator
  }

  return v
}

/**
 * 过滤特殊字符
 * @param {*} s 要过滤的字符串
 */
export const stripSpechars = function(s) {
  const pattern = new RegExp("[\\\\`~!@#$^&*%()=_\\-|{}':;',\\[\\].<>/?~！@#￥……&*（）;—+|{}【】｛｝《》\"‘’；：”“'。，、？]")
  let rs = ''
  for (let i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '')
  }
  return rs
}
