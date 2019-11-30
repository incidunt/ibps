import request from '@/utils/request'
import { SYSTEM_URL } from '@/api/baseUrl'
/**
 * 获取桌面布局[首页使用]
 * @param {*} params
 */
export function getMyLayout(params) {
  return request({
    url: SYSTEM_URL + '/desktop/my/layout/getMyLayout',
    method: 'get',
    params
  })
}

/**
 * 获取桌面布局[个人设计使用]
 * @param {*} params
 */
export function getMyDesktop(params) {
  return request({
    url: SYSTEM_URL + '/desktop/my/layout/getMyDesktop',
    method: 'get',
    params
  })
}

/**
 * 保存数据
 * @param {*} params
 */
export function save(params) {
  return request({
    url: SYSTEM_URL + '/desktop/my/layout/save',
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
    url: SYSTEM_URL + '/desktop/my/layout/remove',
    method: 'post',
    params: params
  })
}
