import request from '@/utils/request'
import { AUTH_URL, BASE_GATEWAY_API } from '@/api/baseUrl'

/**
 * 获取菜单数据
 * @param {*} params
 */
export function getMenuData(params) {
  return request({
    url: AUTH_URL + '/auth/resources/getMenuData',
    method: 'get',
    params: params
  })
}

/**
 * 获取资源下拉树
 * @param {*} params
 */
export function getTreeData(params) {
  return request({
    url: AUTH_URL + '/auth/resources/getTreeData',
    method: 'get',
    params: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: AUTH_URL + '/auth/resources/query',
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
    url: AUTH_URL + '/auth/resources/remove',
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
    url: AUTH_URL + '/auth/resources/save',
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
    url: AUTH_URL + '/auth/resources/get',
    method: 'get',
    params
  })
}

/**
 *  保存资源移动
 * @param {*} params
 */
export function saveMove(params) {
  return request({
    url: AUTH_URL + '/auth/resources/saveMove',
    method: 'post',
    params: params
  })
}
/**
 *  保存资源移动
 * @param {*} params
 */
export function sortSave(params) {
  return request({
    url: AUTH_URL + '/auth/resources/sortSave',
    method: 'post',
    params: params
  })
}

/**
 *  导入
 * @param {*} file
 * @param {*} resourceId
 * @param {*} systemId
 */
export function importXml(file, resourceId, systemId) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  data.append('resourceId ', resourceId)
  data.append('systemId ', systemId)
  return request({
    baseURL: BASE_GATEWAY_API,
    url: AUTH_URL + '/auth/resources/importXml',
    method: 'post',
    data: data
  })
}
/**
 * 导出
 * @param {*} params
 */
export function exportXml(params) {
  return request({
    url: AUTH_URL + '/auth/resources/exportXml',
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}

/** 根据角色ID分配资源管理树
 *
 * @param {*} params
 */
export function findRoleResTreeChecked(params) {
  return request({
    url: AUTH_URL + '/auth/resources/findRoleResTreeChecked',
    params: params
  })
}

export function updateResource(params) {
  return request({
    url: AUTH_URL + '/auth/resources/updateResource',
    method: 'post',
    params: params
  })
}

/**
 * 更新数据
 */
export function updateNode(params) {
  return request({
    url: AUTH_URL + '/auth/resources/updateNode',
    method: 'post',
    params: params
  })
}
