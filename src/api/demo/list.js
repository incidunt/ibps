import request from '@/utils/request'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: '/demo/list/listJson',
    method: 'post',
    data: params
  })
}

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: '/demo/list/remove',
    method: 'post',
    params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: '/demo/list/getInfo',
    method: 'get',
    params
  })
}

/**
 *保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: '/demo/list/save',
    method: 'post',
    data: params
  })
}

/**
 *图片上传
 * @param {*} params
 */
export function uploadImg() {
  return 'https://jsonplaceholder.typicode.com/posts/'
}
