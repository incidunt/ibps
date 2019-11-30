import request from '@/utils/request'
import { SOCKET_URL } from '@/api/baseUrl'

/**
 * 获取 socket 用户凭证
 * @param {*} params
 */
export function getToken(params) {
  return request({
    url: SOCKET_URL + '/socket/push/getToken',
    method: 'get',
    params: params
  })
}
