import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: BPMN_URL + '/bpm/oper/notify/query',
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
    url: BPMN_URL + '/bpm/oper/notify/remove',
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
    url: BPMN_URL + '/bpm/oper/notify/save',
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
    url: BPMN_URL + '/bpm/oper/notify/get',
    method: 'get',
    params: params
  })
}

/**
 * 标记为已读
 * @param {*} params
 */
export function readAll(params) {
  return request({
    url: BPMN_URL + '/bpm/oper/notify/readAll',
    method: 'post',
    params: params
  })
}

