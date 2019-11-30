/* Modified from https://github.com/taylorhakes/fecha
 * v3.0.3
 * hugh zhuang  把 YYYY-MM-DD 改成了 yyyy-MM-dd  与java后台 统一格式
 * 备注：未支持多个国际化，该代码参考element-ui的日期帮助类
 *      增加日期格式处理
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Taylor Hakes
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 *     The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 *     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var fecha = {}
// zxh 修改
var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g
var twoDigits = '\\d\\d?'
var threeDigits = '\\d{3}'
var fourDigits = '\\d{4}'
var word = '[^\\s]+'
var literal = /\[([^]*?)\]/gm
var noop = function() {}

function regexEscape(str) {
  return str.replace(/[|\\{()[^$+*?.-]/g, '\\$&')
}

function shorten(arr, sLen) {
  var newArr = []
  for (var i = 0, len = arr.length; i < len; i++) {
    newArr.push(arr[i].substr(0, sLen))
  }
  return newArr
}

function monthUpdate(arrName) {
  return function(d, v, i18n) {
    var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase())
    if (~index) {
      d.month = index
    }
  }
}

function pad(val, len) {
  val = String(val)
  len = len || 2
  while (val.length < len) {
    val = '0' + val
  }
  return val
}

var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var monthNamesShort = shorten(monthNames, 3)
var dayNamesShort = shorten(dayNames, 3)
fecha.i18n = {
  dayNamesShort: dayNamesShort,
  dayNames: dayNames,
  monthNamesShort: monthNamesShort,
  monthNames: monthNames,
  amPm: ['am', 'pm'],
  DoFn: function DoFn(D) {
    return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10]
  }
}

var formatFlags = {
  D: function(dateObj) { // zxh  getDate 修改为 getDay
    return dateObj.getDay()
  },
  DD: function(dateObj) { // zxh  getDate 修改为 getDay
    return pad(dateObj.getDay())
  },
  Do: function(dateObj, i18n) {
    return i18n.DoFn(dateObj.getDate())
  },
  d: function(dateObj) { // zxh  getDay 修改为 getDate
    return dateObj.getDate()
  },
  dd: function(dateObj) { // zxh  getDay 修改为 getDate
    return pad(dateObj.getDate())
  },
  ddd: function(dateObj, i18n) {
    return i18n.dayNamesShort[dateObj.getDay()]
  },
  dddd: function(dateObj, i18n) {
    return i18n.dayNames[dateObj.getDay()]
  },
  M: function(dateObj) {
    return dateObj.getMonth() + 1
  },
  MM: function(dateObj) {
    return pad(dateObj.getMonth() + 1)
  },
  MMM: function(dateObj, i18n) {
    return i18n.monthNamesShort[dateObj.getMonth()]
  },
  MMMM: function(dateObj, i18n) {
    return i18n.monthNames[dateObj.getMonth()]
  },
  yy: function(dateObj) { // zxh 修改 YY  修改为 yy
    return pad(String(dateObj.getFullYear()), 4).substr(2)
  },
  yyyy: function(dateObj) { // zxh 修改 YYYY  修改为 yyyy
    return pad(dateObj.getFullYear(), 4)
  },
  h: function(dateObj) {
    return dateObj.getHours() % 12 || 12
  },
  hh: function(dateObj) {
    return pad(dateObj.getHours() % 12 || 12)
  },
  H: function(dateObj) {
    return dateObj.getHours()
  },
  HH: function(dateObj) {
    return pad(dateObj.getHours())
  },
  m: function(dateObj) {
    return dateObj.getMinutes()
  },
  mm: function(dateObj) {
    return pad(dateObj.getMinutes())
  },
  s: function(dateObj) {
    return dateObj.getSeconds()
  },
  ss: function(dateObj) {
    return pad(dateObj.getSeconds())
  },
  S: function(dateObj) {
    return Math.round(dateObj.getMilliseconds() / 100)
  },
  SS: function(dateObj) {
    return pad(Math.round(dateObj.getMilliseconds() / 10), 2)
  },
  SSS: function(dateObj) {
    return pad(dateObj.getMilliseconds(), 3)
  },
  a: function(dateObj, i18n) {
    return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1]
  },
  A: function(dateObj, i18n) {
    return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase()
  },
  ZZ: function(dateObj) {
    var o = dateObj.getTimezoneOffset()
    return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
  }
}

var parseFlags = {
  d: [twoDigits, function(d, v) { // zxh D 修改为 d
    d.day = v
  }],
  Do: [twoDigits + word, function(d, v) {
    d.day = parseInt(v, 10)
  }],
  M: [twoDigits, function(d, v) {
    d.month = v - 1
  }],
  yy: [twoDigits, function(d, v) { // zxh YY 修改 yy
    var da = new Date(); var cent = +('' + da.getFullYear()).substr(0, 2)
    d.year = '' + (v > 68 ? cent - 1 : cent) + v
  }],
  h: [twoDigits, function(d, v) {
    d.hour = v
  }],
  m: [twoDigits, function(d, v) {
    d.minute = v
  }],
  s: [twoDigits, function(d, v) {
    d.second = v
  }],
  // zxh  YY 修改yy
  yyyy: [fourDigits, function(d, v) {
    d.year = v
  }],
  S: ['\\d', function(d, v) {
    d.millisecond = v * 100
  }],
  SS: ['\\d{2}', function(d, v) {
    d.millisecond = v * 10
  }],
  SSS: [threeDigits, function(d, v) {
    d.millisecond = v
  }],
  // zxh d 修改为 D
  D: [twoDigits, noop],
  ddd: [word, noop],
  MMM: [word, monthUpdate('monthNamesShort')],
  MMMM: [word, monthUpdate('monthNames')],
  a: [word, function(d, v, i18n) {
    var val = v.toLowerCase()
    if (val === i18n.amPm[0]) {
      d.isPm = false
    } else if (val === i18n.amPm[1]) {
      d.isPm = true
    }
  }],
  ZZ: ['[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z', function(d, v) {
    var parts = (v + '').match(/([+-]|\d\d)/gi)
    var minutes

    if (parts) {
      minutes = +(parts[1] * 60) + parseInt(parts[2], 10)
      d.timezoneOffset = parts[0] === '+' ? minutes : -minutes
    }
  }]
}
parseFlags.dd = parseFlags.d
parseFlags.dddd = parseFlags.ddd
parseFlags.DD = parseFlags.D
parseFlags.mm = parseFlags.m
parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h
parseFlags.MM = parseFlags.M
parseFlags.ss = parseFlags.s
parseFlags.A = parseFlags.a

// Some common format strings
// zxh 修改
fecha.masks = {
  default: 'yyyy-MM-dd HH:mm:ss',
  shortDate: 'yy-MM-dd',
  mediumDate: 'MMM d, yyyyy',
  longDate: 'MMMM d, yyyy',
  fullDate: 'dddd, MMMM d, yyyy',
  shortTime: 'HH:mm',
  mediumTime: 'HH:mm:ss',
  longTime: 'HH:mm:ss.SSS'
}

/** *
 * Format a date
 * @method format
 * @param {Date|number} dateObj
 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
 */
