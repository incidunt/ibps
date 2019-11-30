
import Utils from '@/utils/util'
import TreeUtils from '@/utils/tree'

export function getFormVars(boDefData = [], variables, nodeId) {
  // ====== 表单变量  ==========
  const formVars = [...boDefData]

  // ====== 流程变量  ==========
  let vars = variables
  if (Utils.isNotEmpty(nodeId)) {
    vars = variables.filter((v) => {
      if (Utils.isEmpty(v.nodeId) || (v.nodeId === nodeId)) {
        return v
      }
    })
  }
  if (Utils.isNotEmpty(vars)) {
    const flowRootId = Utils.guid()
    const flowRoot = {
      id: flowRootId,
      parentId: '0',
      name: '流程变量'
    }
    vars.forEach(v => {
      formVars.push({
        id: Utils.guid(),
        parentId: flowRootId,
        attrType: 'var',
        name: v.name,
        key: v.key
      })
    })
    formVars.push(flowRoot)
  }

  // =========流程常量
  const bpmConstantId = Utils.guid()
  formVars.push({
    id: bpmConstantId,
    parentId: '0',
    name: '流程常量'
  })
  formVars.push({
    id: Utils.guid(),
    parentId: bpmConstantId,
    name: '流程实例ID',
    key: 'instanceId_',
    attrType: 'bpmConstants',
    type: 'string'
  })
  formVars.push({
    id: Utils.guid(),
    parentId: bpmConstantId,
    name: '流程定义Key',
    key: 'flowKey_',
    attrType: 'bpmConstants',
    type: 'string'
  })

  formVars.push({
    id: Utils.guid(),
    parentId: bpmConstantId,
    name: '发起人',
    key: 'startUser',
    attrType: 'bpmConstants',
    type: 'string'

  })

  return TreeUtils.transformToArrayFormat(formVars)
}
