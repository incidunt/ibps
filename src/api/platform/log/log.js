import request from '@/utils/request'
import { LOG_URL } from '@/api/baseUrl'

export function queryPageList(params) {
  return request({
    url: LOG_URL + '/log/log/query',
    method: 'post',
    data: params
  })
}

export function get(params) {
  return request({
    url: LOG_URL + '/log/log/get',
    method: 'get',
    params
  })
}
