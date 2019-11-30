<template>
  <div>
    <div v-if="enableCommon">
      <template v-if="!disabled && commonStatments">
        <el-dropdown
          @command="handlecommonStatment"
        >
          <el-link class="el-dropdown-link" type="primary" :underline="false">
            常用语<i class="el-icon-arrow-down el-icon--right" />
          </el-link>
          <el-dropdown-menu slot="dropdown">
            <template v-if="commonStatments.length>0">
              <template v-for="(common,i) in commonStatments">
                <el-dropdown-item
                  :key="i"
                  :command="common"
                >{{ common.value }}</el-dropdown-item>
              </template>
              <el-dropdown-item
                v-if="totalCount >5"
                divided
                command="more"
              >
                <span class="el-dropdown-link">>>更多...</span>
              </el-dropdown-item>
            </template>
            <template v-else>
              <el-dropdown-item
                command="none"
              >
                <span>未设置常用语</span>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <span v-else class="el-dropdown-link">
        常用语<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <!--快捷常用语
         <el-link
        v-for="(shortcut,i) in shortcutTags"
        :key="i"
        :type="shortcut.type"
        @click="handleShortcut(shortcut)"
      >{{ shortcut.label }}</el-link> -->
    </div>
    <el-input ref="input" v-model="data" type="textarea" rows="4" :disabled="disabled" />
    <common-statment
      :visible="commonStatmentVisible"
      :title="title"
      :action="action"
      label-key="value"
      @close="visible => commonStatmentVisible= visible"
      @action-event="handleActionEvent"
    />
  </div>
</template>
<script>
import { queryIncludeNull } from '@/api/platform/bpmn/bpmCommonStatment'
import { valueEquals } from 'element-ui/src/utils/util'
import emitter from 'element-ui/src/mixins/emitter'
import ActionUtils from '@/utils/action'
import CommonStatment from './common-statment/dialog'

export default {
  components: {
    CommonStatment
  },
  mixins: [emitter],
  props: {
    value: {
      type: String
    },
    action: {
      type: String
    },
    enableCommon: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data() {
    return {
      commonStatmentVisible: false,
      title: '',
      shortcutTags: [{
        type: 'success',
        label: '同意'
      },
      {
        type: 'danger',
        label: '反对'
      },
      {
        type: 'warning',
        label: '拒绝'
      }],
      commonStatments: [],
      totalCount: 0
    }
  },
  computed: {
    data: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        if (!valueEquals(val, oldVal)) {
          this.dispatch('ElFormItem', 'el.form.change', val)
        }
      },
      immediate: true
    },
    action: {
      handler(val, oldVal) {
        if (this.enableCommon && !this.disabled) {
          this.loadCommonStatment()
        }
      },
      immediate: true
    }
  },
  methods: {
    loadCommonStatment() {
      let action = this.action
      if (action === 'endProcess' || this.action === 'stop') {
        action = 'manualend'
      }
      queryIncludeNull(ActionUtils.formatParams(
        {
          'Q^ACTION_^S': action,
          'Q^CREATE_BY_^S': this.$store.getters.userId
        }, {
          limit: 5
        })).then(response => {
        const data = response.data
        this.commonStatments = data.dataResult
        this.totalCount = data.pageResult ? data.pageResult.totalCount : 0
      })
    },
    handleShortcut({ label }) {
      if (this.disabled) {
        return
      }
      // TODO: 后面写光标

      // this.data = this.data + label
      this.data = label
    },
    handleCommonStatment(command) {
      if (this.disabled) {
        return
      }
      if (this.$utils.isString(command) && command === 'none') {
        return
      }
      if (this.$utils.isString(command) && command === 'more') {
        this.commonStatmentVisible = true
        this.title = '常用语列表'
        return
      }

      // this.data = this.data + command.value
      this.data = command.value
    },
    getCursorPos(pTextArea) {
      let cursurPosition = -1
      if (pTextArea.selectionStart) { // 非IE浏览器
        cursurPosition = pTextArea.selectionStart
      } else { // IE
        var range = document.selection.createRange()
        range.moveStart('character', -pTextArea.value.length)
        cursurPosition = range.text.length
      }
      return cursurPosition
    },
    handleActionEvent(key, data) {
      console.log(key, data)
      if (key === 'confirm') {
        // this.data = this.data + data.value
        this.data = data.value
        this.commonStatmentVisible = false
      }
    }
  }
}
</script>

