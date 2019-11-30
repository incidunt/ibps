/**
 * 合并两个列表
 * @param {*} source
 * @param {*} target
 */
export const concat = function(source, target) {
  const list = []
  if (!source) return target
  if (!target) return source
  source.forEach((item) => {
    const index = target.find((d) => d.id === item.id)
    if (!index) {
      list.push(item)
    }
  })
  return target.concat(list)
}
