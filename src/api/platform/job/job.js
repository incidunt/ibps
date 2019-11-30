import request from '@/utils/request'
import { JOB_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params, page) {
  return request({
    url: JOB_URL + '/job/query',
    method: 'post',
    params: params,
    data: page
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: JOB_URL + '/job/remove',
    method: 'post',
    params: params
  })
}
/**
 * [编辑]保存数据
 * @param {*} params
 */
export function update(params) {
  return request({
    url: JOB_URL + '/job/update',
    method: 'post',
    data: params
  })
}
/**
 * [新增]保存数据
 * @param {*} params
 */
export function create(params) {
  return request({
    url: JOB_URL + '/job/create',
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
    url: JOB_URL + '/job/get',
    method: 'get',
    params
  })
}

/**
 * 定时任务分组列表
 */
export function getGroups(params) {
  return request({
    url: JOB_URL + '/job/groups',
    method: 'get'
  })
}

/**
 * 定时任务分组列表
 */
export function validClass(params) {
  return request({
    url: JOB_URL + '/job/validClass',
    method: 'get',
    params: params
  })
}

/**
 * 定时任务执行
 * @param {*} params
 */
export function execute(params) {
  return request({
    url: JOB_URL + '/job/execute',
    method: 'post',
    params: params
  })
}
