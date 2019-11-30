import request from '@/utils/request'
import ActionUtil from '@/utils/action'
import { ORG_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL + '/org/query',
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
    url: ORG_URL + '/org/remove',
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
    url: ORG_URL + '/org/save',
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
    url: ORG_URL + '/org/get',
    method: 'get',
    params
  })
}

// 组织树信息
export function findTreeData(params) {
  return request({
    url: ORG_URL + '/org/findTreeData',
    method: 'post',
    data: ActionUtil.formatParams(params)
  })
}

/**
 *  保存移动的组织
 * @param {*} params
 */
export function saveMove(params) {
  return request({
    url: ORG_URL + '/org/saveMove',
    method: 'post',
    params: params
  })
}
/**
 *  保存组织排序
 * @param {*} params
 */
export function saveSort(params) {
  return request({
    url: ORG_URL + '/org/saveSort',
    method: 'post',
    params: params
  })
}

/**
 * 添加组织角色
 * @param {*} params
 */
export function assignRole(params) {
  return request({
    url: ORG_URL + '/org/assignRole',
    method: 'post',
    params: params
  })
}

/**
 * 移除组织角色
 * @param {*} params
 */
export function removeRole(params) {
  return request({
    url: ORG_URL + '/org/removeRole',
    method: 'post',
    params: params
  })
}

