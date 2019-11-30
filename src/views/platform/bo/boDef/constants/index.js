
const uuid = require('uuid')

export const boTypeOptions = [{
  value: 'object',
  label: '自建对象',
  type: 'success'
},
{
  value: 'out',
  label: '外部表',
  type: 'danger'
}
]
export const createTabelOptions = [
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
export const statusOptions = [
  {
    value: 'actived',
    label: '激活',
    type: 'success'
  }
  // TODO 其他状态
]
export const dataFormatOptions = [
  {
    value: 'json',
    label: 'JSON'
  }
]

export const relationOptions = [
  {
    value: 'one2one',
    label: '一对一'
  },
  {
    value: 'one2many',
    label: '一对多'
  }
]
export const typeOptions = [
  {
    value: 'varchar',
    label: '字符串'
  },
  {
    value: 'number',
    label: '数字型'
  },
  {
    value: 'date',
    label: '日期型'
  },
  {
    value: 'clob',
    label: '大文本'
  }
]
export const formatOptions = [
  {
    value: 'yyyy-MM-dd',
    label: 'yyyy-MM-dd'
  },
  {
    value: 'yyyy-MM-dd HH:mm:ss',
    label: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    value: 'yyyyMMddHHmm',
    label: 'yyyyMMddHHmm'
  },
  {
    value: 'custom',
    label: '自定义'
  }
]
export const struTypeOptions = [
  {
    value: 'list',
    label: '列表'
  },
  {
    value: 'tree',
    label: '树型'
  }
]

export const rootData = [
  {
    name: '业务对象根节点',
    id: '0',
    subBoDefs: []
  }
]
export const subBoDefsAttrs = {
  id: 'af7fffdc-6211-f254-60b0-42a7427b4e2c',
  name: '外键',
  code: 'parentId',
  fieldName: 'PARENT_ID_',
  dataType: 'varchar',
  attrLength: 64,
  precision: 0,
  format: ''
}
export const masterAttrs = {
  type: 'base',
  updateBy: '',
  sn: 1,
  ip: '',
  dataStatus: '',
  updateTime: null,
  defValue: '',
  defId: '',
  createOrgId: '',
  createBy: '',
  createTime: null,
  isNull: 'Y',
  dbtype: '',
  tenantId: '',
  pk: '',
  desc: ''
}

export const defaultAttrs = [
  {
    id: uuid(),
    name: '主键',
    code: 'id',
    fieldName: 'ID_',
    dataType: 'varchar',
    attrLength: 64,
    precision: 0,
    format: ''
  }, {
    id: uuid(),
    name: '租户ID',
    code: 'tenantId',
    fieldName: 'TENANT_ID_',
    dataType: 'varchar',
    attrLength: 64,
    precision: 0,
    format: ''
  }, {
    id: uuid(),
    name: 'IP地址',
    code: 'ip',
    fieldName: 'IP_',
    dataType: 'varchar',
    attrLength: 15,
    precision: 0,
    format: ''
  }, {
    id: uuid(),
    name: '创建人',
    code: 'createBy',
    fieldName: 'CREATE_BY_',
    dataType: 'varchar',
    attrLength: 64,
    precision: 0,
    format: ''
  }, {
    id: uuid(),
    name: '创建时间',
    code: 'createTime',
    fieldName: 'CREATE_TIME_',
    dataType: 'date',
    attrLength: 0,
    precision: 0,
    format: 'yyyy-MM-dd HH:mm:ss'
  }, {
    id: uuid(),
    name: '更新人',
    code: 'updateBy',
    fieldName: 'UPDATE_BY_',
    dataType: 'varchar',
    attrLength: 64,
    precision: 0,
    format: ''
  }, {
    id: uuid(),
    name: '更新时间',
    code: 'updateTime',
    fieldName: 'UPDATE_TIME_',
    dataType: 'date',
    attrLength: 0,
    precision: 0,
    format: 'yyyy-MM-dd HH:mm:ss'
  }
]

export const objectAttrRootData = {
  id: '',
  name: '',
  code: '',
  fieldName: '',
  desc: '',
  isNull: 'Y',
  defValue: '',
  dataType: 'varchar',
  attrLength: '200',
  precision: 0,
  type: '',
  updateBy: '',
  sn: 7,
  ip: '',
  format: 'yyyy-MM-dd',
  dataStatus: '',
  updateTime: null,
  defId: '',
  createOrgId: '',
  createBy: '',
  createTime: null,
  dbtype: '',
  tenantId: '',
  pk: '',
  edit: true
}
