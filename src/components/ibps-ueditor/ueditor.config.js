/**
 * ueditor 配置
 */
const UEDITOR_HOME_URL = process.env.BASE_URL ? process.env.BASE_URL + 'static/' : '/static/'
const BASE_URL = process.env.VUE_APP_BASE_API
import { getToken } from '@/utils/auth'

export default {
  UEDITOR_HOME_URL: UEDITOR_HOME_URL + 'lib/ueditor/1.4.3.3/',
  // TODO: 如果需要上传功能,找后端小伙伴要服务器接口地址
  serverUrl: BASE_URL + `/platform/v3/file/ueditor/action?access_token=` + getToken(),
  // 编辑器不自动被内容撑高
  autoHeightEnabled: false,
  // 初始容器高度
  initialFrameHeight: 240,
  // 初始容器宽度
  initialFrameWidth: '100%',
  // 关闭自动保存
  enableAutoSave: false

}
