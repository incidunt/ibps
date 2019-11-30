
import fieldTypes from '@/business/platform/form/constants/fieldTypes'
export const buttonsTypes = {
  'hide': {
    key: 'hide',
    label: '隐藏',
    type: '',
    group: ['fields']
  },
  'read': {
    key: 'read',
    label: '只读',
    type: '',
    group: ['fields']
  },
  'required': {
    key: 'required',
    label: '必填',
    type: '',
    group: ['fields']
  },
  'all': {
    key: 'all',
    label: '所有人',
    type: '',
    group: ['read', 'edit', 'required']
  },
  'none': {
    key: 'none',
    label: '无',
    type: '',
    group: ['read', 'edit', 'required']
  },
  'edit': {
    key: 'edit',
    label: '编辑',
    type: '',
    group: ['fields', 'read', 'edit', 'required']
  }
}
export const groupFieldss = {
  'fields': {
    'label': '字段',
    'key': 'fields'
  },
  'read': {
    'label': '只读权限',
    'key': 'read'
  },
  'edit': {
    'label': '编辑权限',
    'key': 'edit'
  },
  'required': {
    'label': '必填权限',
    'key': 'required'
  }
}
export const typeOptions = [
  {
    value: 'all',
    label: '所有人'
  }, {
    value: 'none',
    label: '无'
  }, {
    value: 'add',
    label: '添加'
  }, {
    value: 'remove',
    label: '删除'
  }
]
export const ownRightsOptions = {
  'NONE': {
    type: 'none',
    label: '无'
  },
  'ALL': {
    type: 'all',
    label: '所有人'
  },
  'USER': {
    type: 'employee',
    label: '用户'
  },
  'ROLE': {
    type: 'role',
    label: '角色'
  },
  'ORG': {
    type: 'org',
    label: '组织(本层级)'
  },
  'ORG_SUB': {
    type: 'orgSub',
    label: '组织(包含子组织)'
  },
  'POSITION': {
    type: 'position',
    label: '岗位'
  }
}
const getTableFieldTypes = function() {
  const tableFieldTypes = []
  for (const type in fieldTypes) {
    const field = fieldTypes[type]
    field.value = type
    tableFieldTypes.push(field)
  }
  return tableFieldTypes
}
export const tableFieldTypes = getTableFieldTypes()
