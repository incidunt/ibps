import request from '@/utils/request'
import { FORM_URL, BASE_GATEWAY_API } from '@/api/baseUrl'

/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: FORM_URL + '/form/def/query',
    method: 'post',
    data: params
  })
}
/**
 * 查询列表数据
 * @param {*} params
 */
export function findFormJsonByBo(params) {
  return request({
    url: FORM_URL + '/form/def/findFormJsonByBo',
    method: 'get',
    params: params
  })
}

/**
 * 删除数据
 * @param {*} params
 */
export function remove(params) {
  return request({
    url: FORM_URL + '/form/def/remove',
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
    url: FORM_URL + '/form/def/save/vo',
    method: 'post',
    data: params
  })
}

/**
 * 复制前数据请求
 * @param {*} params
 */
export function preCopy(params) {
  return request({
    url: FORM_URL + '/form/def/preCopy',
    method: 'post',
    params: params
  })
}

/**
 * 保存复制的数据
 * @param {*} params
 */
export function saveCopy(params) {
  return request({
    url: FORM_URL + '/form/def/copy',
    method: 'post',
    data: params
  })
}

/**
 * 判断key是否存在
 * @param {*} params
 */
export function isFormKeyExists(params) {
  return request({
    url: FORM_URL + '/form/def/isFormKeyExists',
    method: 'post',
    params
  })
}
/**
 * 设计表单
 * @param {*} params
 */
export function design(params) {
  return request({
    url: FORM_URL + '/form/def/design',
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
    url: FORM_URL + '/form/def/get',
    method: 'get',
    params
  })
}
/**
 * 获取表单定义数据
 * @param {*} params
 */
export function getFormDataByFormDefId(params) {
  return request({
    url: FORM_URL + '/form/def/getFormDataByFormDefId',
    method: 'get',
    params
  })
}
/**
 * 通过formkey获取表单定义数据
 * @param {*} params
 */
export function getFormDataByFormKey(params) {
  return request({
    url: FORM_URL + '/form/def/getFormDataByFormKey',
    method: 'get',
    params
  })
}

/**
 * 获取表单定义数据
 * @param {*} params
 */
export function getFormData(params) {
  return request({
    url: FORM_URL + '/form/def/getFormData',
    method: 'post',
    params
  })
}

/**
 * 构建业务对象树
 * @param {*} params
 */
export function buildTree(params) {
  return request({
    url: FORM_URL + '/form/def/buildTree',
    method: 'post',
    params
  })
}

/**
 * 导入文件
 * @param {*} file
 */
export function importForm(file) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  return request({
    baseURL: BASE_GATEWAY_API,
    url: FORM_URL + '/form/def/importForm',
    method: 'post',
    data: data
  })
}

/**
 * 导出文件
 * @param {*} params
 */
export function exportFile(params) {
  return request({
    url: FORM_URL + '/form/def/exportForm',
    method: 'post',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 根据表单key获取表单字段的意见字段
 * @param {*} params
 */
export function findFormOptionField(params) {
  return request({
    url: FORM_URL + '/form/def/findFormOptionField',
    method: 'get',
    params
  })
}

/**
 * 获取表单下拉
 * @param {*} params
 */
export function getFormList(params) {
  return request({
    url: FORM_URL + '/form/def/getTableList',
    method: 'get',
    params: params
  })
}

/**
 * 获取表单
 * @param {*} params
 */
export function getFormKey(params) {
  return request({
    url: FORM_URL + '/form/def/getMainByFormKey',
    method: 'get',
    params: params
  })
}

