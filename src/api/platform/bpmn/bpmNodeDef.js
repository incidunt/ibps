import request from '@/utils/request'
import { BPMN_URL } from '@/api/baseUrl'

/**
 *预览人员条件
 * @param {*} params
 */
export function previewCondition(params) {
  return request({
    url: BPMN_URL + '/bpm/definition/previewCondition',
    method: 'post',
    data: params
  })
}

/**
 *节点集合
 * @param {*} params
 */
export function sameNodeDialog(params) {
  return request({
    url: BPMN_URL + '/bpm/node/def/sameNodeDialog',
    method: 'get',
    params: params
  })
}

