/**
 * 树操作工具类</br>
 * Array转换Tree
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import _defaultsDeep from 'lodash.defaultsdeep'
const treeUtil = {}
const defaultSetting = {
  isParent: 'isParent',
  childrenKey: 'children',
  nameKey: 'name',
  titleKey: 'title',
  idKey: 'id',
  pIdKey: 'parentId',
  levelKey: 'level',
  rootPId: null
}
/**
 * 转换成树结构
 *  并设置了层级
 * @param {*} data
 */
treeUtil.transformToTreeFormat = function(data, setting = {}) {
  setting = _defaultsDeep({}, setting, defaultSetting)
  const node = treeUtil.transformToArrayFormat(data, setting)
  // 设置层级
  for (let i = 0; i < node.length; i++) {
    treeUtil.setSonNodeLevel(null, node[i], setting)
  }
  return node
}

/**
 * 转换成数组结构
 * @param {*} sNodes
 */
treeUtil.transformToArrayFormat = function(data, setting = {}) {
  const sNodes = JSON.parse(JSON.stringify(data))
  setting = _defaultsDeep({}, setting, defaultSetting)
  const idKey = setting.idKey
  const pIdKey = setting.pIdKey
  const childrenKey = setting.childrenKey

  let i, j, l
  if (!idKey || idKey === '' || !sNodes) { return [] }
  if (sNodes instanceof Array) {
    const r = []
    const tmpMap = []
    for (i = 0, l = sNodes.length; i < l; i++) {
      tmpMap[sNodes[i][idKey]] = sNodes[i]
    }
    for (j = 0, l = sNodes.length; j < l; j++) {
      if (tmpMap[sNodes[j][pIdKey]] &&	sNodes[j][idKey] !== sNodes[j][pIdKey]) {
        if (!tmpMap[sNodes[j][pIdKey]][childrenKey]) {
          tmpMap[sNodes[j][pIdKey]][childrenKey] = []
        }
        tmpMap[sNodes[j][pIdKey]][childrenKey].push(sNodes[j])
      } else {
        r.push(sNodes[j])
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
treeUtil.setSonNodeLevel = function(parentNode, node, setting) {
  if (!node) return
  const childrenKey = setting.childrenKey
  const levelKey = setting.levelKey

  node[levelKey] = parentNode ? parentNode[levelKey] + 1 : 0
  if (!node[childrenKey]) { return }
  for (let i = 0, l = node[childrenKey].length; i < l; i++) {
    if (node[childrenKey][i]) { treeUtil.setSonNodeLevel(node, node[childrenKey][i]) }
  }
}

export default treeUtil
