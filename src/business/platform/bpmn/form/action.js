import { complete, doEndProcess, doAddSignTask, lock, unlock, suspendProcess, recoverProcess } from '@/api/platform/bpmn/bpmTask'
import { startFlow, saveDraft } from '@/api/platform/bpmn/bpmInst'

export default {
  methods: {
    emitEventHandler(actionName) {
      this.actionName = actionName
      switch (actionName) {
        case 'close': // 关闭窗口
          this.closeDialog()
          break
        case 'flowImage':
          this.flowDiagramVisible = true
          break
        case 'approvalHistory':
          this.approvalHistoryVisible = true
          break
        case 'instanceDetail':
          this.instanceDetailVisible = true
          break
        case 'startFlow':
          this.handleStartFlow()
          break
        case 'saveDraft':
          this.handleSaveDraft()
          break
        case 'agree':
        case 'oppose':
        case 'abandon':
          if (this.isHide()) {
            this.handleAgreeAction(actionName)
          } else {
            this.agreeDialogVisible = true
          }
          break
        case 'rejectToPrevious':
        case 'rejectToStart':
        case 'reject':
          this.rejectDialogVisible = true
          break
        case 'delegate':
          this.delegateReadonly = false
          this.delegateDialogVisible = true
          break
        case 'delegateDetail':
          this.delegateReadonly = true
          this.delegateDialogVisible = true
          break
        case 'addSign':
          this.addSignTaskDialogVisible = true
          break
        case 'endProcess':
          this.approveDialogVisible = true
          break
        case 'print':
          this.handlePrint()
          break
        case 'lock':
          this.handleLock()
          break
        case 'unlock':
          this.handleUnlock()
          break
        case 'forceUnlock':
          this.handleForceUnlock()
          break
        case 'suspendProcess':
          this.handleSuspendProcess()
          break
        case 'recoverProcess':
          this.handleRecoverProcess()
          break
        default:
          break
      }
    },
    isHide() {
      return (this.attributes.isCommonJumpType && this.attributes.isHideOpinion && this.attributes.isHidePath) ||
      (this.attributes.isEnd && this.attributes.isHideOpinion) ||
      (this.hasFormOpinion() && this.isBpmOpinionHide && this.attributes.isHidePath)
    },
    /**
     * 处理启动流程
     */
    handleStartFlow() {
      const firstNodeUserAssign = this.attributes.firstNodeUserAssign || false
      if (firstNodeUserAssign) {
        const formData = this.getFormData()
        if (!formData) return
        this.submitFormData = formData
        this.startFlowDialogVisible = true
      } else {
        this.saveStartFlow()
      }
    },
    /**
     * 保存启动流程
     * @param {*}
     */
    saveStartFlow(params = {}) {
      const formData = this.getFormData()
      if (!formData) return
      const jsonData = {
        defId: this.defId,
        version: this.version || '0',
        data: JSON.stringify(formData)
      }
      if (this.$utils.isNotEmpty(params.nodeUsers)) {
        jsonData.nodeUsers = params.nodeUsers || ''
      }
      if (this.$utils.isNotEmpty(params.destination)) {
        jsonData.destination = params.destination || ''
      }
      if (this.$utils.isNotEmpty(this.proInstId)) {
        jsonData.proInstId = this.proInstId || ''
      }

      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      // 1、直接启动
      startFlow(jsonData).then(response => {
        loading.close()
        this.$alert(`启动成功！`, {
          showClose: false
        }).then(() => {
          // 后置事件
          this.afterScript(this.actionName)
          this.startFlowDialogVisible = false
          this.callback()
        }).catch(() => {})
      }).catch(() => {
        loading.close()
      })
    },
    /**
     * 保存草稿
     */
    handleSaveDraft() {
      // 表单数据
      const formData = this.getFormData()
      if (!formData) return
      const jsonData = {
        defId: this.defId,
        version: this.version || '',
        proInstId: this.proInstId || '',
        data: JSON.stringify(formData)
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      saveDraft(jsonData).then(response => {
        loading.close()
        this.$alert(`保存成功！`, {
          showClose: false
        }).then(() => {
          // 后置事件
          this.afterScript(this.actionName)
          this.callback()
        }).catch(() => {
        })
      }).catch(() => {
        loading.close()
      })
    },
    /**
     * 直接同意流程
     * @param {*} actionName
     */
    handleAgreeAction(actionName) {
      this.handleActionEvent(actionName, {
        opinion: this.hasFormOpinion() ? JSON.stringify(this.getFormOpinionData()) : ''
      })
    },
    /**
     * 处理按钮事件
     * @param {*} actionName
     * @param {*} params
     */
    handleActionEvent(actionName, params) {
      if (actionName === 'agree' ||
       actionName === 'oppose' ||
       actionName === 'abandon' ||
       actionName === 'rejectToPrevious' ||
       actionName === 'rejectToStart' ||
       actionName === 'reject'
      ) {
        this.handleComplete(actionName, params)
      } else if (actionName === 'endProcess') {
        this.handleEndProgress(params)
      } else if (actionName === 'addSign') {
        this.handleAddSignTask(params)
      }
    },
    handleComplete(actionName, params = {}) {
      const formData = this.getFormData()
      if (!formData) return
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      params.actionName = actionName
      params.taskId = this.taskId
      params.data = JSON.stringify(formData)
      complete(params).then(response => {
        loading.close()
        this.$alert(response.message, {
          showClose: false
        }).then(() => {
          this.afterScript(actionName)
          // 关闭窗口
          if (actionName === 'agree' || actionName === 'oppose' || actionName === 'abandon') {
            this.agreeDialogVisible = false
          } else if (actionName === 'rejectToPrevious' || actionName === 'rejectToStart' || actionName === 'reject') {
            this.rejectDialogVisible = false
          }
          // 回调上一个页面
          this.callback()
        }).catch(() => {})
      }).catch(() => {
        loading.close()
      })
    },
    /**
     * 处理终止任务
     * @param {*} params
     */
    handleEndProgress(params) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      doEndProcess({
        taskId: this.taskId,
        endReason: params.opinion
      }).then(response => {
        loading.close()
        this.$alert(response.message, {
          showClose: false
        }).then(() => {
          this.approveDialogVisible = false
          // 回调上一个页面
          this.callback()
        })
      }).catch((err) => {
        loading.close()
        console.info(err)
      })
    },
    /**
     * 补签
     * @param {*} params
     */
    handleAddSignTask(params) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('common.saving')
      })
      doAddSignTask({
        taskId: this.taskId,
        addSignTaskUserId: params.addSignTaskUserId,
        messageType: params.messageType,
        addReason: params.opinion
      }).then(response => {
        loading.close()
        this.$alert(response.message, {
          showClose: false
        }).then(() => {
          this.addSignTaskDialogVisible = false
          // 回调上一个页面
          this.callback()
        })
      }).catch((err) => {
        loading.close()
        console.info(err)
      })
    },
    /**
     * 打印
     */
    handlePrint() {
      const printTemplateId = this.attributes.printTemplateId
      if (this.$utils.isNotEmpty(printTemplateId)) {
        // 打开打印页面
      } else {
        window.print()
      }
    },
    /**
     * 锁定任务
     */
    handleLock() {
      lock({ taskId: this.taskId }).then(response => {
        this.$alert(`锁定任务成功！`, {
          showClose: false
        }).then(() => {
          this.afterScript(this.actionName)
          this.callback()
        }).catch(() => {})
      })
    },
    /**
     * 解锁任务
     */
    handleUnlock() {
      unlock({ taskId: this.taskId }).then(response => {
        this.$alert(`解锁任务成功！`, {
          showClose: false
        }).then(() => {
          this.afterScript(this.actionName)
          this.callback()
        }).catch(() => {})
      })
    },

    /**
     * 强制解锁任务
     */
    handleForceUnlock() {
      unlock({ taskId: this.taskId }).then(response => {
        this.$alert(`强制解锁任务成功！`, {
          showClose: false
        }).then(() => {
          this.afterScript(this.actionName)
          this.callback()
        }).catch(() => {})
      })
    },
    /**
     * 挂起任务
     */
    handleSuspendProcess() {
      this.$confirm('确定挂起任务', '提示', {
        type: 'warning'
      }).then(() => {
        suspendProcess({ taskId: this.taskId }).then(response => {
          this.$alert(`挂起任务成功！`, {
            showClose: false
          }).then(() => {
            this.afterScript(this.actionName)
            this.callback()
          }).catch(() => {})
        })
      }).catch(() => {})
    },
    /**
     * 恢复任务
     */
    handleRecoverProcess() {
      this.$confirm('确定恢复任务', '提示', {
        type: 'warning'
      }).then(() => {
        recoverProcess({ taskId: this.taskId }).then(response => {
          this.$alert(`恢复任务成功！`, {
            showClose: false
          }).then(() => {
            this.afterScript(this.actionName)
            this.callback()
          })
        })
      }).catch(() => {

      })
    }
  }
}
