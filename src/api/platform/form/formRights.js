import request from '@/utils/request'
import { FORM_URL } from '@/api/baseUrl'

/**
 * 获取表单权限
 * @param {*} data
 */
export function getPermission(data) {
  return request({
    url: FORM_URL + '/form/rights/getPermission',
    method: 'post',
    data: data
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: FORM_URL + '/form/rights/save',
    method: 'post',
    dataType: 'json',
    data: params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function saveFlowPermission(params) {
  return request({
    url: FORM_URL + '/form/rights/saveFlowPermission',
    method: 'post',
    data: params
  })
}

/**
 * 重置表单数据
 * @param {*} params
 */
export function resetFlowPermission(params) {
  return request({
    url: FORM_URL + '/form/rights/resetFlowPermission',
    method: 'post',
    data: params
  })
}
