
/**
   * 判断是否存在相同节点--前台
   */
export function checkSameNode(value, treeData) {
  let isSame = false
  const childrenKey = 'subBoDefs'
  const sanmeNode = (data) => {
    data.find(item => {
      if (item.code === value.code && item.id !== value.id) {
        isSame = true
      } else {
        if (item[childrenKey] && item[childrenKey] !== []) {
          sanmeNode(item[childrenKey])
        }
      }
    })
  }
  sanmeNode(treeData)
  return isSame
}

