export default {
  // 用户相关
  userId: state => state.ibps.user.info && state.ibps.user.info.user ? state.ibps.user.info.user.id : '', // 用户ID
  name: state => state.ibps.user.info && state.ibps.user.info.employee ? state.ibps.user.info.employee.name : '', // 姓名
  status: state => state.ibps.user.info && state.ibps.user.info.employee ? state.ibps.user.info.employee.status : '', // 用户状态
  isSuper: state => state.ibps.user.info && state.ibps.user.info.user ? state.ibps.user.info.user.isSuper === 'Y' : false, // 是否超级管理员
  account: state => state.ibps.user.info && state.ibps.user.info.employee ? state.ibps.user.info.employee.account : '', // 用户名

  regOpen: state => state.ibps.user.regOpen, // 注册状态

  userInfo: state => state.ibps.user.info, // 用户信息

  // ===========菜单
  menus: state => state.ibps.menu.menus, // 菜单
  routers: state => state.ibps.menu.routers, // 新增的路由表
  system: state => state.ibps.system.system, // 子系统
  permissions: state => state.ibps.menu.permissions, //  拥有的权限

  // ============ 表单
  form: state => state.ibps.form
}
