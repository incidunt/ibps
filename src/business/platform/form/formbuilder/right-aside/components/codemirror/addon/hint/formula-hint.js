/* eslint-disable brace-style */
/* eslint-disable no-undef */
/* eslint-disable no-sequences */
/**
 * 重写公式计算
 * @param {Object} mod
 */
(function(mod) {
  if (typeof exports === 'object' && typeof module === 'object') // CommonJS
  { mod(require('codemirror/lib/codemirror')) }
  else if (typeof define === 'function' && define.amd) // AMD
  { define(['codemirror/lib/codemirror'], mod) }
  else // Plain browser env
  { mod(CodeMirror) }
})(function(CodeMirror) {
  'use strict'
  var Pos = CodeMirror.Pos

  function getKeywords(keyword, b) {
    for (var c = 0, d = keyword.length; c < d; ++c) {
      b(keyword[c])
    }
  }

  /**
   * 判断元素item是否存在数组arr中
   * @param {Object} arr
   * @param {Object} item
   */
  function arrayContains(arr, item) { // 判断元素item是否存在数组arr中
    if (!Array.prototype.indexOf) {
      var i = arr.length
      while (i--) {
        if (arr[i] === item) {
          return true
        }
      }
      return false
    }
    return arr.indexOf(item) !== -1
  }

  function velocityHint(editor, keywords, tableKeywords, getToken, options) { // 处理hint的核心函数，改名为velocityHint(也可以不做修改)
    // Find the token at the cursor，获取当前光标指定的字符串
    var cur = editor.getCursor()

    var token = getToken(editor, cur)

    if (!/\b(?:string)\b/.test(token.type)) {
      token.state = CodeMirror.innerMode(editor.getMode(), token.state).state,

      /^[\w$_]*$/.test(token.string) ? token.end > cur.ch && (token.end = cur.ch,

      token.string = token.string.slice(0, cur.ch - token.start)) : token = {
        start: cur.ch,
        end: cur.ch,
        string: '',
        state: token.state,
        type: token.string === '.' ? 'property' : null
      }
      var k = []
      // 解决点的问题
      if (token.type === 'property') {
        var tk = getToken(editor, Pos(cur.line, token.start))
        if (tk.string !== '.') {
          k.push(tk)
        }
      }
      return {
        list: getCompletions(token, k, keywords, options), // 返回匹配的列表
        from: Pos(cur.line, token.start), // 字符串拼接的初始位置
        to: Pos(cur.line, token.end) // 字符串拼接的结束位置
      }
    }
  }

  function formulaHint(editor, options) {
    var keywords = CodeMirror.keywords
    return velocityHint(editor, keywords, CodeMirror.tableKeywords, function(e, cur) {
      return e.getTokenAt(cur)
    }, options)
  }

  function getCompletions(a, d, e, f) {
    var h = []

    var i = a.string.toUpperCase()

    function g(a) {
      a.lastIndexOf(i, 0) !== 0 || arrayContains(h, a) || h.push(a)
    }

    return i ? (d && d.length ? d.pop() : getKeywords(e, g), h) : h
  }
  CodeMirror.registerHelper('hint', 'formula', formulaHint)
})
