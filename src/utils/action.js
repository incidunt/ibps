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
import { Message, MessageBox } from 'element-ui'
import Utils from '@/utils/util'
import i18n from '@/utils/i18n'
import common from '@/constants/common.js'

const action = {}

/**
 * 操作警告提示
 */
action.warning = (message) => {
  action.msg(message, {
    type: 'warning'
  })
}

/**
 * 操作警告提示
 */
action.success = (message) => {
  action.msg(message, {
    type: 'success'
  })
}

/**
 * 操作警告提示
 */
action.msg = (message, options) => {
  Message.closeAll()
  if (!options) {
    options = options || {}
  }
  options.message = message
  Message(options)
}

/**
 * 操作成功提示
 */
action.successMessage = (message = i18n.t('common.dialog.operateSuccess')) => {
  action.success(message)
}

/**
 * 删除成功提示
 */
action.removeSuccessMessage = (message = i18n.t('common.dialog.removeSuccess')) => {
  action.success(message)
}

/**
 * 获取选择行的id
 * @param {*} rows
 * @param {*} pkKey
 */
action.getSelectedIds = (rows, pkKey = 'id') => {
  const ids = []
  rows.map((item) => {
    ids.push(item[pkKey])
  })
  return ids
}
/**
 * 选择记录
 * 只能选择一个记录
 * [一般用于编辑、明细等只选择一个记录]
 *
 * @param {*} selection
 */
action.selectedRecord = (selection) => {
  return new Promise((resolve, reject) => {
    if (Utils.isEmpty(selection)) {
      action.warning(i18n.t('common.dialog.selectedRecords'))
      return reject()
    }
    if (Array.isArray(selection) && selection.length > 1) {
      action.warning(i18n.t('common.dialog.multipleSelected'))
      return reject()
    }
    if (Array.isArray(selection)) {
      resolve(selection[0])
    } else {
      resolve(selection)
    }
  })
}

/**
 * 选择多个记录
 * [一般用于删除等选择多个记录]
 *
 * @param {*} selection 选中的值
 * @param {*} isArray 是否数组格式返回 默认 false
 * @param {*} separator 分割符 默认 `,`
 */
action.selectedMultiRecord = (selection, isArray = false, separator = ',') => {
  return new Promise((resolve, reject) => {
    if (Utils.isEmpty(selection)) {
      action.warning(i18n.t('common.dialog.selectedRecords'))
      return reject()
    }

    if (!Array.isArray(selection)) {
      selection = selection.split(separator)
    }
    if (!isArray) { // 不是数组返回
      selection = selection.join(separator)
    }
    resolve(selection)
  })
}

/**
 * 删除记录
 * @param {*} rows
 * @param {*} pkKey
 */
action.removeRecord = (selection, confirmMsg = i18n.t('common.dialog.removeRecord'), isArray = false, separator = ',') => {
  return new Promise((resolve, reject) => {
    if (Utils.isEmpty(selection)) {
      action.warning(i18n.t('common.dialog.selectedRecords'))
      return reject()
    }

    if (!Array.isArray(selection)) {
      selection = selection.split(separator)
    }
    if (!isArray) { // 不是数组返回
      selection = selection.join(separator)
    }

    MessageBox.confirm(confirmMsg, i18n.t('common.dialog.title'), {
      type: 'warning'
    }).then(() => {
      resolve(selection)
    }).catch(() => {
      reject()
    })
  })
}

/**
 * 保存成功提示
 */
action.saveSuccessMessage = (message = i18n.t('common.dialog.operateSuccess'), callback) => {
  message = Utils.isNotEmpty(message) ? message : i18n.t('common.dialog.operateSuccess')
  MessageBox.confirm(message,
    i18n.t('common.dialog.title'),
    {
      type: 'success',
      confirmButtonText: i18n.t('common.dialog.saveConfirmButtonText'),
      cancelButtonText: i18n.t('common.dialog.saveCancelButtonText'),
      closeOnClickModal: false,
      callback: (action) => {
        callback(action !== 'confirm')
      }
    })
}

/**
 * 保存成功提示
 */
action.saveSuccessAlert = (message = i18n.t('common.dialog.operateSuccess'), callback) => {
  MessageBox.alert(message,
    i18n.t('common.dialog.title'),
    {
      type: 'success',
      closeOnClickModal: false,
      callback: (action) => {
        callback(action)
      }
    })
}
/**
 * 保存失败
 */
action.saveErrorMessage = (message, callback) => {
  action.warning(message || i18n.t('common.dialog.saveError'))
  if (callback) { callback() }
}
/**
 * 处理列表数据
 * @param vm 当前对象
 * @param data 后台返回的列表数据
 * @param options 参数
 *   dataResultKey 默认 dataResult
 *  pageResultKey 默认 pageResult
 *  resultKey 结果key 默认 listData
 *  pageKey 分页key 默认 pagination
 */
action.handleListData = (vm, data, options = {}) => {
  const dataResultKey = options.dataResultKey || 'dataResult'
  const pageResultKey = options.pageResultKey || 'pageResult'
  const resultKey = options.resultKey || 'listData'
  const pageKey = options.pageKey || 'pagination'
  vm[resultKey] = data ? data[dataResultKey] || [] : []
  vm[pageKey] = data ? data[pageResultKey] || {} : {}
}

/**
 *  设置分页设置
 */
action.setPagination = (pagination, defaultPagination) => {
  pagination.page = defaultPagination ? defaultPagination.page || common.PAGE : common.PAGE
  pagination.limit = defaultPagination ? defaultPagination.limit || common.LIMIT : common.LIMIT
}

/**
 * 设置排序
 */
action.setSorts = (sorts, sort, defaultSorts) => {
  if (sort) {
    const { name, order } = sort
    if (name) {
      sorts[name] = order === 'ascending' ? 'ASC' : 'DESC'
    } else {
      sorts = defaultSorts || {}
    }
  } else {
    sorts = defaultSorts || {}
  }
}

/**
 * 格式分页数据
 * @param {} params 查询的参数
 * @param {} page 分页
 * @param {} sorts 排序
 */
action.formatParams = (params, page, sorts) => {
  const results = {}
  if (params) {
    results.parameters = Object.keys(params).map((k) => {
      return {
        'key': k,
        'value': params[k]
      }
    })
  }
  if (page) {
    results.requestPage = {
      'pageNo': page.page || common.PAGE,
      'limit': page.limit || common.LIMIT,
      'totalCount': page.totalCount || null// mock 数据时候要传
    }
  }
  if (sorts) {
    results.sorts = Object.keys(sorts).map((k) => {
      return {
        'field': k,
        'order': sorts[k]
      }
    })
  }

  return results
}
/**
 * 下载
 */
action.download = (data, fileName, responseType = 'application/octet-stream') => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: responseType })
  if ('download' in document.createElement('a')) { // 非IE下载
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  } else { // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}

/**
 * 导出文件
 */
action.exportFile = (data, fileName, responseType = 'application/octet-stream') => {
  action.download(data, fileName, responseType)
}

export default action
