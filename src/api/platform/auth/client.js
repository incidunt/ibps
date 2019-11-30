import request from '@/utils/request'
import { AUTH_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: AUTH_URL + '/auth/client/query',
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
    url: AUTH_URL + '/auth/client/remove',
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
    url: AUTH_URL + '/auth/client/save',
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
    url: AUTH_URL + '/auth/client/get',
    method: 'get',
    params
  })
}

export function reset(params) {
  return request({
    url: AUTH_URL + '/auth/client/reset',
    method: 'post',
    params: params
  })
}

/**
 * 批量审核
 * @param {*} params
 */
export function doAuditBatch(params) {
  return request({
    url: AUTH_URL + '/auth/client/audit/batch',
    method: 'post',
    params
  })
}

/**
 * 审核
 * @param {*} params
 */
export function audit(params) {
  return request({
    url: AUTH_URL + '/auth/client/audit',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function queryClientSelector(params) {
  return request({
    url: AUTH_URL + '/auth/client/query/selector',
    method: 'post',
    data: params
  })
}
