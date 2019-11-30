import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { SYSTEM_URL } from '@/api/baseUrl'
import { BASE_GATEWAY_API } from '@/api/baseUrl'
import qs from 'qs'
/**
 * 查询列表数据
 * @param {*} params
 */
export function queryPageList(params) {
  return request({
    url: SYSTEM_URL + '/file/attachment/query',
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
    url: SYSTEM_URL + '/file/attachment/remove',
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
    url: SYSTEM_URL + '/file/attachment/save',
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
    url: SYSTEM_URL + '/file/attachment/get',
    method: 'get',
    params
  })
}

/**
 * 保存修改文件名
 * @param {*} params
 */
export function modifyName(params) {
  return request({
    url: SYSTEM_URL + '/file/attachment/modifyName',
    method: 'post',
    params: params
  })
}
/**
 * 下载文件url
 * @param {*} params
 */
export function downloadUrl(params) {
  return SYSTEM_URL + '/file/download?' + qs.parse(params)
}

/**
 * 下载文件
 * @param {*} params
 */
export function download(params) {
  return request({
    url: SYSTEM_URL + '/file/download',
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 文件上传
 * @param {*} file
 * @param {*} uploadFileVo
 */
export function uploadFile(file, uploadFileVo) {
  const data = new FormData() // 创建form对象
  data.append('file', file)
  // data.append('uploadFileVo', null)

  return request({
    baseURL: BASE_GATEWAY_API,
    url: SYSTEM_URL + '/file/upload',
    method: 'post',
    data: data
  })
}

/**
 * 获取文件预览地址
 * @param {*} attachmentId
 */
export function previewFile(attachmentId) {
  return process.env.VUE_APP_BASE_API + SYSTEM_URL + '/file/preview?attachmentId=' +
      attachmentId + '&access_token=' + getToken()
}

/**
 * 获取图片地址
 * @param {*} attachmentId
 */
export function getImage(attachmentId) {
  return process.env.VUE_APP_BASE_API + SYSTEM_URL + '/file/getImage?attachmentId=' +
      attachmentId + '&access_token=' + getToken()
}

/**
 * 获取照片地址
 * @param {*} attachmentId
 */
export function getPhoto(photo) {
  return process.env.VUE_APP_BASE_API + SYSTEM_URL + photo + '&access_token=' + getToken()
}

/**
 * 返回保存数据库附件格式地址
 * @param {*} fileId
 */
export function fileUrl(fileId) {
  return '/file/getImage?attachmentId=' + fileId
}