fecha.format = function(dateObj, mask, i18nSettings) {
  var i18n = i18nSettings || fecha.i18n

  if (typeof dateObj === 'number') {
    dateObj = new Date(dateObj)
  }

  if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
    throw new Error('Invalid Date in fecha.format')
  }

  mask = fecha.masks[mask] || mask || fecha.masks['default']

  var literals = []

  // Make literals inactive by replacing them with ??
  mask = mask.replace(literal, function($0, $1) {
    literals.push($1)
    return '@@@'
  })
  // Apply formatting rules
  mask = mask.replace(token, function($0) {
    return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1)
  })
  // Inline literal values back into the formatted value
  return mask.replace(/@@@/g, function() {
    return literals.shift()
  })
}

/**
 * Parse a date string into an object, changes - into /
 * @method parse
 * @param {string} dateStr Date string
 * @param {string} format Date parse format
 * @returns {Date|boolean}
 */
fecha.parse = function(dateStr, format, i18nSettings) {
  var i18n = i18nSettings || fecha.i18n

  if (typeof format !== 'string') {
    throw new Error('Invalid format in fecha.parse')
  }

  format = fecha.masks[format] || format

  // Avoid regular expression denial of service, fail early for really long strings
  // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
  if (dateStr.length > 1000) {
    return null
  }

  var dateInfo = {}
  var parseInfo = []
  var literals = []
  format = format.replace(literal, function($0, $1) {
    literals.push($1)
    return '@@@'
  })
  var newFormat = regexEscape(format).replace(token, function($0) {
    if (parseFlags[$0]) {
      var info = parseFlags[$0]
      parseInfo.push(info[1])
      return '(' + info[0] + ')'
    }

    return $0
  })
  newFormat = newFormat.replace(/@@@/g, function() {
    return literals.shift()
  })
  var matches = dateStr.match(new RegExp(newFormat, 'i'))
  if (!matches) {
    return null
  }

  for (var i = 1; i < matches.length; i++) {
    parseInfo[i - 1](dateInfo, matches[i], i18n)
  }

  var today = new Date()
  if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
    dateInfo.hour = +dateInfo.hour + 12
  } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
    dateInfo.hour = 0
  }

  var date
  if (dateInfo.timezoneOffset != null) {
    dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset
    date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
      dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0))
  } else {
    date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
      dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0)
  }
  return date
}
/**
 * 格式化当前时间
 */
