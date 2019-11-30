import request from '@/utils/request'
// 演示tree数据
export function getTreeData(params) {
  return request({
    url: '/demo/tree/getTreeData',
    method: 'get',
    params
  })
}
export function removeTreeUrl() {
  return '/demo/tree/remove'
}

export function saveInfo(params) {
  return request({
    url: '/demo/tree/save',
    method: 'post',
    data: params
  })
}

