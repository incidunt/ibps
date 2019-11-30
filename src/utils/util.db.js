/**
 * 数据持久化
 *  避免页面刷新数据丢失
 *   目前存储LocalStorage
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-07-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import low from 'lowdb'
// 存储方式
import LocalStorage from 'lowdb/adapters/LocalStorage'
// 设置
import setting from '@/setting.js'

const adapter = new LocalStorage(`ibps-${setting.releases.version}`)
const db = low(adapter)

db.defaults({
  sys: {},
  database: {}
}).write()

export default db
