/**
 * 参与者属性
 */
export const partyTypeOptions = [
  {
    value: 'org',
    label: '机构'
  },
  {
    value: 'position',
    label: '岗位'
  },
  {
    value: 'employee',
    label: '员工'
  }
]

/**
 * 属性类型
 */
export const attrTypeOptions = [
  {
    value: 'desc',
    label: '描述属性'
  },
  {
    value: 'query',
    label: '查询属性'
  }
]
/**
 * 数据类型
 */
export const dataTypeOptions = [
  {
    value: 'STRING',
    label: '字符串'
  }, {
    value: 'INT',
    label: '整型'
  }, {
    value: 'DOUBLE',
    label: '浮点'
  }, {
    value: 'BOOLEAN',
    label: '是否（字符串）'
  }, {
    value: 'OPTION',
    label: '选项'
  }, {
    value: 'DATE',
    label: '日期'
  }
]

export const multiOptions = [
  {
    value: 'Y',
    label: '是'
  },
  {
    value: 'N',
    label: '否',
    type: 'danger'
  }
]
