/**
* 数组元素交换位置
* @param {array} arr 数组
* @param {number} index1
* @param {number} index2
* index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
*/
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

export function moveUp(source, count) {
  let result = source
  for (let c = 0; c < count; c++) {
    for (let i = 1; i < result.length; i++) {
      if (result[i].checked && !result[i - 1].checked) {
        result = swapArray(result, i, i - 1)
      }
    }
  }
  return result
}

export function moveDown(source, count) {
  let result = source
  for (let c = 0; c < count; c++) {
    for (let i = result.length - 2; i > -1; i--) {
      if (result[i].checked && !result[i + 1].checked) {
        result = swapArray(result, i, i + 1)
      }
    }
  }
  return result
}

export function move2(source, target, sourceProperties, isTop) {
  let result = source
  const slen = result.length
  const tlen = target.length
  // eslint-disable-next-line no-labels
  outer:
  for (let i = 0; i < tlen; i++) {
    const t = target[i]
    for (let j = 0; j < slen; j++) {
      const s = result[j]
      if ((sourceProperties ? s[sourceProperties] : s) === t) {
        if (isTop) {
          result = swapArray(result, j, i)
        } else {
          result = swapArray(result, j, slen - (tlen - i))
        }
        // eslint-disable-next-line no-labels
        continue outer
      }
    }
  }
  return result
}

export function moveTop(source, target, peoperties) {
  return move2(source, target, peoperties, true)
}

export function moveButtom(source, target, peoperties) {
  return move2(source, target, peoperties, false)
}
