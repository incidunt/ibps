/**
 * 按钮
 */
const buttons = {
  'search': {
    label: '搜索',
    type: 'primary',
    icon: 'ibps-icon-search',
    scope: ['toolbar', 'search']
  },
  'resetSearch': {
    label: '重置',
    type: 'danger',
    icon: 'ibps-icon-undo',
    scope: ['toolbar', 'search']
  },
  'moreSearch': {
    label: '更多',
    type: 'primary',
    icon: 'ibps-icon-ellipsis-h',
    scope: ['toolbar', 'search']
  },
  'add': {
    label: '添加',
    type: 'primary',
    icon: 'ibps-icon-add',
    scope: ['toolbar', 'contextmenu'],
    contextmenu: 'all'
  },
  'remove': {
    label: '删除',
    type: 'primary',
    icon: 'ibps-icon-remove',
    scope: ['toolbar', 'manage'],
    contextmenu: 'sub'
  },
  'edit': {
    label: '编辑',
    type: 'primary',
    icon: 'ibps-icon-edit',
    scope: ['toolbar', 'manage'],
    contextmenu: 'sub'
  },
  'detail': {
    label: '明细',
    type: 'primary',
    icon: 'ibps-icon-detail',
    scope: ['toolbar', 'manage'],
    contextmenu: 'sub'
  },
  'batchModify': {
    label: '批量修改',
    type: 'primary',
    icon: 'ibps-icon-check-square-o',
    scope: ['toolbar']
  },
  'import': {
    label: '导入',
    type: 'primary',
    icon: 'ibps-icon-import',
    scope: ['toolbar']
  },
  'export': {
    label: '导出',
    type: 'primary',
    icon: 'ibps-icon-export',
    scope: ['toolbar'],
    dropdown: [{
      label: '导出所有',
      key: 'exportAll'
    }, {
      label: '导出选中',
      key: 'exportSelected'
    }, {
      label: '导出当前页',
      key: 'exportCurPage'
    }]
  },
  'close': {
    label: '关闭',
    type: 'default',
    icon: 'ibps-icon-close',
    scope: ['edit', 'detail']
  },
  'save': {
    label: '保存',
    type: 'primary',
    icon: 'ibps-icon-save',
    scope: ['edit']
  },
  'print': {
    label: '打印',
    type: 'primary',
    icon: 'ibps-icon-print',
    scope: ['toolbar', 'manage', 'edit', 'detail']
  },
  'custom': {
    label: '自定义',
    type: 'primary',
    icon: 'ibps-icon-cog',
    scope: ['toolbar', 'manage', 'edit', 'detail', 'dialog']
  },
  'ok': {
    label: '确定',
    type: 'primary',
    icon: 'ibps-icon-ok',
    scope: ['dialog']
  },
  'confirm': {
    label: '确定',
    type: 'primary',
    icon: 'ibps-icon-ok',
    scope: ['dialog']
  },
  'clean': {
    label: '清空',
    type: 'success',
    icon: 'ibps-icon-clean',
    scope: ['dialog']
  },
  'cleanClose': {
    label: '清空并关闭',
    type: 'warning',
    icon: 'ibps-icon-times-circle-o',
    scope: ['dialog']
  },
  'cancel': {
    label: '取消',
    type: 'default',
    icon: 'ibps-icon-cancel',
    scope: ['dialog']
  },
  'refresh': {
    label: '刷新',
    type: 'primary',
    icon: 'ibps-icon-refresh',
    scope: ['toolbar']
  },
  'expand': {
    label: '展开',
    type: 'primary',
    icon: 'ibps-icon-expand',
    scope: ['toolbar']
  },
  'compress': {
    label: '收缩',
    type: 'primary',
    icon: 'ibps-icon-compress',
    scope: ['toolbar']
  },
  'more': {
    label: '更多',
    type: 'primary',
    icon: 'ibps-icon-list-alt',
    scope: ['toolbar']
  },
  'collapse': {
    label: '收缩',
    icon: 'ibps-icon-angle-up',
    scope: ['toolbar']
  },
  'expansion': {
    label: '展开',
    icon: 'ibps-icon-angle-down',
    scope: ['toolbar']
  },
  'sefStartFlow': {
    label: '自定义启动流程',
    icon: 'ibps-icon-start',
    scope: ['toolbar', 'edit']
  }

}

export default buttons

function hasButtonPermission(type, action) {
  var positions = buttons[type]['scope']
  if (!positions) { return false }
  return positions.indexOf(action) > -1
}
/**
	 * 是否有权限
	 */
export const hasPermission = hasButtonPermission
/*
 * 是否有按钮
 */
export const 	hasButton = function(type, action, position) {
  var hasPermission = hasButtonPermission(type, action)
  if (!hasPermission) { return false }// 没有权限
  if (!position || position === 'all' || position === action) { return true }
  return false
}

/**
	 * 是否有右键菜单权限
	 */
export const 	hasContextmenuButton = function(type, action, p) {
  var hasPermission = hasButtonPermission(type, action)
  if (!hasPermission) { return false }// 没有权限
  var contextmenu = buttons[type]['contextmenu']
  if (contextmenu === 'all' || contextmenu === p) { return true }
  return false
}

/**
 * 是否有搜索权限
 * @param {*} type
 */
export const 	hasSearchPermission = function(type) {
  return hasButtonPermission(type, 'search')
}
