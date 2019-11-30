import store from '@/store'
/**
 * v-permission
 * 按钮级别权限
 */
export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    // 是否是超级用户
    const isSuper = store.getters && store.getters.isSuper
    if (!value || isSuper) return
    const { disabled } = el
    const permissions = store.getters && store.getters.permissions
    if (value && value.length > 0 && (value instanceof Array || Object.prototype.toString.call(value) === '[object String]')) {
      let hasPermission = false
      const permissionValue = value
      if (value instanceof Array) {
        hasPermission = permissionValue.some(v => {
          return permissions[v]
        })
      } else {
        hasPermission = permissions[permissionValue]
      }

      // 另外以上几种都是如何声明组件所需权限，而如果登录用户没有这个权限，则组件将会被隐藏，
      // TODO 但是也可以使用下面的配置让组件变为半透明且不可用点击
      if (!hasPermission) {
        if (!disabled) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
