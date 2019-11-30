import request from '@/utils/request'
import { ORG_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL + '/group/query',
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
    url: ORG_URL + '/group/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function saveCascade(params) {
  return request({
    url: ORG_URL + '/group/saveCascade',
    method: 'post',
    data: params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function loadCascade(params) {
  return request({
    url: ORG_URL + '/group/loadCascade',
    method: 'get',
    params
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: ORG_URL + '/group/get',
    method: 'get',
    params
  })
}

/**
 * 根据组key获取数据
 * @param {*} params
 */
export function getByKey(params) {
  return request({
    url: ORG_URL + '/group/getByKey',
    method: 'get',
    params
  })
}

/**
 * 根据用户ID获取数据
 * @param {*} params
 */
export function findByUserId(params) {
  return request({
    url: ORG_URL + '/group/findByUserId',
    method: 'get',
    params
  })
}

// 获取用户组树
export function getTreeData(params) {
  return request({
    url: ORG_URL + '/group/findTreeData',
    method: 'post',
    params
  })
}
