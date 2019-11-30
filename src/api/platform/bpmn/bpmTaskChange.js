import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: BPMN_URL + '/bpm/task/change/query',
    method: 'post',
    data: data
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL + '/bpm/task/change/get',
    method: 'get',
    params: params
  })
}

/**
 * 流程任务变更
 * @param {*} params
 */
export function edit(params) {
  return request({
    url: BPMN_URL + '/bpm/task/change/edit',
    method: 'get',
    params: params
  })
}

/**
 * 提交数据
 * @param {*} params
 */
export function save(data) {
  return request({
    url: BPMN_URL + '/bpm/task/change/save',
    method: 'post',
    data: data
  })
}

/**
 * 提交数据
 * @param {*} params
 */
export function setStatus(params) {
  return request({
    url: BPMN_URL + '/bpm/task/change/setStatus',
    method: 'post',
    params: params
  })
}

