<template>
  <div class="templatebuilder-container">
    <ibps-layout ref="layout">
      <div slot="west">
        <left-aside
          :dataset-key="dataTemplate.datasetKey"
          @update-datasets="updateDatasets"
        />
      </div>
      <template-main
        :data="dataTemplate"
        @save="handleSave"
        @close="closeDialog"
      />
      <div slot="east">
        <right-aside
          ref="rightAside"
          :data="dataTemplate"
          @update="updateDataTemplate"
        />
      </div>
    </ibps-layout>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { save } from '@/api/platform/data/dataTemplate'
import ActionUtils from '@/utils/action'
import LeftAside from './left-aside'
import TemplateMain from './template-main'
import RightAside from './right-aside'

export default {
  components: {
    LeftAside,
    TemplateMain,
    RightAside
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      dataTemplate: {}
    }
  },
  computed: {
    ...mapState({
      datasets: state => state.ibps.dataTemplate.datasets
    })
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.dataTemplate = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      setDatasets: 'ibps/dataTemplate/setDatasets'
    }),
    updateDataTemplate(data) {
      this.dataTemplate = data
    },
    // 更新数据集
    updateDatasets(datasets) {
      this.dataTemplate.datasets = datasets
      this.setDatasets(datasets)
    },
    updateTemplate(template) {

    },
    closeDialog() {
      this.$emit('close', false)
    },
    checkForm(callback) {
      //  表单数据必填校验
      this.$refs.rightAside.validate((valid) => {
        if (!valid) {
          ActionUtils.warning('请检查表单数据是否填写正确')
          callback(false)
          return false
        }

        // 校验表单必填
        if (this.dataTemplate.datasetType === 'table' && this.dataTemplate.type === 'default' &&
              (this.$utils.isEmpty(this.dataTemplate.attrs) || this.$utils.isEmpty(this.dataTemplate.attrs.form_key))) {
          ActionUtils.warning('请绑定表单')
          callback(false)
          return false
        }

        if (this.dataTemplateshowType !== 'compose') {
          if (this.$utils.isEmpty(this.dataTemplate.datasetKey)) {
            ActionUtils.warning('请设置数据集')
            callback(false)
            return false
          }
          if (this.dataTemplate.type === 'dialog' || this.dataTemplate.type === 'valueSource') {
            if (this.dataTemplate.templates && this.dataTemplate.templates.length > 0) {
              if (this.$utils.isEmpty(this.dataTemplate.templates[0].result_columns)) {
                ActionUtils.warning('请至少设置一个返回字段')
                callback(false)
                return false
              }
            }
          }
        }
        callback(true)
      })
    },
    handleSave() {
      this.checkForm((valid) => {
        if (!valid) {
          return
        }
        console.info(this.dataTemplate)
        const loading = this.$loading({
          lock: true,
          text: this.$t('common.saving')
        })
        save({
          data: JSON.stringify(this.dataTemplate)
        }).then(response => {
          loading.close()
          this.$emit('callback', this)
          ActionUtils.saveSuccessMessage(response.message, (rtn) => {
            if (rtn) {
              this.closeDialog()
            } else {
              if (this.$utils.isEmpty(this.dataTemplate.id)) {
                this.dataTemplate.id = response.variables.id
              }
            }
          })
        }).catch((err) => {
          loading.close()
          console.info(err)
        })
      })
    }
  }
}
</script>
<style lang="scss">
.templatebuilder-container {
  overflow: hidden;
  height: 100%;
  .el-aside{
    overflow: hidden;
  }
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__content,
  .el-tabs--border-card > .el-tabs__content{
    position: absolute;
    padding: 0;
    height: calc(100% - 45px);
  }
  .el-tab-pane {
    overflow:auto;
    height: 100%;
    width: 100%;
    border-left: 1px solid #E4E7ED;
    border-right: 1px solid #E4E7ED;
  }
  .panel-heading {
    padding: 10px 10px 4px;
  }

  .left-aside{
    border-right: 1px solid #E4E7ED;
  }

  //==============顶部布局按钮============
  .layout-header {
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-weight: bold;
    text-align: center;
    padding: 6px;
    position: relative;
    overflow: hidden;
    &.border-right{
      border-right: 1px solid #e4e7ed;
    }
    .layout-header-title {
      font-size: 14px;
      margin: 5px;
      padding: 0;
      text-overflow: ellipsis;
      float: left;
      color: #676a6c;
    }
    .layout-tools {
      float: right;
      margin-top: 0;
      position: relative;
      padding: 0 10px;
      .el-button + .el-button {
        margin-left: 0;
     }
    }
  }

  .template-header {
    cursor: pointer;
    border-bottom: 1px solid  #ddd;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #222;
      text-align: left;
      padding: 8px 10px 10px;
      margin: 0;
    }
  }

  .ibps-container-crud__footer{
    border-left: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
  }

}
</style>

