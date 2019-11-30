import request from '@/utils/request'
import { SERV_URL } from '@/api/baseUrl'

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: SERV_URL + '/serv/service/remove',
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
    url: SERV_URL + '/serv/service/save',
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
    url: SERV_URL + '/serv/service/load',
    method: 'get',
    params
  })
}

/**
 * 根据分类组键获取分类信息
 * @param {*} params
 */
export function findTreeData(params) {
  return request({
    url: SERV_URL + '/serv/service/getTreeData',
    method: 'get',
    params
  })
}

/**
 * 根据分类组键获取分类信息
 * @param {*} params
 */
export function parseService(params) {
  return request({
    url: SERV_URL + '/serv/service/parseService',
    method: 'post',
    params
  })
}

/**
 * 根据分类组键获取分类信息
 * @param {*} params
 */
export function testService(params) {
  return request({
    url: SERV_URL + '/serv/service/testService',
    method: 'post',
    data: params
  })
}
