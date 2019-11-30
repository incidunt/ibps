
export const planTypeOptions = [
  {
    value: 'once',
    label: '一次'
  }, {
    value: 'minute',
    label: '每天每隔分钟'
  }, {
    value: 'day',
    label: '每天'
  }, {
    value: 'week',
    label: '每周'
  }, {
    value: 'month',
    label: '每月'
  }, {
    value: 'cron',
    label: 'Cron表达式'
  }
]

export const timeOption = [
  {
    value: '1',
    label: '1分钟'
  }, {
    value: '2',
    label: '5分钟'
  }, {
    value: '10',
    label: '10分钟'
  }, {
    value: '15',
    label: '15分钟'
  }, {
    value: '30',
    label: '30分钟'
  }, {
    value: '60',
    label: '1小时'
  }
]
export const weekOptions = [
  {
    value: 'MON',
    label: '星期一'
  },
  {
    value: 'TUE',
    label: '星期二'
  },
  {
    value: 'WED',
    label: '星期三'
  },
  {
    value: 'THU',
    label: '星期四'
  },
  {
    value: 'FRI',
    label: '星期五'
  },

  {
    value: 'SAT',
    label: '星期六'
  },
  {
    value: 'SUN',
    label: '星期天'
  }
]

export const logStateOptions = [
  {
    value: '1',
    label: '成功',
    type: 'success'
  },
  {
    value: '0',
    label: '失败',
    type: 'danger'
  }
]

export const triggerStateOptions = [
  {
    value: 'NORMAL',
    label: '启用',
    type: 'success'
  },
  {
    value: 'PAUSED',
    label: '停止',
    type: 'danger'
  },
  {
    value: 'ERROR',
    label: '执行出错',
    type: 'danger'
  },
  {
    value: 'COMPLETE',
    label: '完成',
    type: 'success'
  },
  {
    value: 'BLOCKED',
    label: '正在执行',
    type: 'success'
  },
  {
    value: 'NONE',
    label: '未启动',
    type: 'info'
  }
]

