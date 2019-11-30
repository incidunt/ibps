import request from '@/utils/request'
import { CODEGEN_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CODEGEN_URL + '/codegen/variable/query',
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
    url: CODEGEN_URL + '/codegen/variable/remove',
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
    url: CODEGEN_URL + '/codegen/variable/save',
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
    url: CODEGEN_URL + '/codegen/variable/get',
    method: 'get',
    params: params
  })
}

/**
 * 重置列表
 * @param {*} params
 */
export function refresh(params) {
  return request({
    url: CODEGEN_URL + '/codegen/variable/refresh',
    method: 'post',
    params: params
  })
}

/**
 * 根据用户ID查询变量
 * @param {*} params
 */
export function findByUserId(params) {
  return request({
    url: CODEGEN_URL + '/codegen/variable/findByUserId',
    method: 'post',
    params: params
  })
}
