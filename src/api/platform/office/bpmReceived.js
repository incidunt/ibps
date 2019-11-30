import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'
/**
 * 我的待办列表
 * @param {*} params
 */
export function pending(params) {
  return request({
    url: BPMN_URL + '/bpm/received/query/pending',
    method: 'post',
    data: params
  })
}
/**
 * 我的办结列表
 * @param {*} params
 */
export function completed(params) {
  return request({
    url: BPMN_URL + '/bpm/received/query/completed',
    method: 'post',
    data: params
  })
}

/**
 * 我的已办事宜
 * @param {*} params
 */
export function handled(params) {
  return request({
    url: BPMN_URL + '/bpm/received/query/handled',
    method: 'post',
    data: params
  })
}
/**
 * 我的可撤销列表
 * @param {*} params
 */
export function revokable(params) {
  return request({
    url: BPMN_URL + '/bpm/received/query/handled/revokable',
    method: 'post',
    data: params
  })
}

/**
 * 已办任务列表
 * @param {*} params
 */
export function handledTask(params) {
  return request({
    url: BPMN_URL + '/bpm/received/query/handled/task',
    method: 'post',
    data: params
  })
}

/**
 * 流程任务撤回
 * @param {*} params
 */
export function revoke(params) {
  return request({
    url: BPMN_URL + '/bpm/received/revoke',
    method: 'post',
    data: params
  })
}
