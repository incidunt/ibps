import request from '@/utils/request'
import { FORM_URL } from '@/api/baseUrl'

/**
 * 获取goovry脚本的值
 * @param {*} params
 */
export function getScriptValue(params) {
  // TODO： 暂时放在这个模块
  return request({
    url: FORM_URL + '/form/def/getScriptValue',
    method: 'post',
    data: params
  })
}
