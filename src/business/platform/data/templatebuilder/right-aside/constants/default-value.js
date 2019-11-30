// 查询字段默认值
export const queryDefaultValue = {
  label: '',
  rights: [{ type: 'all' }],
  common: 'Y',
  same: 'Y',
  field_type: 'text',
  field_options: {
    selector_type: 'user',
    datefmt_type: 'date',
    datefmt: 'yyyy-MM-dd',
    options: [{
      val: '',
      label: ''
    }],
    dictionary: ''
  }
}

// 显示字段默认值
export const displayDefaultValue = {
  rights: [{ type: 'all' }],
  noRightStyle: '',
  align: 'left',
  sortable: true,
  same: 'Y',
  field_type: 'text',
  field_options: {
    datefmt_type: 'date',
    datefmt: 'yyyy-MM-dd',
    selector_type: 'user',
    number_type: 'orig',
    options: [{
      val: '',
      label: ''
    }],
    store: 'id',
    dictionary: ''
  }
}

export const displayTreeDefaultValue = {
  id_key: '',
  pid_key: '',
  name_key: '',
  root_pid: '',
  root_label: '',
  is_script: false
}

export const filterConditionDefaultValue = {
  label: '默认条件',
  key: '',
  type: 'condition',
  rights: [{ type: 'all' }],
  filter: {
    condition: 'AND', // 操作符
    rules: []
  }
}

// 结果字段默认值
export const resultDefaultValue = {
  rights: [{ type: 'all' }],
  same: 'Y',
  field_type: 'orig',
  field_options: {
    datefmt_type: 'date',
    datefmt: 'yyyy-MM-dd',
    selector_type: 'user',
    options: [{
      val: '',
      label: ''
    }],
    store: 'id',
    dictionary: '',
    dictionary_name: ''
  }
}

export const fucntionButtonDefaultValue = {
  rights: [{ type: 'all' }],
  position: 'all'
}

// ['search', 'resetSearch', 'moreSearch', 'add',	'remove', 'edit', 'detail', 'print', 'import', 'export', 'sefStartFlow', 'custom'],
export const functionListButtonTypes = ['search', 'resetSearch', 'add',	'remove', 'edit', 'detail']

export const functionTreeButtonTypes = ['refresh', 'expand', 'compress', 'custom']

export const editButtonTypes = ['close', 'save']
// ['close', 'save', 'print', 'sefStartFlow', 'custom']
