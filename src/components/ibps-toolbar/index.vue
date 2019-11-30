<template>
  <span class="ibps-actions">
    <template v-for="(button,index) in actions">
      <!--只显示图标-->
      <template v-if="type === 'icon'">
        <el-tooltip
          v-if="handleActionHidden(button.hidden)"
          :key="button.key"
          v-permission="button.permission"
          :content="getLabel(button)"
          :disabled="handleActionDisabled(button.disabled)"
          placement="bottom-start"
        >
          <el-button
            :key="button.key"
            :size="button.size|| $ELEMENT.size "
            :type="getType(button)"
            :icon="getIcon(button)"
            :disabled="handleActionDisabled(button.disabled)"
            class="action-icon"
            @click="emitEventHandler('action-event',button,position,data,index)"
          />
        </el-tooltip>
      </template>

      <template v-else>
        <!--下拉-->
        <template v-if="button.mode === 'dropdown'">
          <el-dropdown
            :key="button.key"
            :hide-on-click="false"
            @command="(action)=> { emitEventHandler('action-event',action,position,data,index) }"
          >
            <span v-if="button.buttonType==='link'" class="el-dropdown-link">
              {{ button.label }}<i v-if="button.rightIcon" class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-button v-else :type="getType(button)">
              {{ button.label }}<i v-if="button.rightIcon" class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu v-if="button.menus && button.menus.length >0" slot="dropdown">
              <el-dropdown-item
                v-for="menu in button.menus"
                :key="menu.key"
                :command="menu"
                :icon="getIcon(menu)"
              >{{ getLabel(menu) }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!--默认-->
        <template v-else>
          <el-button
            v-if="handleActionHidden(button.hidden)"
            :key="button.key"
            v-permission="button.permission"
            :size="button.size||$ELEMENT.size"
            :type="getType(button)"
            :icon="getIcon(button)"
            :disabled="handleActionDisabled(button.disabled)"
            :autofocus="false"
            @click="emitEventHandler('action-event',button,position,data,index)"
          >{{ getLabel(button) }}</el-button>
        </template>
      </template>
    </template>
  </span>
</template>
<script>
import { getButtonIcon, getButtonType } from '@/utils/button'
import permission from '@/directives/permission/index.js' // 权限判断指令
// 工具类
export default {
  name: 'ibps-toolbar',
  directives: { permission },
  props: {
    type: {
      type: String,
      default: 'button'
    },
    actions: {
      type: Array,
      default: () => { return [] }
    },
    position: {
      type: String,
      default: 'toolbar'
    },
    data: Object,
    socpe: {
      type: Object,
      default: () => { return this }
    }
  },
  methods: {
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
    },
    /**
     * 处理按钮隐藏，显示
     */
    handleActionHidden(hidden = false) {
      let isHidden = !hidden
      if (typeof hidden === 'boolean') {
        isHidden = !hidden
      } else if (typeof hidden === 'function') {
        isHidden = !hidden.call(this.socpe, this.data)
      }
      return isHidden
    },
    /**
     * 处理按钮禁用，显示disabled 的方法
     */
    handleActionDisabled(disabled = false, row, action) {
      if (typeof disabled === 'boolean') {
        return disabled
      } else if (typeof disabled === 'function') {
        return disabled.call(row, action)
      }
      return Boolean(disabled)
    },
    getLabel({ label, key }) {
      if (label) return label
      return this.$te('common.buttons.' + key) ? this.$t('common.buttons.' + key) : key
    },
    getIcon({ icon, key }) {
      if (icon) { return icon }
      return getButtonIcon(key)
    },
    getType({ type, key }) {
      if (type) { return type }
      return getButtonType(key)
    }
  }
}
</script>
<style lang="scss" scoped>
  .ibps-actions {
    .action-icon + .action-icon{
     margin-left: 2px;
   }
   .el-dropdown{
     margin-left: 5px;
   }
  }
</style>

