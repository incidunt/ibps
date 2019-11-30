
/**
 * 表单--封装自定义代码扩展接口
 *
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2017-10-01-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import _ from 'lodash'
// 定义全局
var JForm
if (!window.JForm) {
  JForm = window.JForm = {}
} else {
  JForm = window.JForm
}
/**
   * 封装自定义代码扩展接口
   */
_.extend(JForm, {
  // 已经初始化
  _isInitialization: false,
  _isLoadJavaScriptFile: false,
  // 初始化表单
  _init: function(self, form) {
    if (this._isInitialization) return
    this.self = self
    this.form = form

    this._isInitialization = true
  },

  // 表单加载
  _onLoad: function(self, form) {
    // if (Utils.isNotEmpty(this.javaScriptFiles)) {
    //   this._loadJavaScriptFile()
    // }
    if (_.isFunction(this.onLoad)) {
      this._init(self, form)
      this.onLoad(self, form)
    }
  },

  // 加载按钮
  _onLoadActions: function(form, actions) {
    if (_.isFunction(this.onLoadActions)) {
      this.onLoadActions(form, actions)
    }
  },

  // 表单校验
  _onValidate: function(self, form, actionControl) {
    if (_.isFunction(this.onValidate)) {
      return this.onValidate(form, actionControl)
    }
    return true
  },

  // 提交前事件
  _beforeSubmit: function(form, action, postData) {
    if (_.isFunction(this.beforeSubmit)) {
      return this.beforeSubmit(action, postData, form)
    }
  },

  // 提交后事件
  _afterSubmit: function(form, action, postData) {
    if (_.isFunction(this.afterSubmit)) {
      return this.afterSubmit(action, postData, form)
    }
  },
  // 子表按钮的提交前事件
  _beforeSubButton: function(form, action, position, params) {
    if (_.isFunction(this.beforeSubButton)) {
      return this.beforeSubButton(action, position, params, form)
    }
  },
  // 子表按钮的提交后事件
  _afterSubButton: function(form, action, position, params) {
    if (_.isFunction(this.afterSubButton)) {
      return this.afterSubButton(action, position, params, form)
    }
  },
  // 清理所有自定义事件
  cleanEvents: function() {
    this.onLoad = null
    this.onLoadActions = null
    this.onValidate = null
    this.afterSubButton = null
    this.beforeSubButton = null
    this._isInitialization = false
  }
})

export default JForm
