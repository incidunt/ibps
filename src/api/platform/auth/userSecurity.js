import request from '@/utils/request'
import { AUTH_URL } from '@/api/baseUrl'

export function queryPageList(params) {
  return request({
    url: AUTH_URL + '/auth/user/security/query',
    method: 'post',
    data: params
  })
}

export function save(params) {
  return request({
    url: AUTH_URL + '/auth/user/security/save',
    method: 'post',
    data: params
  })
}

export function remove(params) {
  return request({
    url: AUTH_URL + '/auth/user/security/remove',
    method: 'post',
    params: params
  })
}

export function get(params) {
  return request({
    url: AUTH_URL + '/auth/user/security/get',
    method: 'get',
    params
  })
}
//    启用/禁用
export function setUse(params) {
  return request({
    url: AUTH_URL + '/auth/user/security/setUse',
    method: 'post',
    params: params
  })
}

// 获取默认的用户安全设置
export function getDefaultUserSecurity(params) {
  return request({
    url: AUTH_URL + '/auth/user/security/getDefaultUserSecurity',
    method: 'get',
    params: params
  })
}

// 设置默认【用户密码安全设置】
export function setDefault(params) {
  return request({
    url: AUTH_URL + '/auth/user/security/setDefault',
    method: 'post',
    params: params
  })
}
