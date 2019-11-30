import request from '@/utils/request'
import { ORG_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: ORG_URL + '/role/queryWithSysBySysId',
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
    url: ORG_URL + '/role/remove',
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
    url: ORG_URL + '/role/save',
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
    url: ORG_URL + '/role/get',
    method: 'get',
    params
  })
}

/**
 * 通过别名获取数据
 * @param {*} params
 */
export function getByAlias(params) {
  return request({
    url: ORG_URL + '/role/getByAlias',
    method: 'get',
    params
  })
}

/**
 * 根据角色ID查询角色-子系统数据
 * @param {*} params
 */
export function getRoleSystem(params) {
  return request({
    url: ORG_URL + '/role/getRoleSystem',
    method: 'get',
    params
  })
}

// 角色树信息
export function getTreeData(params) {
  return request({
    url: ORG_URL + '/role/queryWithSys',
    method: 'post',
    data: params || {}
  })
}
/**
 * 获取人员列表
 * @param {*} params
 */
export function queryUsePageList(params) {
  return request({
    url: ORG_URL + '/role/queryUseList',
    method: 'post',
    params
  })
}

/**
 * 查询组织角色以及父级组织的角色
 * @param {*} params
 */
export function queryByOrgId(params) {
  return request({
    url: ORG_URL + '/role/queryByOrgId',
    method: 'post',
    data: params
  })
}
/**
 * 查询岗位角色以及岗位所在组织的角色
 * @param {*} params
 */
export function queryByPositionId(params) {
  return request({
    url: ORG_URL + '/role/queryByPositionId',
    method: 'post',
    data: params
  })
}

/**
 * 根据用户ID查询用户角色
 * @param {*} params
 */
export function findAssignedByUserId(params) {
  return request({
    url: ORG_URL + '/role/findAssignedByUserId',
    method: 'get',
    params: params
  })
}

/**
 * 分级管理查询组织角色
 * @param {*} params
 */
export function queryWithGrade(params) {
  return request({
    url: ORG_URL + '/role/queryWithGrade',
    method: 'post',
    data: params
  })
}