fecha.formatDate = function(format = fecha.masks.default, i18nSettings) {
  return fecha.format(new Date(), format, i18nSettings)
}

/**
 * 格式当前时间
 */
fecha.parseDate = function(format = fecha.masks.default, i18nSettings) {
  return fecha.parse(fecha.formatDate(format, i18nSettings), format, i18nSettings)
}

/**
 * 相对时间字符串
 * @param {String|Number} time 时间格式字符串，或者时间
 * @returns {String} 相对时间字符串
 */
fecha.getRelativeTime = function(time, format = {}, i18nSettings) {
  if (!i18nSettings) {
    i18nSettings = function() {}
  }
  if (!time || time === null) return ''
  let date
  if (Object.prototype.toString.call(time) === '[object Date]') {
    date = time
  } else {
    date = !isNaN(time) ? new Date(time) : fecha.parse(time, format['orig'] || fecha.masks.default)
  }
  const timeStamp = date.getTime()
  // 获取当前时间时间戳
  const currentTime = (new Date()).getTime()

  // 判断传入时间戳是否早于当前时间戳
  const IS_EARLY = timeStamp <= currentTime
  // 获取两个时间戳差值
  let diff = currentTime - timeStamp
  // 如果IS_EARLY为false则差值取反
  if (!IS_EARLY) diff = -diff
  let resStr = ''
  const dirStr = IS_EARLY ? (i18nSettings('ibps.time.before') || '前') : (i18nSettings('ibps.time.after') || '后')

  if (diff < 1000) {
    resStr = i18nSettings('ibps.time.just') || '刚刚'
  } else if (diff < 60000) {
    // 少于等于59秒
    resStr = parseInt(diff / 1000) + (i18nSettings('ibps.time.seconds') || '秒') + dirStr
  } else if (diff >= 60000 && diff < 3600000) {
    // 多于59秒，少于等于59分钟59秒
    resStr = Math.floor(diff / 60000) + (i18nSettings('ibps.time.minutes') || '分钟') + dirStr
  } else if (diff >= 3600000 && diff < 86400000) {
    // 多于59分钟59秒，少于等于23小时59分钟59秒
    resStr = Math.floor(diff / 3600000) + (i18nSettings('ibps.time.hours') || '小时') + dirStr
  } else if (diff >= 86400000 && diff < 2623860000) {
    // 多于23小时59分钟59秒，少于等于29天59分钟59秒
    resStr = Math.floor(diff / 86400000) + (i18nSettings('ibps.time.days') || '天') + dirStr
  } else if (diff >= 2623860000 && diff <= 31567860000 && IS_EARLY) {
    // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
    resStr = fecha.format(timeStamp, format['day'] || 'MM-dd HH:mm')
  } else {
    resStr = fecha.format(timeStamp, format['year'] || fecha.masks.default)
  }
  return resStr
}

export const DateDealFmt = {
  $dp: {
    has: {}
  },
  dealFmt: function(dateStr, dateFmt) {
    if (dateStr === '' || dateStr === null || dateStr === undefined) { return null }
    if (dateStr.length !== dateFmt.length) { // 格式化日期不相同
      const date = new Date(dateStr.replace(/-/g, '/'))
      if (!isNaN(date.getTime())) {
        return date
      } else { // IE
        const mydate = dateStr.slice(0, dateStr.indexOf('.'))// 去掉毫秒数
        return new Date(mydate.replace(/-/g, '/'))
      }
    }

    this.$dp.dateFmt = dateFmt
    this._setHas(/w/)
    this._setHas(/WW|W/)
    this._setHas(/DD|D/)
    this._setHas(/yyyy|yyy|yy|y/)
    this._setHas(/MMMM|MMM|MM|M/)
    this._setHas(/dd|d/)
    this._setHas(/HH|H/)
    this._setHas(/mm|m/)
    this._setHas(/ss|s/)

    const date = new Date()
    for (const p in this.$dp.has) {
      const has = this.$dp.has[p]
      if (has != null) {
        const val = parseInt(dateStr.substring(has.index, has.index + has[0].length), 10)
        if (p === 'y') { date.setYear(val) }
        if (p === 'M') { date.setMonth(val - 1) }
        if (p === 'd') { date.setDate(val) }
        if (p === 'H') { date.setHours(val) }
        if (p === 'm') { date.setMinutes(val) }
        if (p === 's') { date.setSeconds(val) }
      }
    }
    return date
  },
  _setHas: function(re) {
    this.$dp.has[ (re + '').slice(1, 2)] = re.exec(this.$dp.dateFmt)
  }
}

export default fecha
