/**
 * 操作帮助类
 * 处理增删改查、分页等相关操作
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2018-10-08-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
import { BASE_GATEWAY_API, SOCKET_URL } from '@/api/baseUrl'

const file = {}
const fileType2faIcon = {}
const DEFAULT_ICON = 'ibps-icon-file-o'
// 代码类
fileType2faIcon['css'] = fileType2faIcon['txt'] = fileType2faIcon['js'] = 'ibps-icon-file-code-o'
fileType2faIcon['html'] = fileType2faIcon['htm'] = fileType2faIcon['shtml'] = 'ibps-icon-file-code-o'
fileType2faIcon['xml'] = fileType2faIcon['xsl'] = 'ibps-icon-file-code-o'
// PDF
fileType2faIcon['pdf'] = 'ibps-icon-file-pdf-o'
// word
fileType2faIcon['doc'] = 'ibps-icon-file-word-o'
// excel
fileType2faIcon['xls'] = 'ibps-icon-file-excel-o'
// ppt
fileType2faIcon['ppt'] = 'ibps-icon-file-powerpoint-o'
// 压缩包
fileType2faIcon['zip'] = fileType2faIcon['rar'] = fileType2faIcon['gzip'] = fileType2faIcon['jar'] = fileType2faIcon['lzh'] = 'ibps-icon-file-archive-o'
// 图片
fileType2faIcon['psd'] = fileType2faIcon['jpg'] = fileType2faIcon['gif'] = 'ibps-icon-file-photo-o'
// 数媒
fileType2faIcon['ra'] = fileType2faIcon['rm'] = fileType2faIcon['rmvb'] = fileType2faIcon['mp3'] = fileType2faIcon['wma'] = fileType2faIcon['avi'] = 'ibps-icon-file-sound-o'
file.getFileType = (fileType) => {
  return fileType2faIcon[fileType] ? fileType2faIcon[fileType] : DEFAULT_ICON
}

file.genDownloadUrl = (link) => {
  return `${BASE_GATEWAY_API}${SOCKET_URL}/file/download?link=${link}`
}
export default file
