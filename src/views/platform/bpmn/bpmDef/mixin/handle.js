import { remove, deploy, cleanData, batchSuspend, batchRecover, exportFile } from '@/api/platform/bpmn/bpmDefinition'
import ActionUtils from '@/utils/action'
import fecha from '@/utils/fecha'

export default {
  methods: {
    /**
     * 设置分类
     */
    handleSetCat(ids) {
      this.editId = ids
      this.settingTypeFormVisible = true
    },
    /**
     * 设计流程建模
     */
    handleDesign(editId) {
      this.editId = editId || ''
      this.designFormVisible = true
    },
    /**
     * 启动流程
     */
    handleStart(editId) {
      this.editId = editId || ''
      this.startFormVisible = true
    },
    /**
     * 复制流程
     */
    handleCopy(data) {
      this.title = '请输入新流程定义Key(原流程定义Key【' + data.defKey + '】)'
      this.editId = data.id || ''
      this.data = data
      this.copyFormVisible = true
    },
    /**
     * 流程设置
     */
    handleSetting(defId, defKey) {
      this.editId = defId
      this.defKey = defKey
      this.settingFormVisible = true
    },
    /**
     * 发布流程
     */
    handleDeploy(id) {
      this.$confirm('确定要发布吗?', '信息').then(() => {
        deploy({ defId: id }).then(response => {
          ActionUtils.successMessage('发布成功！')
          this.search()
        }).catch(() => {
        })
      }).catch(() => {})
    },
    /**
     * 编辑指南
     */
    handleEditGuide(editId) {
      this.editId = editId || ''
      this.editGuideFormVisible = true
      this.title = '编辑指南'
    },
    /**
     * 清除数据
     */
    handleClear(id) {
      this.$confirm('确定要清除数据吗?', '提示').then(() => {
        cleanData({ defId: id }).then(response => {
          ActionUtils.successMessage('清除数据成功！')
          this.search()
        }).catch(() => {
        })
      }).catch(() => {})
    },
    handleRemove(ids) {
      remove({ defIds: ids }).then(response => {
        ActionUtils.removeSuccessMessage()
        this.search()
      }).catch(() => {
      })
    },
    handleBatchSuspend(ids, batch = false) {
      this.$confirm('确认批量挂起流程定义？', '信息').then(() => {
        this.$confirm('是否级联挂起运行实例？', '信息', {
          confirmButtonText: '是',
          cancelButtonText: '否'
        }).then(() => {
          this.batchSuspend(ids, true)
        }).catch(() => {
          this.batchSuspend(ids, false)
        })
      }).catch(() => {})
    },
    batchSuspend(defIds, cascade) {
      batchSuspend({ defIds, cascade }).then(response => {
        ActionUtils.successMessage('成功挂起流程定义')
        this.search()
      }).catch(() => {

      })
    },
    handleBatchRecover(ids, batch = false) {
      this.$confirm('确认批量恢复流程定义？', '信息').then(() => {
        this.$confirm('是否级联恢复运行实例？', '信息', {
          confirmButtonText: '是',
          cancelButtonText: '否'
        }).then(() => {
          this.batchRecover(ids, true)
        }).catch(() => {
          this.batchRecover(ids, false)
        })
      }).catch(() => {})
    },
    batchRecover(defIds, cascade) {
      batchRecover({ defIds, cascade }).then(response => {
        ActionUtils.successMessage('成功恢复流程定义')
        this.search()
      }).catch(() => {})
    },
    handImport() {
      this.importFormVisible = true
    },
    handleExport(ids) {
      exportFile({ ids: ids }).then((response) => {
        if (!response) {
          return
        }
        ActionUtils.exportFile(
          response.data,
          'bpmDef_' + fecha.formatDate('yyyyMMddHHmmss') + '.zip'
        )
      }).catch(() => {

      })
    }
  }
}
