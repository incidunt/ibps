import request from '@/utils/request'
import { JOB_URL } from '@/api/baseUrl'

/**
 * 调度中心是否启动状态
 */
export function status() {
  return request({
    url: JOB_URL + '/scheduler/status',
    method: 'get'
  })
}

/**
 *
 * 启动调度中心
 */
export function start() {
  return request({
    url: JOB_URL + '/scheduler/start',
    method: 'post'
  })
}

/**
 *
 * 停止调度中心
 */
export function stop() {
  return request({
    url: JOB_URL + '/scheduler/stop',
    method: 'post'
  })
}
