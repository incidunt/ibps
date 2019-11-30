import request from '@/utils/request'
import { AUTH_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: AUTH_URL + '/auth/app/api/query',
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
    url: AUTH_URL + '/auth/app/api/remove',
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
    url: AUTH_URL + '/auth/app/api/save',
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
    url: AUTH_URL + '/auth/app/api/get',
    method: 'get',
    params
  })
}
/**
 * 通过授权key获取列表
 * @param {*} params
 */
export function queryByGrantKey(params) {
  return request({
    url: AUTH_URL + '/auth/app/api/queryByGrantKey',
    method: 'post',
    data: params
  })
}

/**
 * 导入
 * @param {*} params
 */
export function importApi(params) {
  return request({
    url: AUTH_URL + '/auth/app/api/importApi',
    method: 'post',
    params: params
  })
}

/**
 * 授权日志
 * @param {*} params
 */
export function queryInvoke(params) {
  return request({
    url: AUTH_URL + '/auth/api/invoke/query',
    method: 'post',
    data: params
  })
}
