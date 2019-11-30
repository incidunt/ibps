import request from '@/utils/request'
import { SERV_URL } from '@/api/baseUrl'

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SERV_URL + '/serv/postpositionEvent/remove',
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
    url: SERV_URL + '/serv/postpositionEvent/save',
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
    url: SERV_URL + '/serv/postpositionEvent/get',
    method: 'get',
    params
  })
}

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: SERV_URL + '/serv/postpositionEvent/query',
    method: 'post',
    data: params
  })
}

/**
 * 设置服务
 * @param {*} params
 */
export function add(params) {
  return request({
    url: SERV_URL + '/serv/postpositionEvent/add',
    method: 'post',
    params: params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function saveSort(params) {
  return request({
    url: SERV_URL + '/serv/postpositionEvent/saveSort',
    method: 'post',
    params: params
  })
}
