export const ownRightsOptions = {
  'none': {
    type: 'none',
    label: '无'
  },
  'all': {
    type: 'all',
    label: '所有人'
  },
  'employee': {
    type: 'employee',
    label: '用户'
  },
  'role': {
    type: 'role',
    label: '角色'
  },
  'org': {
    type: 'org',
    label: '组织(本层级)'
  },
  'orgSub': {
    type: 'orgSub',
    label: '组织(包含子组织)'
  },
  'position': {
    type: 'position',
    label: '岗位'
  }
}
export const typeArr = [
  {
    type: 'employee',
    color: 'primary'
  },
  {
    type: 'role',
    color: 'success'
  },
  {
    type: 'org',
    color: 'info'
  },
  {
    type: 'orgSub',
    color: 'warning'
  },
  {
    type: 'position',
    color: 'danger'
  }
]

export const ownRightsTypes = function() {
  const ownRights = {}
  Object.keys(ownRightsOptions).foreach((key) => {
    const rights = ownRightsOptions[key]
    ownRights[rights.type] = rights
  })
  return ownRights
}

