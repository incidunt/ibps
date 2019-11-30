import request from '@/utils/request'
import { JOB_URL } from '@/api/baseUrl'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params, datas) {
  return request({
    url: JOB_URL + '/job/trigger/query',
    method: 'post',
    params: params,
    data: datas
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: JOB_URL + '/job/trigger/remove',
    method: 'post',
    params: params
  })
}
/**
 * 保存数据
 * @param {*} params
 */
export function save(params, data) {
  return request({
    url: JOB_URL + '/job/trigger/save',
    method: 'post',
    params: params,
    data: data
  })
}

/**
 * 获取数据
 * @param {*} params
 */
export function get(params) {
  return request({
    url: JOB_URL + '/job/trigger/get',
    method: 'get',
    params
  })
}
/**
 * 定时计划启动
 * @param {*} params
 */
export function start(params) {
  return request({
    url: JOB_URL + '/job/trigger/start',
    method: 'post',
    params: params
  })
}

/**
 * 定时计划启动
 * @param {*} params
 */
export function stop(params) {
  return request({
    url: JOB_URL + '/job/trigger/stop',
    method: 'post',
    params: params
  })
}
