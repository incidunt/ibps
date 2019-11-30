import request from '@/utils/request'
import ActionUtil from '@/utils/action'
import { BPMN_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: BPMN_URL + '/bpm/task/query',
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
    url: BPMN_URL + '/bpm/task/remove',
    method: 'post',
    params: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: BPMN_URL + '/bpm/task/get',
    method: 'get',
    params: params
  })
}

/**
 * 锁定任务
 * @param {*} params
 */
export function lock(params) {
  return request({
    url: BPMN_URL + '/bpm/task/lock',
    method: 'post',
    params: params
  })
}

/**
 * 解锁任务
 * @param {*} params
 */
export function unlock(params) {
  return request({
    url: BPMN_URL + '/bpm/task/unlock',
    method: 'post',
    params: params
  })
}

/**
 * 处理任务
 * @param  {[type]} params 参数对象
 */
export function complete(params) {
  return request({
    url: BPMN_URL + '/bpm/task/complete',
    method: 'post',
    data: ActionUtil.formatParams(params)
  })
}

/**
 * 终止流程
 * @param  {[type]} params 参数对象
 */
export function doEndProcess(params) {
  return request({
    url: BPMN_URL + '/bpm/task/doEndProcess',
    method: 'post',
    params: params
  })
}

/**
 * 挂起流程
 * @param {*} params
 */
export function suspendProcess(params) {
  return request({
    url: BPMN_URL + '/bpm/task/suspendProcess',
    method: 'post',
    params: params
  })
}

/**
 * 恢复流程
 * @param {*} params
 */
export function recoverProcess(params) {
  return request({
    url: BPMN_URL + '/bpm/task/recoverProcess',
    method: 'post',
    params: params
  })
}

/**
 * 保存加签
 * @param  {[type]} data 参数对象
 */
export function doAddSignTask(data) {
  return request({
    url: BPMN_URL + '/bpm/task/doAddSignTask',
    method: 'post',
    data: data
  })
}

/**
 * 补签
 * @param  {[type]} data 参数对象
 */
export function saveTaskChange(data) {
  return request({
    url: BPMN_URL + '/bpm/task/chage/save',
    method: 'post',
    data: data
  })
}

/**
 * 节点审批历史
 * @param {*} params
 */
export function getNodeApproval(params) {
  return request({
    url: BPMN_URL + '/bpm/task/nodeApproval',
    method: 'get',
    params: params
  })
}

/**
 * 批量同意任务
 * @param {*} params
 */
export function completeBatch(params) {
  return request({
    url: BPMN_URL + '/bpm/task/completeBatch',
    method: 'post',
    data: ActionUtil.formatParams(params)
  })
}

/**
 * 批量挂起任务
 * @param {*} params
 */
export function batchSuspendProcess(params) {
  return request({
    url: BPMN_URL + '/bpm/task/batchSuspendProcess',
    method: 'post',
    params: params
  })
}

/**
 * 批量恢复任务
 * @param {*} params
 */
export function batchRecoverProcess(params) {
  return request({
    url: BPMN_URL + '/bpm/task/batchRecoverProcess',
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
    url: BPMN_URL + '/bpm/task/save',
    method: 'post',
    data: params
  })
}

/**
 * 分配人员
 * @param {*} params
 */
export function assignee(params) {
  return request({
    url: BPMN_URL + '/bpm/task/assignee',
    method: 'post',
    params: params
  })
}

/**
 * 流程任务获取表单数据
 * @param {*} params
 */
export function getTaskFormData(params) {
  return request({
    url: BPMN_URL + '/bpm/task/getFormData',
    method: 'get',
    params: params
  })
}

/**
 * 任务办理数据(同意、反对、弃权)
 * @param {*} data
 */
export function agreeData(data) {
  return request({
    url: BPMN_URL + '/bpm/task/agreeData/vo',
    method: 'post',
    data: data
  })
}

/**
 * 驳回
 * @param {*} params
 */
export function toReject(params) {
  return request({
    url: BPMN_URL + '/bpm/task/toReject',
    method: 'get',
    params: params
  })
}

/**
 * 驳回上一步
 * @param {*} params
 */
export function toRejectToPrevious(params) {
  return request({
    url: BPMN_URL + '/bpm/task/toRejectToPrevious',
    method: 'get',
    params: params
  })
}
/**
 * 驳回发起人
 * @param {*} params
 */
export function toRejectToStart(params) {
  return request({
    url: BPMN_URL + '/bpm/task/toRejectToPrevious',
    method: 'get',
    params: params
  })
}
