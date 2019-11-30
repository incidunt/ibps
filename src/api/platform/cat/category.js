import request from '@/utils/request'
import { CAT_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: CAT_URL + '/cat/category/query',
    method: 'post',
    data: params
  })
}/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: CAT_URL + '/cat/category/remove',
    method: 'post',
    params: params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: CAT_URL + '/cat/category/save',
    method: 'post',
    data: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: CAT_URL + '/cat/category/get',
    method: 'get',
    params
  })
}
