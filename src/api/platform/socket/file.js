import request from '@/utils/request'
import { SOCKET_URL } from '@/api/baseUrl'

/**
 * 根据伪链下载
 * @param {*} params
 */
export function downloadByLink(params) {
  return request({
    url: SOCKET_URL + '/socket/file/download',
    method: 'post',
    params: params
  })
}
/**
 * 标记为已下载
 * @param {*} params
 */
export function markDownloaded(params) {
  return request({
    url: SOCKET_URL + '/socket/file/markDownloaded',
    method: 'post',
    params: params
  })
}

/**
 * 取我的消息列表
 * @param {*} params
 */
export function getDownloadList(params) {
  return request({
    url: SOCKET_URL + '/socket/file/query',
    method: 'post',
    data: params
  })
}
