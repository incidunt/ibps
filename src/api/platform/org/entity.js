import request from '@/utils/request'
import { ORG_URL } from '@/api/baseUrl'
/**
 * 保存数据
 * @param {*} params
 */
export function addAttr(params) {
  return request({
    url: ORG_URL + '/entity/addAttr',
    method: 'post',
    data: params
  })
}
/**
 * 获取数据
 * @param {*} params
 */
export function findTreeData(params) {
  return request({
    url: ORG_URL + '/entity/findPosTreeData',
    method: 'post',
    data: params
  })
}

/**
 * 通过获取数据
 * @param {*} params
 */
export function getByAlias(params) {
  return request({
    url: ORG_URL + '/entity/getByAlias',
    method: 'get',
    params
  })
}
