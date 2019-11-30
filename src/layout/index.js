const _import = require('@/router/_import_' + process.env.NODE_ENV)

export const layouts = [
  {
    value: 'default',
    label: '默认布局',
    url: '/header-aside/layout'
  },
  {
    value: 'custom',
    label: '自定义布局',
    url: '/custom-layout'
  }
]
const layoutComponent = []
layouts.forEach(item => {
  layoutComponent[item.value] = _import(item.url, 'layout')
})

/**
 * 获取默认布局
*/
export function getDefaultLayout() {
  return layoutComponent['default']
}

/**
 * 获取指定布局
 * @param {*} layoutKey
 */
export function getLayout(layoutKey) {
  if (!layoutKey || layoutKey === '') return getDefaultLayout()
  return layoutComponent[layoutKey]
}

