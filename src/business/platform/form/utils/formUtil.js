
import Utils from '@/utils/util'
import I18n from '@/utils/i18n'
import fecha from '@/utils/fecha'
import FormulaUtil from './formula'
import AddressUtls from '@/components/ibps-address/util'
import { dataFormatMap } from '@/business/platform/form/constants/fieldOptions'
import FormOptions from '@/business/platform/form/constants/formOptions'
import { validateRequired, validateOptions, validateInteger, validateDecimal, validateNumberRange, validateDateBetween } from '@/utils/validate'
import { getScriptValue } from '@/api/platform/form/common'
import { getNextIdByAlias } from '@/api/platform/system/identity'
import { queryLinkageData } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import store from '@/store' // store

window.FormulaUtil = FormulaUtil
window.Utils = Utils
const FormUtil = {
  TABLE_SEPARATOR: '.', // 表分隔符
  EVAL_FORMULA: '',
  NOT_NEED_FIELD: '#not_need_field#', // 不需要通过字段计算的字段
  CACHE_DYNAMIC_VALUE: {},
  CACHE_CURRENT_USER_DATA: {}, // 缓存的用户数据值，包含组织、岗位部门，以后缓存到store 或者缓存
  setResponseFormula(responseFormula, model, code) {
    if (model.field_type === 'table') { //  判断是否是主表，子表他自己处理
      const columns = model.field_options.columns
      if (columns && columns.length > 0) {
        model.field_options.columns.forEach((item) => {
          this.setChangeFormulaData(responseFormula, item, model.name)
        })
      }
    } else { // 主表
      this.setChangeFormulaData(responseFormula, model, code)
    }
  },

  setChangeFormulaData(responseFormula, model, code) {
    const fieldOptions = model.field_options
    const formula = fieldOptions.default_value
    if (fieldOptions.default_value_type !== 'formula' || !formula) {
      return {}
    }
    const changename = code + this.TABLE_SEPARATOR + model.name
    const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
    const z = this.NOT_NEED_FIELD
    const changFormula = {
      changename: changename,
      formula: formula
    }
    let isHasField = false

    d.forEach(n => {
      if (/^\$(_widget_)/.test(n)) { // 对字段进行处理
        const f = n.replace('$_widget_', '').split('#')
        const g = f[0]
        const h = f[1]
        if (Utils.isEmpty(h)) {
          if (!responseFormula[g]) { responseFormula[g] = [] }
          responseFormula[g].push(changFormula)
        }
        isHasField = true
      }
    })
    // 未有要计算改变字段
    if (!isHasField) {
      if (!responseFormula[z]) { responseFormula[z] = [] }
      responseFormula[z].push(changFormula)
    }
  },
  /**
   * 进行公式计算
   * @param {*} responseFormulas
   * @param {*} models
   * @param {*} field
   * @param {*} row
   */
  runCalFormula(responseFormulas, models, field, row) {
    if (Utils.isEmpty(responseFormulas)) { return models }

    const data = JSON.parse(JSON.stringify(models))
    responseFormulas.forEach((responseFormula) => {
      const changename = responseFormula.changename // 修改字段
      const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : []// 改变的对象
      const changeCode = changeObj[0]// 修改的表
      const changeField = changeObj[1]
      const isMainTable = !!Utils.isEmpty(row)// 是否主表
      const curCode = field.code
      const isSameTable = changeObj[0] === curCode // 是否相同的表
      // 获取公式计算的值
      const v = this.getCalFormulaValue(responseFormula, data, curCode, row)
      // 回填值
      if (isMainTable) { // 主表
        data[changeField] = v
      } else {
        if (isSameTable) { // 是否相同子表
          const code = field.table.name// 子表的表名
          data[code][row][changeField] = v
        } else { // 不同子表
          if (field.table.code === changeCode) { // 修改的是否是主表
            data[changeField] = v
          } else {
            data[changeCode].forEach((rowData) => {
              rowData[changeField] = v
            })
          }
        }
      }
    })
    return data
  },
  /**
   * 通过计算的值
   */
  getCalFormulaValue(responseFormula, data, curCode, row) {
    const formula = responseFormula.formula
    const changename = responseFormula.changename// 修改字段
    const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : [] // 改变的对象
    const isMainTable = !!Utils.isEmpty(row)// 是否主表
    const isSameTable = changeObj[0] === curCode // 是否相同的表
    const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
    const e = []
    let v = ''
    d.forEach(n => {
      if (/^\$(_widget_)/.test(n)) {
        const f = n.replace('$_widget_', '').split('#')
        const g = f[0]
        const h = f[1]
        if (Utils.isEmpty(h)) {
          // 获取公式的值 数字
          const t = g.split(this.TABLE_SEPARATOR)
          let val = '""'
          const calCode = t[0] // 当前计算的code
          const key = t[1]
          if (isMainTable) { // 主表
            val = this.getValueByKey(data, key)
          } else { // 子表
            if (isSameTable) { // 相同的表
              val =	this.getValueByKey(data, key, calCode, row)
            } else { // 如果改变的是主表,则取一列的值
              val = this.getColumnValue(data, calCode, key)
            }
          }
          e.push(val)
        } else {
          e.push('\'' + n + '\'')
        }
      } else {
        e.push(n)
      }
    })
    try {
      v = this.evalFormula(e.join(''))
    } catch (e) {
      v = ''
    }
    return v
  },
  getValueByKey(data, key, code, row) {
    if (Utils.isNotEmpty(code)) {
      return this.getRealValue(data[code][row][key])
    } else {
      return this.getRealValue(data[key])
    }
  },
  // TODO 需要传递类型，判断类型不同进行进行计算
  getRealValue(val) {
    if (!val) return '\'\''
    if (!isNaN(val)) {
      return val
    } else {
      return '\'' + val + '\''
    }
  },

  getColumnValue(data, code, key) {
    const tableData = data[code]
    if (Utils.isEmpty(tableData)) {
      return '""'
    }
    const v = tableData.map((d) => {
      return this.getRealValue(d[key])
    })
    return JSON.stringify(v) + ''
  },
  getEvalFormula: function() {
    if (Utils.isEmpty(this.EVAL_FORMULA)) {
      // 做缓存避免运算
      const b = []
      Object.keys(FormulaUtil).forEach(n => {
        b.push('var ' + n + '=FormulaUtil.' + n)
      })

      this.EVAL_FORMULA = b.join(';') + ';'
    }
    return this.EVAL_FORMULA
  },
  evalFormula: function(a) {
    let c = null
    let env = null
    try {
      env = this.getEvalFormula()
      c = new Function(env + 'return ' + a + ';')()
    } catch (e) {
      console.error(e)
      c = null
    }
    return c
  },
  /**
   * 表单提交校验
   * @param {*} formula 计算的公式
   * @param {*} data 数据
   * @param {*} mainCode  主表code
   */
  runFormSubmitVerify(formula, data, mainCode) {
    const d = formula.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
    const e = []
    let v = true

    d.forEach(n => {
      if (/^\$(_widget_)/.test(n)) {
        const f = n.replace('$_widget_', '').split('#')
        const g = f[0]
        const h = f[1]
        if (Utils.isEmpty(h)) {
          // 获取公式的值 数字
          const t = g.split(this.TABLE_SEPARATOR)
          let val = '""'
          const calCode = t[0] // 当前计算的code
          const key = t[1]
          const isMainTable = calCode === mainCode// 是否主表
          if (isMainTable) { // 主表
            val = this.getValueByKey(data, key)
          } else { // 子表  是主表,则取一列的值
            val = this.getColumnValue(data, calCode, key)
          }
          e.push(val)
        } else {
          e.push('"' + n + '"')
        }
      } else {
        e.push(n)
      }
    })

    try {
      v = this.evalFormula(e.join(''))
    } catch (e) {
      console.warn(e)
      v = true
    }

    return v
  },
  getSelectorValue(store, val) {
    if (Utils.isEmpty(val)) return ''
    if (store === 'json') {
      return JSON.stringify(val)
    } else if (store === 'id') {
      return val.map((d) => { return d.id }).join(',')
    } else if (store === 'bind') {
      return val.map((d) => { return d.name }).join(',')
    }
  },

  getSelectorDefaultValue({ data, name, field_options }, callback) {
    if (Utils.isEmpty(data)) { return '' }
    const storeType = field_options.store
    const selectors = []
    if (store === 'bind') {
    // 绑定值回调
      this.bindIdCallback(storeType, field_options.bind_id, selectors, callback)
    }
    return data
  },
  getCurrentDataValue({ selectorType, bindId, name, storeType }, callback) {
    const cacheValue = this.CACHE_CURRENT_USER_DATA[selectorType]
    if (Utils.isNotEmpty(cacheValue)) {
      // 绑定值回调
      this.bindIdCallback(storeType, bindId, cacheValue, callback)
      return this.getSelectorValue(storeType, cacheValue)
    } else {
      const userInfo = store.getters.userInfo
      // 缓存用户
      if (userInfo.employee && userInfo.employee.id) {
        const selectors = [{
          'id': userInfo.employee.id,
          'name': userInfo.employee.name
        }]
        this.CACHE_CURRENT_USER_DATA['user'] = selectors
      }

      // 当前组织
      if (userInfo.org && userInfo.org.id) {
        const selectors = [{
          'id': userInfo.org.id,
          'name': userInfo.org.name
        }]
        this.CACHE_CURRENT_USER_DATA['org'] = selectors
      }
      // 岗位
      if (Utils.isNotEmpty(userInfo.positions)) {
        const selectors = userInfo.positions.map((pos) => {
          return {
            'id': pos.id,
            'name': pos.name
          }
        })
        this.CACHE_CURRENT_USER_DATA['position'] = selectors
      }
      // 角色
      if (Utils.isNotEmpty(userInfo.role)) {
        const selectors = userInfo.role.map((role) => {
          return {
            'id': role.id,
            'name': role.name
          }
        })
        this.CACHE_CURRENT_USER_DATA['role'] = selectors
      }
      // 绑定值回调
      this.bindIdCallback(storeType, bindId, this.CACHE_CURRENT_USER_DATA[selectorType], callback)
      // 回调数据
      callback(name, this.getSelectorValue(storeType, this.CACHE_CURRENT_USER_DATA[selectorType]))
    }
  },
  /**
   * 绑定值回调
   * @param {*} store
   * @param {*} bindId
   * @param {*} value
   * @param {*} callback
   */
  bindIdCallback(store, bindId, value, callback) {
    if (store === 'bind') {
      callback(bindId, this.getSelectorValue('id', value))
    }
  },
  /**
   * 获取字段默认值
   */
  getTableDefaultData(field, callback) {
    const columns = field.field_options.columns
    if (columns && columns.length > 0) {
      columns.forEach(column => {
        const data = FormUtil.getFieldDefaultValue(column, (n, val) => {
          callback(n, val)
        })
        callback(column, data)
      })
    }
  },
  /**
   * 获取字段默认值
   */
  getFieldDefaultValue({ name, field_options, field_type }, callback) {
    const type = field_options.default_value_type || 'fixed'
    const value = field_options.default_value
    // ================= 固定值   =================
    if (type === 'fixed') {
      if (field_type === 'radio' || field_type === 'checkbox' || field_type === 'select') { // 单选，复选，下拉
        const checkedValue = []
        if (field_options.options) {
          field_options.options.forEach(option => {
            if (option['checked']) {
              checkedValue.push(option['val'])
            }
          })
        }
        return checkedValue.join(',')
      } else if (field_type === 'currentDate' || field_type === 'currentTime') { // 当前时间，当前日期
        return fecha.format(new Date(), field_type === 'currentDate' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss')
      } else if (field_type === 'autoNumber') { // 自动编号
        if (field_options.init === 'true' || field_options.init) {
          getNextIdByAlias({
            alias: field_options.identity
          }).then(response => {
            callback(name, response.data)
          }).catch(() => {
          })
        }
      } else if (field_type === 'currentUser' || field_type === 'currentOrg') { // 当前用户、组织
        return this.getCurrentDataValue({
          selectorType: field_type === 'currentUser' ? 'user' : 'org',
          bindId: field_options.bind_id,
          name: name,
          storeType: field_options.store
        }, callback)
      } else if (field_type === 'selector') { // 选择器默认值
        return this.getSelectorDefaultValue({
          data: value,
          name: name,
          field_options: field_options
        }, callback)
      } else if (field_type === 'address') { // 地址 固定值
        return value ? this.getAddressValue(value, '', field_options) : ''
      } else { // 默认值
        return value || ''
      }
      // ================= 预设值   =================
    } else if (type === 'present') {
      if (field_type === 'selector' || field_type === 'currentUser' || field_type === 'currentOrg') { // 当前用户、组织
        return this.getCurrentDataValue({
          selectorType: field_options.selector_type || 'user',
          bindId: field_options.bind_id,
          name: name,
          storeType: field_options.store
        }, callback)
      }
      // ================= 动态值   =================
    } else if (type === 'dynamic') {
      if (Utils.isEmpty(value)) { return }
      if (this.CACHE_DYNAMIC_VALUE[value]) { // TODO 考虑动态参数
        return this.CACHE_DYNAMIC_VALUE[value]
      }
      // 缓存之前的值
      this.getDynamicValue(value).then(data => {
        // 回调数据
        callback(name, data)
      })
    } else if (type === 'today') { // 当前时间
      const datefmt = field_options['datefmt'] || 'yyyy-MM-dd HH:mm:ss'
      return fecha.format(new Date(), datefmt)
    } else {
      return ''
    }
  },
  getAddressTopVal(fieldOptions) {
    const top = fieldOptions.top || 'country'
    const topval = fieldOptions.topval
    if (Utils.isEmpty(topval)) {
      if (top === 'country') { return '0' }
      return '' // 异常配置
    }
    if (top === 'country') {
      return '0'
    } else if (top === 'province' || top === 'city' || top === 'district') {
      return topval[topval.length - 1]
    }
    return ''
  },
  // 地址的值
  getAddressValue(value, model, fieldOptions) {
    const topIndex = AddressUtls.getLevelIndex(fieldOptions.top || 'country')
    const levelIndex = AddressUtls.getLevelIndex(fieldOptions.level || 'district')
    let data = {
      street: fieldOptions.street || ''
    }
    if (Utils.isNotEmpty(model)) {
      data = JSON.parse(model)
    }
    let v = 0
    for (let i = topIndex; i < levelIndex + 1; i++) {
      const key = AddressUtls.levelArr[i]
      data[key] = value[v] || ''
      v++
    }

    return JSON.stringify(data)
  },
  // 控件地址值
  getAddressControlValue(model, fieldOptions) {
    if (Utils.isEmpty(model)) {
      return []
    }
    const data = JSON.parse(model)
    const topIndex = AddressUtls.getLevelIndex(fieldOptions.top || 'country')
    const levelIndex = AddressUtls.getLevelIndex(fieldOptions.level || 'district')
    const val = []
    for (let i = topIndex; i < levelIndex + 1; i++) {
      const key = AddressUtls.levelArr[i]
      if (data[key]) {
        val.push(data[key])
      }
    }
    return val
  },
  // 获得动态值
  getDynamicValue(value, vars) {
    return new Promise((resolve, reject) => {
      getScriptValue({
        script: value,
        vars: vars || ''
      }).then(response => {
        const data = response.data
        this.CACHE_DYNAMIC_VALUE[value] = data
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setResponseLinkages: function(responseLinkages, model, code) {
    if (model.field_type === 'table') { //  判断是否是主表，子表他自己处理
      model.field_options.columns.forEach((item) => {
        this.setChangeLinkagesData(responseLinkages, item, model.name)
      })
    } else { // 主表
      this.setChangeLinkagesData(responseLinkages, model, code)
    }
  },
  setChangeLinkagesData: function(responseLinkages, model, code) {
    const fieldOptions = model.field_options
    const type = fieldOptions.default_value_type
    const linkage = fieldOptions.default_value
    if (type !== 'linkage' || Utils.isEmpty(linkage)) { return }
    const changename = code + this.TABLE_SEPARATOR + model.name
    const changFormula = {
      changename: changename,
      linkage: linkage
    }
    const key = code + this.TABLE_SEPARATOR + linkage.field
    if (!responseLinkages[key]) { responseLinkages[key] = [] }
    responseLinkages[key].push(changFormula)
  },
  // TODO:数据联动
  // 1、主表数据联动 （完成）
  // 2、 子表的数据联动（完成）
  // 3、不同控件间的数据联动
  // 4、支持不同控件进行联动
  // 5、实现多级联动
  runLinkage: function(responseLinkages, data, field, row) {
    if (!responseLinkages) { return }
    const curCode = field.code
    const key = field.name
    for (let i = 0; i < responseLinkages.length; i++) {
      const responseLinkage = responseLinkages[i]
      const linkage = responseLinkage.linkage
      const	changename = responseLinkage.changename// 修改字段
      const changeObj = changename ? changename.split(this.TABLE_SEPARATOR) : []// 改变的对象

      const formParams = {
        key: linkage.dataSource,
        [`Q^${linkage.relyData}^S`]: this.getFieldDataValue(Utils.isEmpty(row), changeObj[0] === curCode, data, key, curCode, row)
      }

      console.info(formParams)
      // 加载数据
      queryLinkageData(ActionUtils.formatParams(formParams)).then(response => {
        const dataResult = response.data
        if (Utils.isNotEmpty(dataResult)) {
          const resultVal = dataResult[linkage.dataField]
          data[changeObj[1]] = resultVal
        }
      }).catch((e) => {
        console.info(e)
      })
    }
  },
  getFieldDataValue: function(isMainTable, isSameTable, data, key, code, row) {
    var val = ''
    if (isMainTable) { // 主表
      val = data[key]
    } else { // 子表
      if (isSameTable) { // 相同的表
        val =	data[code][row][key]
      } else { // 如果改变的是主表,则取一列的值
        const tableData = data[code]
        if (Utils.isEmpty(tableData)) {
          return ''
        }
        const v = tableData.map((d) => {
          return d[key]
        })
        val = JSON.stringify(v) + ''
      }
    }

    return val
  },
  /**
     * 默认权限
     */
  getDefaultRigths(field) {
    const hideRights = field.field_options.hide_rights
    if (Utils.isNotEmpty(hideRights) && hideRights) {
      return FormOptions.t.PERMISSIONS.HIDE
    }
    const readRights = field.field_options.read_rights
    if (Utils.isNotEmpty(readRights) && readRights) {
      return FormOptions.t.PERMISSIONS.READ
    }
    return
  },

  /**
   * 构建表单验证规则
   * @param {*} field
   * @param {*} required
   */
  buildFormRules(field, required) {
    const rules = []
    const fieldOptions = field.field_options || {}
    // 必填验证
    if (required) {
      rules.push({ required: true, message: I18n.t('validate.required') })
      rules.push({ validator: validateRequired, message: I18n.t('validate.required') })
    }
    // 整型验证
    if (fieldOptions.integer) {
      rules.push({ validator: validateInteger, message: I18n.t('validate.integer') })
    }
    // 小数验证
    if (fieldOptions.decimal) {
      rules.push({
        validator: validateDecimal,
        decimal: fieldOptions.decimal
      })
    }

    //  最大、最小字符串长度验证
    if ((fieldOptions['is_min_length'] && Utils.isNotEmpty(fieldOptions['min_length'])) ||
         (fieldOptions['is_max_length'] && Utils.isNotEmpty(fieldOptions['max_length']))) {
      if ((fieldOptions['is_min_length'] && Utils.isNotEmpty(fieldOptions['min_length'])) &&
         (fieldOptions['is_max_length'] && Utils.isNotEmpty(fieldOptions['max_length']))) {
        rules.push({
          min: fieldOptions['is_min_length'] ? fieldOptions['min_length'] : null,
          max: fieldOptions['is_max_length'] ? fieldOptions['max_length'] : null,
          message: `长度在 ${fieldOptions['min_length']} 到 ${fieldOptions['max_length']}个字符`
        })
      } else if ((fieldOptions['is_min_length'] && Utils.isNotEmpty(fieldOptions['min_length'])) &&
      (!fieldOptions['is_max_length'] || Utils.isEmpty(fieldOptions['max_length']))) {
        rules.push({
          min: fieldOptions['min_length'],
          message: `长度至少有 ${fieldOptions['min_length']}个字符`
        })
      } else {
        rules.push({
          max: fieldOptions['max_length'],
          message: `长度不大于${fieldOptions['max_length']}个字符`
        })
      }
    }

    //  最大、最小值验证[数字]
    if ((fieldOptions['is_min'] && Utils.isNotEmpty(fieldOptions['min'])) ||
         (fieldOptions['is_max'] && Utils.isNotEmpty(fieldOptions['max']))) {
      rules.push({
        validator: validateNumberRange,
        min: fieldOptions['is_min'] ? fieldOptions['min'] : null,
        max: fieldOptions['is_max'] ? fieldOptions['max'] : null
      })
    }

    // 日期验证 date_format 不需要

    // // TODO: 日期范围验证-开始、结束时间 date_between
    if (Utils.isNotEmpty(fieldOptions['start_date_type']) ||
       Utils.isNotEmpty(fieldOptions['end_date_type'])) {
      rules.push({
        validator: validateDateBetween,
        startDataType: fieldOptions['start_date_type'],
        startDate: fieldOptions['start_date'],
        startDateInterval: fieldOptions['start_date_interval'],
        endDataType: fieldOptions['end_date_type'],
        endDate: fieldOptions['end_date'],
        endDateInterval: fieldOptions['end_date_interval']
      })
    }

    //  最多、最少选项验证
    if ((fieldOptions['is_min_mum'] && Utils.isNotEmpty(fieldOptions['min_mum'])) ||
     (fieldOptions['is_max_mum'] && Utils.isNotEmpty(fieldOptions['max_mum']))) {
      rules.push({
        validator: validateOptions,
        min: fieldOptions['is_min_mum'] ? fieldOptions['min_mum'] : null,
        max: fieldOptions['is_max_mum'] ? fieldOptions['max_mum'] : null
      })
    }
    // 正则表达式
    if (fieldOptions['data_format']) {
      let dataFormatValue = fieldOptions['data_format_value']
      let dataFormatMsg = fieldOptions['data_format_msg']
      if (fieldOptions['data_format'] !== 'custom') {
        dataFormatValue = dataFormatMap[fieldOptions['data_format']].regexp
        dataFormatMsg = I18n.t('validate.' + fieldOptions['data_format'])
      }

      rules.push({
        pattern: dataFormatValue,
        message: dataFormatMsg
      })
    }

    return rules
  },
  /**
   *初始化表单意见
   */
  initFormOpinionData: function(attrs) {
    if (Utils.isEmpty(attrs)) { return null }
    const opinionList = attrs.opinionList // 表单意见列表
    const formOpinionConfig = attrs.formOpinion // 表单意见配置
    if (Utils.isEmpty(opinionList)) { return null }
    const opinionData = {
      hasNode: false, // 是否包含节点
      opinionList: [], // 表单意见数据list
      formOpinionData: {}, // 表单意见数据
      formOpinionConfig: {} // 表单意见配置
    }

    if (Utils.isEmpty(formOpinionConfig)) { // 没有绑定节点的
      opinionData.hasNode = false
      opinionData.opinionList = opinionList
    } else {
      const opinionMap = {}
      for (let i = 0; i < opinionList.length; i++) {
        const opinion = opinionList[i]
        const nodeId = 	opinion.taskKey
        if (Utils.isEmpty(opinion.completeTime)) { continue }
        const opinionMapList = opinionMap[nodeId]
        if (Utils.isEmpty(opinionMapList)) { opinionMap[nodeId] = [] }
        opinionMap[nodeId].push(opinion)
      }
      const formOpinionData = {}
      for (const k in formOpinionConfig) {
        formOpinionData[k] = opinionMap[formOpinionConfig[k]]
      }
      opinionData.hasNode = true
      opinionData.formOpinionData = formOpinionData
      opinionData.formOpinionConfig = formOpinionConfig
      opinionData.opinionList = opinionList
    }
    return opinionData
  },
  /**
   *  是否有表单意见
   * @param {*} opinionData
   * @param {*} attrs
   */
  hasFormOpinion(opinionData, attrs) {
    return false
  },
  /**
   * 处理流程关联
   */
  getBpmLinkData: function(attrs) {
    if (Utils.isEmpty(attrs)) { return null }
    return {
      currentBpmLink: attrs.currentFormInst,
      postBpmLink: attrs.postFormInst
    }
  }
}

export default FormUtil
