import { download } from '@/api/platform/file/attachment'
import Utils from '@/utils/util'
import ActionUtils from '@/utils/action'
import { Loading } from 'element-ui'

export function downloadFile(file) {
  const loadingInstance = Loading.service({
    lock: true,
    text: '下载中..'
  })
  download({
    attachmentId: file.id
  }).then(response => {
    loadingInstance.close()
    if (!response) {
      return
    }
    ActionUtils.exportFile(
      response.data,
      file.fileName + (Utils.isNotEmpty(file.ext) ? '.' + file.ext : '')
    )
  }).catch(() => {
    loadingInstance.close()
  })
}
