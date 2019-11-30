const buttonTypes = {
  'add': {
    label: '添加',
    style: 'primary',
    icon: 'add',
    position: 'toolbar',
    scope: ['toolbar']
  },
  'remove': {
    label: '删除',
    style: 'danger',
    icon: 'remove',
    position: 'all',
    scope: ['toolbar', 'manage']
  },
  'edit': {
    label: '编辑',
    style: 'danger',
    icon: 'edit',
    position: 'edit',
    scope: ['manage']
  },
  'custom': {
    label: '自定义按钮',
    style: 'primary',
    icon: 'cog',
    position: 'all',
    scope: ['toolbar', 'manage']
  }
}
const getTableButtonType = function(type) {
  const button = buttonTypes[type]
  const btn = {
    type: type,
    label: button.label,
    style: button.style,
    icon: button.icon,
    position: button.position
  }
  return btn
}

export const tableButtonType = getTableButtonType

const getTableButtonTypes = function() {
  const tableButtonTypes = []
  for (const type in buttonTypes) {
    tableButtonTypes.push(getTableButtonType(type))
  }
  return tableButtonTypes
}

export const tableButtonTypes = getTableButtonTypes()

function hasButtonPermission(type, action) {
  if (!type || type === '') { return false }
  const positions = buttonTypes[type]['scope']
  if (!positions) { return false }
  return positions.indexOf(action) > -1
}
/**
	 * 是否有权限
	 */
export const hasPermission = hasButtonPermission

export default buttonTypes
