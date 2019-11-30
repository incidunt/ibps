/**
 * 菜单处理帮助类
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
// 常量
const menuUtil = {
  ID_KEY: 'id',
  PARENT_KEY: 'parentId',
  CHILD_KEY: 'children',
  LEVEL_KEY: 'level',
  NAME_KEY: 'alias',
  LABEL_KEY: 'name',
  PATH_KEY: 'path',
  OPEN_KEY: 'open', // 打开新窗口
  ICON_KEY: 'icon',
  URL_KEY: 'defaultUrl'
}

/**
 * 转换成树结构
 * @param {*} sNodes
 */
menuUtil.transformToTreeFormat = function(sNodes) {
  if (sNodes == null || sNodes === undefined || sNodes.length === 0) {
    return []
  }
  const node = menuUtil.transformToArrayFormat(sNodes)
  // 设置层级
  for (let i = 0; i < node.length; i++) {
    menuUtil.setSonNodeLevel(null, node[i])
  }
  return node
}

/**
 * 转换成数组结构
 * @param {*} sNodes
 */
menuUtil.transformToArrayFormat = function(sNodes) {
  let i, l
  if (!this.ID_KEY || this.ID_KEY === '' || !sNodes) { return [] }
  if (sNodes instanceof Array) {
    const r = []
    const tmpMap = []
    for (i = 0, l = sNodes.length; i < l; i++) {
      tmpMap[sNodes[i][this.ID_KEY]] = sNodes[i]
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      if (tmpMap[sNodes[i][this.PARENT_KEY]] &&
							sNodes[i][this.ID_KEY] !== sNodes[i][this.PARENT_KEY]) {
        if (!tmpMap[sNodes[i][this.PARENT_KEY]][this.CHILD_KEY]) { tmpMap[sNodes[i][this.PARENT_KEY]][this.CHILD_KEY] = [] }
        tmpMap[sNodes[i][this.PARENT_KEY]][this.CHILD_KEY].push(sNodes[i])
      } else {
        r.push(sNodes[i])
      }
    }

    return r
  } else {
    return [sNodes]
  }
}

/**
 * 设置儿子节点等级
 * @param {*} parentNode
 * @param {*} node
 */
menuUtil.setSonNodeLevel = function(parentNode, node) {
  if (!node) return
  node[this.LEVEL_KEY] = parentNode ? parentNode[this.LEVEL_KEY] + 1 : 0
  node[this.PATH_KEY] = node[this.OPEN_KEY] && isHttp(node[this.URL_KEY]) ? node[this.URL_KEY] : (parentNode ? parentNode[this.PATH_KEY] : '') + '/' + node[this.NAME_KEY]
  if (!node[this.CHILD_KEY]) { return }
  for (let i = 0, l = node[this.CHILD_KEY].length; i < l; i++) {
    if (node[this.CHILD_KEY][i]) { menuUtil.setSonNodeLevel(node, node[this.CHILD_KEY][i]) }
  }
}

/**
 * 是否是http
 * @param {*} url
 */
function isHttp(url) {
  if (url === null || url === undefined || url === '') return false
  return !!(url.indexOf('http') !== -1 || url.indexOf('https') !== -1)
}

// ===============导航菜单处理================================
/**
 * 获取导航菜单
 * @param {*} menuList
 */
menuUtil.getHeaderMenus = function(menuList) {
  const headerMenus = []
  for (const menu of menuList) {
    const m = {}
    Object.assign(m, menu)
    m.children = null
    headerMenus.push(m)
  }
  return headerMenus
}
/**
 * 获取当前激活的导航菜单
 * @param {*} navMenus
 */
menuUtil.getActiveHeaderMenu = function(headerMenus, activeHeader) {
  // 首先取缓存
  if (activeHeader === 0 || activeHeader == null) {
    activeHeader = headerMenus[0].id
  }
  return activeHeader
}
/**
 * 获取当前激活的侧边栏
 * @param {*} menuList
 * @param {*} activeHeader
 */
menuUtil.getAsideMenus = function(menuList, activeHeader) {
  const asideMenus = []
  if (menuList && menuList.length >= 0) {
    for (const menu of menuList) {
      if (menu.id === activeHeader) return menu.children || []
    }
  }
  if (asideMenus.length <= 0 && menuList && menuList.length > 0) {
    return menuList[0].children
  }
  return asideMenus
}

menuUtil.getPermissions = function(menuList) {
  let permissions = {}
  if (menuList && menuList.length >= 0) {
    const key = this.NAME_KEY
    permissions = menuList.map((menu) => {
      return {
        [menu[key]]: true
      }
    })
  }
  return permissions
}

export default menuUtil
