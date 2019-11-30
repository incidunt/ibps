import request from '@/utils/request'
import { CODEGEN_URL } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(data) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/query',
    method: 'post',
    data: data
  })
}
/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/remove',
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
    url: CODEGEN_URL + '/codegen/scheme/save',
    method: 'post',
    data: params
  })
}

/**
 * 保存并下载
 * @param {*} params
 */
export function saveGen(params) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/saveGen',
    method: 'post',
    data: params
  })
}
/**
 * 保存并生成到工作目录
 * @param {*} params
 */
export function saveGenWorkspace(params) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/saveGenWorkspace',
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
    url: CODEGEN_URL + '/codegen/scheme/get',
    method: 'get',
    params: params
  })
}

/**
 * 生成到工作目录
 * @param {*} params
 */
export function genWorkspace(params) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/genWorkspace',
    method: 'get',
    params: params
  })
}

/**
 * 下载文件
 * @param {*} params
 */
export function gen(params) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/gen',
    method: 'post',
    params: params
  })
}

/**
 * 发布
 * @param {*} params
 */
export function deploy(params) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/deploy',
    method: 'get',
    params
  })
}

/**
 * 复制
 * @param {*} params
 */
export function copy(params) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/copy',
    method: 'post',
    params: params
  })
}

/**
 * 获取表单下拉
 * @param {*} params
 */
export function getFormList(params) {
  return request({
    url: CODEGEN_URL + '/codegen/scheme/findForm',
    method: 'get',
    params: params
  })
}
