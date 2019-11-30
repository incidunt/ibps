import request from '@/utils/request'
import ActionUtil from '@/utils/action'
import { BPMN_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/query',
    method: 'post',
    data: params
  })
}
/**
 * 获取流程实例信息
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/get',
    method: 'get',
    params: params
  })
}
/**
 * 流程图
 * @param {*} params
 */
export function flowImage(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/flowImage',
    method: 'get',
    params: params
  })
}
/**
 * 审批历史
 * @param {*} params
 */
export function flowHistory(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/flowHistory',
    method: 'post',
    data: params
  })
}

/**
 * 审批历史
 * @param {*} params
 */
export function flowHistorySign(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/flowHistorySign',
    method: 'get',
    params: params
  })
}

/**
 * 审批历史
 * @param {*} params
 */
export function flowHistoryCallSub(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/flowHistoryCallSub',
    method: 'get',
    params: params
  })
}

/**
 * 实例表单
 * @param {*} params
 */
export function instFormInfo(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/instFormInfo',
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
    url: BPMN_URL + '/bpm/instance/remove',
    method: 'post',
    params: params
  })
}

/**
 * 启动或草稿获取表单数据
 * @param {*} params
 */
export function getFormData(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/getFormData',
    method: 'get',
    params: params
  })
}

/**
 * 流程实例获取表单数据
 * @param {*} params
 */
export function getInstFormData(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/instFormInfo',
    method: 'get',
    params: params
  })
}

/**
 * 启动流程
 * @param {*} params
 */
export function startFlow(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/start',
    method: 'post',
    data: ActionUtil.formatParams(params)
  })
}

/**
 * 保存草稿
 * @param {*} params
 */
export function saveDraft(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/saveDraft',
    method: 'post',
    data: ActionUtil.formatParams(params)
  })
}

/**
 * 启动流程选择器
 * @param {*} params
 */
export function startOutgoing(params) {
  return request({
    url: BPMN_URL + '/bpm/instance/startOutgoing',
    method: 'post',
    data: params
  })
}

