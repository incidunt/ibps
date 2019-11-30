import request from '@/utils/request'
import { SOCKET_URL } from '@/api/baseUrl'

/**
 * 标记为已读
 * @param {*} params
 */
export function markRead(params) {
  return request({
    url: SOCKET_URL + 'socket/message/markRead',
    method: 'post',
    data: params
  })
}
