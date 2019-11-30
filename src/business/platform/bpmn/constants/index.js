
import one from '@/assets/images/slide/0.jpg'
import two from '@/assets/images/slide/1.jpg'
import three from '@/assets/images/slide/2.jpg'

export const actionOptions = [{
  value: 'agree',
  label: '同意'
}, {
  value: 'oppose',
  label: '反对',
  type: 'danger'
}, {
  value: 'reject',
  label: '驳回',
  type: 'danger'
}, {
  value: 'rejectToStart',
  label: '驳回发起人',
  type: 'danger'
},
{
  value: 'abandon',
  label: '弃权',
  type: 'info'
}
]

/**
 * 任务类型
 */
export const taskTypeOptions = [
  {
    value: 'NORMAL',
    label: '待办',
    type: 'primary'
  },
  {
    value: 'AGENT',
    label: '代理',
    type: 'danger'
  },
  {
    value: 'DELIVERTO',
    label: '转交',
    type: 'yellow'
  }
]

export const unreadMessageOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 'normal',
    label: '普通',
    type: 'primary'
  },
  {
    value: 'system',
    label: '系统消息',
    type: 'danger'
  },
  {
    value: 'bulletin',
    label: '公告',
    type: 'yellow'
  }
]
export const statusOptions = [
  {
    value: 'end',
    label: '结束',
    type: 'danger'
  },
  {
    value: 'suspend',
    label: '挂起',
    type: 'danger'
  },
  {
    value: 'running',
    label: '正在运行',
    type: 'success'
  },
  {
    value: 'manualend',
    label: '人工结束',
    type: 'warning'
  }
]

export const changeTypeOptions = [
  {
    value: 'assignee',
    label: '代理'
  },
  {
    value: 'shift',
    label: '转办'
  }
]

export const changeTypeStatusOptions = [
  {
    value: 'running',
    label: '运行中'
  },
  {
    value: 'finish',
    label: '完成'
  },
  {
    value: 'cancel',
    label: '取消'
  }
]

export const endOptions = [
  {
    value: 'true',
    label: '是'
  },
  {
    value: 'false',
    label: '否'
  }
]

export const status = [
  {
    value: 'end',
    label: '结束',
    type: 'danger'
  },
  {
    value: 'manualend',
    label: '人工结束',
    type: 'warning'
  },
  {
    value: 'finish',
    label: '完成'
  },
  {
    value: 'running',
    label: '正在运行',
    type: 'success'
  },
  {
    value: 'cancel',
    label: '取消'
  },
  {
    value: 'deploy',
    label: '已发布'
  },
  {
    value: 'draft',
    label: '草稿',
    type: 'info'
  },
  {
    value: 'forbidden',
    label: '禁用',
    type: 'danger'
  },
  {
    value: 'forbidden_instance',
    label: '禁用流程实例',
    type: 'danger'
  },
  {
    value: 'suspend',
    label: '挂起',
    type: 'warning'
  },
  { value: 'agree', label: '同意' },
  { value: 'oppose', label: '反对' },
  { value: 'abandon', label: '弃权' },
  { value: 'reject', label: '驳回' },
  { value: 'rejectToStart', label: '驳回到发起人' }
]
export const genderOptions = [
  {
    value: 'male',
    label: '先生'
  },
  {
    value: 'female',
    label: '女士'
  }]

export const noticeOptions = [{
  value: 'draft',
  label: '草稿',
  type: 'gray'
}, {
  value: 'publish',
  label: '发布',
  type: 'success'
}, {
  value: 'deleted',
  label: '删除',
  type: 'danger'
}]
export const favoritesOptions = [
  {
    value: 'deploy',
    label: '已发布'
  },
  {
    value: 'draft',
    label: '草稿',
    type: 'info'
  },
  {
    value: 'forbidden',
    label: '禁用',
    type: 'danger'
  },
  {
    value: 'forbidden_instance',
    label: '禁用流程实例',
    type: 'danger'
  },
  {
    value: 'suspend',
    label: '挂起',
    type: 'warning'
  }]

export const imgOptionsData = [
  {
    picture: one
  },
  {
    picture: two
  },
  {
    picture: three
  }
]

