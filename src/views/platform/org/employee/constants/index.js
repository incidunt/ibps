export const statusOptions = [
  {
    value: 'actived',
    label: '已激活',
    type: 'success'
  },
  {
    value: 'inactive',
    label: '未激活',
    type: 'info'
  },
  {
    value: 'expired',
    label: '过期',
    type: 'danger'
  },
  {
    value: 'locked',
    label: '锁定',
    type: 'warning'
  },
  {
    value: 'disabled',
    label: '禁用',
    type: 'danger'
  },
  {
    value: 'deleted',
    label: '已删除',
    type: 'danger'
  }
]

export const genderOptions = [
  {
    value: 'male',
    label: '男'
  },
  {
    value: 'female',
    label: '女',
    type: 'danger'
  }]
export const isSuperOptions = [
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

export const userSecurityTextObj = {
  '1': '必须包含小写字母',
  '2': '必须包含大写字母',
  '3': '必须包含数字',
  '4': '必须包含特殊字符'
}

export const regx = {
  '1': /[a-z]/g,
  '2': /[A-Z]/g,
  '3': /\d+/g,
  '4': /((?=[\x21-\x7e]+)[^A-Za-z0-9])/g
}
