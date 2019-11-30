/**
 * 文件类型
 */
const FILE_TYPES = {
  'images': ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'tif', 'tiff'],
  'videos': ['mkv', 'mp4', 'avi', 'swf', 'wmv', 'rmvb', 'mov', 'mpg'],
  'audios': ['mp3', 'flac', 'ape', 'wma', 'wav', 'aac', 'm4a', 'au', 'ram', 'mmf', 'ai'],
  'docs': ['doc', 'docx', 'pdf', 'rtf', 'txt', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'],
  'compress': ['rar', 'zip', '7z', 'gz', 'arj', 'z']
}

/**
 * 参考http://www.w3school.com.cn/media/media_mimeref.asp
 */
const ACCEPT = {
  'images': 'image/*',
  'videos': 'video/*',
  'audios': 'audio/*',
  'docs': '.doc,.docx,.pdf,.rtf,.txt,.csv,.xls,.xlsx,.ppt,.pptx',
  'compress': '.rar,.zip,.7z,.gz,.arj,.z'
}

let All_FILE_TYPES = []
for (const key in FILE_TYPES) {
  All_FILE_TYPES = [...All_FILE_TYPES, ...FILE_TYPES[key]]
}

// 文件类型
export const fileTypes = FILE_TYPES

// 所有文件
export const allFileTypes = All_FILE_TYPES

export const accept = ACCEPT
