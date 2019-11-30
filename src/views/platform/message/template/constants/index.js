export const typeOptions = [
  {
    value: 'taskCreate',
    label: '任务创建通知'
  }, {
    value: 'taskBack',
    label: '任务驳回通知'
  }, {
    value: 'taskComplete',
    label: '任务完成通知'
  }, {
    value: 'processEnd',
    label: '流程结束通知'
  }, {
    value: 'bpmnApproval',
    label: '审批提醒'
  }, {
    value: 'bpmnBack',
    label: '驳回提醒'
  }, {
    value: 'bpmnRecover',
    label: '撤消提醒'
  }, {
    value: 'bpmnAgent',
    label: '代理任务审批'
  }, {
    value: 'bpmnDelegate',
    label: '通知被代理人'
  }, {
    value: 'bpmnTaskTrans',
    label: '任务流转任务'
  }, {
    value: 'bpmTransFeedBack',
    label: '流转通知任务反馈意见'
  }, {
    value: 'bpmTransCancel',
    label: '流转任务取消'
  }, {
    value: 'bpmCommuSend',
    label: '沟通通知'
  }, {
    value: 'bpmCommuFeedBack',
    label: '沟通反馈通知'
  }, {
    value: 'bpmHandTo',
    label: '转交通知'
  }, {
    value: 'addSignTask',
    label: '加签通知'
  }, {
    value: 'bpmEndProcess',
    label: '终止流程'
  }, {
    value: 'bpmTaskCancel',
    label: '任务取消'
  }

]
export const defaultOptions = [
  {
    viewValue: true,
    value: 'Y',
    label: '是'
  }, {
    viewValue: false,
    value: 'N',
    label: '否',
    type: 'danger'
  }
]
