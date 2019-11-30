
export const searchOptions = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 'end',
    label: '结束'
  },
  {
    value: 'manualend',
    label: '人工结束'
  }
]

export const resultTypeOptions = [
  {
    value: 'pending',
    label: '待审批'
  },
  {
    value: 'agree',
    label: '审批通过'
  },
  {
    value: 'oppose',
    label: '审批不通过',
    type: 'warning'
  },
  {
    value: 'complete',
    label: '完成',
    type: 'success'
  },
  {
    value: 'manual_end',
    label: '人工终止',
    type: 'danger'
  }
]

export const statusOptions = [
  {
    value: 'draft',
    label: '草稿',
    type: 'info'
  },
  {
    value: 'running',
    label: '运行中',
    type: 'info'
  },
  {
    value: 'pending',
    label: '挂起',
    type: 'warning'
  },
  {
    value: 'end',
    label: '结束',
    type: 'success'
  },
  {
    value: 'manualend',
    label: '人工结束',
    type: 'danger'
  }
]

