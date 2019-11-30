import request from '@/utils/request'
import { MSG_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: MSG_URL + '/msg/messageTemplate/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: MSG_URL + '/msg/messageTemplate/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(data) {
  return request({
    url: MSG_URL + '/msg/messageTemplate/save',
    method: 'post',
    data: data
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: MSG_URL + '/msg/messageTemplate/get',
    params: params
  })
}

