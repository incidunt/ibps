
/**
 * 简化版本的 backbone 的model
 *
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import _ from 'lodash'

const Model = function(attributes, options) {
  var attrs = attributes || {}
  options || (options = {})
  this.attributes = {}
  if (options.parse) attrs = this.parse(attrs, options) || {}
  attrs = _.defaults({}, attrs, _.result(this, 'defaults'))
  this.set(attrs, options)
  this.initialize.apply(this, arguments)
}

// Model prototype
_.extend(Model.prototype, {
  // Get the value of an attribute.
  get: function(attr) {
    return this.attributes[attr]
  },
  // Set a hash of model attributes on the object
  set: function(key, val, options) {
    var attr, attrs, option
    if (key == null) return this

    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (typeof key === 'object') {
      attrs = key
      options = val
    } else {
      (attrs = {})[key] = val
    }
    options || (options = {})

    var current = this.attributes
    for (attr in attrs) {
      current[attr] = attrs[attr]
    }
    if (!_.isEmpty(options)) {
      for (option in options) {
        current[option] = options[option]
      }
    }

    return this
  }

})

var extend = function(protoProps, staticProps) {
  var parent = this
  var child

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor
  } else {
    child = function() { return parent.apply(this, arguments) }
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps)

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function() { this.constructor = child }
  Surrogate.prototype = parent.prototype
  child.prototype = new Surrogate()

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps)

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype

  return child
}

Model.extend = extend

export default Model
