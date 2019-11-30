
/**
 * 作用域
 */
export const scopeTypeOptions = [
  {
    value: 'sso',
    label: '单点登录'
  },
  {
    value: 'api',
    label: 'API调用'
  }
]
/**
 * 授权类型
 */
export const grantTypeOptions = [
  {
    value: 'code',
    label: '授权码'
  },
  {
    value: 'password',
    label: '密码'
  }
]
/**
 * 状态
 */
export const statusTypeOptions = [
  {
    value: 'pendding',
    label: '待审核',
    type: 'warning'
  }, {
    value: 'nopass',
    label: '不通过',
    type: 'danger'
  }, {
    value: 'effect',
    label: '生效',
    type: 'success'
  }, {
    value: 'expired',
    label: '过期',
    type: 'info'
  }
]

/**
 * 授权类型
 */
export const grantTypes = [
  {
    value: 'client',
    label: '授权客户端',
    type: 'danger'
  },
  {
    value: 'user',
    label: '授权用户',
    type: 'success'
  }
]

