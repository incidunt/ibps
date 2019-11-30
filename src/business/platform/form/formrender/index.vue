<template>
  <div>
    <!--顶部按钮-->
    <template v-if="actions && actions.length >0">
      <div
        v-sticky="{stickyTop:50}"
        class="form-toolbar hidden-print"
      >
        <div
          :class="['ibps-toolbar--' +$ELEMENT.size]"
          class="ibps-toolbar"
        >
          <div class="header">
            <div class="buttons">
              <ibps-toolbar
                :actions="actions"
                @action-event="handleButtonEvent"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <!--表单-->
    <dynamic-form
      ref="dynamicForm"
      v-model="formData"
      :form-def="formDefData"
      :permissions="permissions"
      :readonly="readonly"
      :params="params"
      :initialization="initialization"
      class="form-container"
    />
  </div>
</template>

<script>
import ActionUtils from '@/utils/action'
import JForm from '../utils/JForm'// 自定义脚本

import DynamicForm from './dynamic-form/dynamic-form'

export default {
  components: {
    DynamicForm
  },
  props: {
    formDef: {
      type: Object,
      required: true
    },
    data: {
      type: Object
    },
    /**
     * @description 工具栏
     */
    buttons: {
      type: Array
    },
    /**
     * 是否只读 (流程实例时候控制)
     */
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     *  @description 扩展参数 比如流程id等
     *流程相关信息:
     * taskId:任务id
     * instanceId：
     * defId：定义Id
     * formOpinionData 流程意见
     */
    params: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      formData: {},
      permissions: null,
      actions: [],
      initialization: false
    }
  },
  computed: {
    formDefData() {
      return JSON.parse(JSON.stringify(this.formDef))
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        if (val && val !== oldVal) {
          const data = JSON.parse(JSON.stringify(val))
          // 表单数据
          this.formData = data.responses || {}
          // 表单权限
          this.permissions = data.permissions || null
        }
      },
      immediate: true,
      deep: true
    },
    /**
     * 功能按钮
     */
    buttons: {
      handler: function(val, oldVal) {
        if (this.$utils.isEmpty(this.buttons)) {
          return null
        }
        const actions = []
        this.buttons.forEach((btn, i) => {
          const button = {
            key: btn.getAlias(),
            label: btn.getLabel(),
            icon: btn.getIcon(),
            type: btn.getStyle(),
            callback: () => {
              // 前置事件
              const result = this.beforeScript(btn.getAlias())
              if (!result) {
                return btn.action.apply(this, [btn])
              } else {
                return
              }
            }
          }
          actions.push(button)
        })
        this.actions = actions
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if (!this.initialization) {
      this.initJForm()
      this.initialization = true
    }
  },
  mounted() {
    if (this.initialization) {
      setTimeout(() => {
        this.loadScript()
      }, 10)
    }
  },
  methods: {
    handleButtonEvent(button, position, data, index) {
      var action = this.actions.find((action) => {
        return button.key === action.key
      })
      if (action) {
        action.callback()
      }
    },
    handleActionEvent(actionKey, args = {}) {
      this.$emit('action-event', actionKey, args)
    },
    callback() {
      this.$emit('callback')
    },
    closeDialog() {
      this.$emit('close')
    },
    getForm() {
      return this.$refs.dynamicForm
    },
    /**
     * 获取表单验证
     */
    validate(callback) {
      this.getForm().validate((valid, invalidFields) => {
        callback(valid, invalidFields)
      })
    },
    formErrorToast() {
      ActionUtils.saveErrorMessage()
    },
    // 处理表单提交验证
    getFormSubmitVerify() {
      const validateResult = JForm._onValidate(this, this.getForm())
      if (typeof (validateResult) !== 'undefined' && !validateResult) {
        if (this.$utils.isObject(validateResult)) {
          return validateResult
        } else {
          return {
            result: false,
            message: '验证不通过,请检查表单'
          }
        }
      }
      return this.getForm().submitVerify()
    },
    /**
     * 获取表单数据
     */
    getFormData() {
      return this.getForm().getFormData()
    },
    /**
     * 获取字段数据
     */
    getData(name) {
      const data = this.getFormData()
      return data[name]
    },
    /**
     * 设置字段数据
     */
    setData(name, value) {
      return this.getForm().setFieldData(name, value)
    },
    /**
     * 设置表单权限
     */
    setFormRights(name, value) {
      return this.getForm().setFormRights(name, value)
    },
    hasFormOpinion() {
      return this.getForm().hasFormOpinion()
    },
    /**
     * 表单意见数据
     */
    getFormOpinionData() {
      return this.getForm().getFormOpinionData()
    },
    /**
     * 初始化脚本
     */
    initJForm() {
      const id = 'JForm'
      let script = document.getElementById(id)
      if (script) {
        script.parentNode.removeChild(script)
      }
      if (this.formDef.attrs && this.formDef.attrs.script) {
        const codeScript = this.formDef.attrs.script
        script = document.createElement('script')
        script.type = 'text/javascript'
        script.id = id
        document.body.appendChild(script)
        try {
          script.appendChild(document.createTextNode(codeScript))
        } catch (ex) {
          script.text = codeScript
        }
        document.body.appendChild(script)
      }
    },
    // 处理脚本
    hasScript() {
      return this.getForm().hasScript
    },
    // 加载脚本
    loadScript() {
      if (!this.hasScript()) {
        return
      }
      JForm._onLoad(this, this.getForm())
    },
    // 表单验证
    onValidate() {
      if (!this.hasScript()) {
        return
      }
    },
    // 前置脚本
    beforeScript(key) {
      if (!this.hasScript()) {
        return
      }
      const beforeSubmitResult = JForm._beforeSubmit(this, key)
      if (typeof (beforeSubmitResult) !== 'undefined' && !beforeSubmitResult) {
        return
      }
    },
    // 后置脚本
    afterScript(key) {
      if (!this.hasScript()) {
        return
      }
      const afterSubmitResult = JForm._afterSubmit(this, key, this.formData)
      if (typeof (afterSubmitResult) !== 'undefined' && !afterSubmitResult) {
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .form-toolbar{
    position: fixed;
    width: 100%;
    margin-top: -50px;
  }
  .form-container{
    margin: 50px 10px 10px 10px;
    height: 100%;
    width: 99%;
  }
</style>
