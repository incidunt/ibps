import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/demo/table/list',
    method: 'get',
    params
  })
}
