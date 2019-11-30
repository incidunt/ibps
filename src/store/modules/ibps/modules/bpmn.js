
export default {
  namespaced: true,
  state: {
    defId: String,
    messageTypes: [],
    nodeList: [],
    userNodeList: [],
    curNode: null,
    boDefData: [],
    variables: []
  },
  actions: {
    /**
     * @description 设置消息类型
     * @param {Object} state vuex state
     * @param {String} messageTypes 消息类型
     */
    setMessageTypes({ state }, messageTypes) {
      state.messageTypes = messageTypes
    },
    /**
     * @description 设置流程变量
     * @param {Object} state vuex state
     * @param {String} variables 流程变量
     */
    setVariables({ state }, variables) {
      state.variables = variables || []
    },
    /**
     * @description 设置业务对象数据
     * @param {Object} state vuex state
     * @param {String} boDefData 业务对象数据
     */
    setBoDefData({ state }, boDefData) {
      state.boDefData = boDefData
    },
    /**
     * @description 设置节点列表
     * @param {Object} state vuex state
     * @param {String} nodeList 节点列表
     */
    setNodeList({ state }, nodeList) {
      state.nodeList = nodeList
      const userNodeList = []
      nodeList.forEach((node) => {
        if (node.nodeType === 'userTask' || node.nodeType === 'signTask') {
          userNodeList.push(node)
        }
      })
      state.userNodeList = userNodeList
    },
    /**
     * @description 设置当前节点
     * @param {Object} state vuex state
     * @param {String} curNode 当前节点
     */
    setCurNode({ state }, curNode) {
      state.curNode = curNode
    },
    /**
     * @description 设置流程定义id
     * @param {Object} state vuex state
     * @param {String} defId 流程定义id
     */
    setDefId({ state }, defId) {
      state.defId = defId
    }

  }
}
