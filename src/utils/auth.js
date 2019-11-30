
/**
 * TOKEN  等cookies的处理
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import Cookies from './util.cookies.js'

const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const UUID_KEY = 'uuid'

/**
 * 获取tonken
 */
export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function setToken(token, optins) {
  return Cookies.set(TOKEN_KEY, token, optins)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY)
}

/**
 * 更新tonken（包含token和 refreshToken）
 */
export function updateToken(data) {
  // tonken 过期时间提前1分钟
  setToken(data.access_token, {
    expires: new Date(new Date().getTime() + ((parseInt(data.expires_in, 10) - 60) * 1000))
  })
  // 刷新过期时间提前2分钟
  setRefreshToken(data.refresh_token, {
    expires: new Date(new Date().getTime() + ((parseInt(data.remind_in, 10) - 120) * 1000))
  })
}

export function getRefreshToken() {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token, optins) {
  return Cookies.set(REFRESH_TOKEN_KEY, token, optins)
}

export function removeRefreshToken() {
  return Cookies.remove(REFRESH_TOKEN_KEY)
}

export function getUuid() {
  return Cookies.get(UUID_KEY)
}

export function setUuid(uuid, optins) {
  return Cookies.set(UUID_KEY, uuid, optins)
}

export function removeUuid() {
  return Cookies.remove(UUID_KEY)
}
