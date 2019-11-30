
import Utils from '@/utils/util'
import QueryBuilder from '@/components/ibps-query-builder/constants'

/**
 * 获取动态参数
 * @param {*} dataTemplate
 */
export function getDynamicParamsConditions(dataTemplate) {
  let dynamicParams = {}
  if (dataTemplate.templates) {
    let template = {}
    let conditions = {}
    // 如果是组合
    if (dataTemplate.showType === 'compose') {
      let tpl = {}
      if (dataTemplate.composeType === 'treeList') {
        tpl = dataTemplate.templates[1]
      } else if (dataTemplate.composeType === 'listTree') {
        tpl = dataTemplate.templates[0]
      }
      if (!tpl) {
        this.$alert('未设置模版！')
        return
      }

      if (tpl.attrs['bind_template'] === 'Y') {
        // TODO:获取模版
        const t = this.getDataByKey(tpl.attrs['bind_template_key'])
        if (t) {
          template = t.templates[0]
        }
      } else {
        template = tpl
      }
    } else {
      template = dataTemplate.templates[0]
    }

    if (Utils.isNotEmpty(template)) {
      conditions = template.filter_conditions
    }
    dynamicParams = buildDynamicParams(conditions)
  }
  return dynamicParams
}

export function buildFelds(fields, datasets) {
  const fieldMap = {}
  fields.forEach(field => {
    if (field.field_type === 'grid' || field.field_type === 'tabs') {
      field.field_options.columns.forEach(column => {
        column.fields.forEach(cfield => {
          fieldMap[cfield.field_name] = cfield
        })
      })
    } else {
      fieldMap[field.field_name] = field
    }
  })
  const rtn = []
  datasets.forEach(dataset => {
    const field = fieldMap[dataset.name]
    if (Utils.isNotEmpty(field)) {
      dataset.field_type = field.field_type
      dataset.field_options = field.field_options
    }
    rtn.push(dataset)
  })
  return rtn
}

export function buildDynamicParams(conditions) {
  const dynamicParams = {}
  if (Utils.isEmpty(conditions)) {
    return dynamicParams
  }
  const filterConditions = Utils.isNotEmpty(conditions) ? conditions[0] : {}
  const filter = filterConditions.filter
  if (filter) {
    _createDynamicParams(dynamicParams, filter)
  }
  return dynamicParams
}

export function _createDynamicParams(params, filter) {
  const rules = filter.rules
  if (Utils.isEmpty(rules)) {
    return
  }
  for (let _i = 0, _len = rules.length; _i < _len; _i++) {
    const rule = rules[_i]
    if (rule.rules) {
      this.buildDynamicParams(params,	rule)
    } else {
      if (QueryBuilder.OPERATORS[rule.operator].nb_inputs > 0 && rule.source === 'dynamic') {
        params[rule.field] = rule
      }
    }
  }
}

/**
 * 构建label标题
 * @param {*} dataTemplate
 */
export function buildLabelTitle(dataTemplate) {
  if (Utils.isEmpty(dataTemplate)) {
    return ''
  }
  // TODO: 不同类型不同
  const template = dataTemplate.templates[0]
  //  标题文字
  const dataTitle = template.attrs.data_title
  const titleType = dataTitle ? dataTitle.type : 'first'
  if (titleType === 'first') {
    return template.result_columns && template.result_columns.length > 0 ? template.result_columns[0].name : ''
  } else {
    const dataTitleTitle = dataTitle.title || ''
    return function(data) {
      const d = dataTitleTitle.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)
      const rtn = []

      d.forEach(n => {
        let a = n
        if (/^\$(_widget_)/.test(n)) { // 对字段进行处理
          const f = n.replace('$_widget_', '').split('#')
          a = data[f[0]] || ''
        }
        rtn.push(a)
      })

      return rtn.join('')
    }
  }
}
