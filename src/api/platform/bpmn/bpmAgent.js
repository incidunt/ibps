import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: BPMN_URL + '/bpm/agent/query',
    method: 'post',
    data: params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: BPMN_URL + '/bpm/agent/save',
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
    url: BPMN_URL + '/bpm/agent/get',
    method: 'get',
    params: params
  })
}

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: BPMN_URL + '/bpm/agent/remove',
    method: 'post',
    params: params
  })
}

/**
 * 启动和禁用代理
 * @param {*} params
 */
export function setEnable(params) {
  return request({
    url: BPMN_URL + '/bpm/agent/setEnable',
    method: 'post',
    params: params
  })
}
