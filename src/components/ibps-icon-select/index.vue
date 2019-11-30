<template>
  <div>
    <el-popover
      ref="pop"
      v-model="pop"
      :placement="placement"
      width="300"
      trigger="click"
    >
      <div v-if="clearable" class="header ibps-clearfix ibps-mb-10">
        <el-button type="danger" icon="el-icon-delete" size="mini" class="ibps-fr" @click="selectIcon()">清空</el-button>
      </div>
      <el-input
        v-model="searchText"
        :clearable="true"
        placeholder="搜索 比如 'logo'"
        prefix-icon="el-icon-search"
      />
      <el-collapse v-if="!searchMode" v-model="collapseActive" class="group">
        <el-collapse-item v-for="(item, index) in fontIcon" :key="index" :title="item.title" :name="index" class="class">
          <el-row class="class-row">
            <el-col v-for="(iconName, iconIndex) in item.icon" :key="iconIndex" :span="4" class="class-col" @click.native="selectIcon(iconName)">
              <i :class="'ibps-icon ibps-icon-' + iconName" />
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <div v-if="searchMode" class="group">
        <div v-for="(item, index) in iconFilted" :key="index" class="class">
          <div class="class-title">{{ item.title }}</div>
          <el-row class="class-row">
            <el-col v-for="(iconName, iconIndex) in item.icon" :key="iconIndex" :span="4" class="class-col" @click.native="selectIcon(iconName)">
              <i :class="'ibps-icon ibps-icon-' + iconName" />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-popover>
    <!-- 允许用户输入 -->
    <el-input
      v-if="userInput"
      v-model="currentValue"
      v-bind="bind"
      style="max-width: 240px;"
    >
      <template v-if="value" slot="prepend">
        <i :class="'ibps-icon ibps-icon-' + value" />
      </template>
      <el-button slot="append" v-popover:pop>
        <i class="ibps-icon ibps-icon-list" />
      </el-button>
    </el-input>
    <!-- 不允许用户输入 -->
    <el-button v-if="!userInput" v-popover:pop>
      <template v-if="value">
        <i :class="'ibps-icon ibps-icon-' + value" />
      </template>
      <template v-else>
        <i :class="icon" />
      </template>
      {{ value ? value : placeholder }}
    </el-button>
  </div>
</template>

<script>
import Emitter from 'element-ui/src/mixins/emitter'
import fontIcon from './data/index'
import { valueEquals } from 'element-ui/src/utils/util'
import { t } from 'element-ui/src/locale'
export default {
  name: 'ibps-icon-select',
  mixins: [Emitter],
  props: {
    // 值
    value: {
      type: String,
      required: false,
      default: ''
    },
    // 占位符
    placeholder: {
      type: String,
      required: false,
      default() {
        return t('el.select.placeholder')
      }
    },
    icon: {
      type: String,
      default: 'el-icon-search"'
    },
    // 弹出界面的方向
    placement: {
      type: String,
      required: false,
      default: 'right'
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      required: false,
      default: true
    },
    // 是否允许用户输入
    userInput: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否在选择后自动关闭
    autoClose: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      // 绑定弹出框
      pop: false,
      // 所有图标
      fontIcon: fontIcon,
      // 组件内输入框的值
      currentValue: '',
      // 搜索的文字
      searchText: '',
      // 不是搜索的时候显示的折叠面板绑定的展开数据
      collapseActive: []
      // collapseActive: [...Array(icon.length)].map((e, i) => i)
    }
  },
  computed: {
    // 输入框上绑定的设置
    bind() {
      return {
        placeholder: this.placeholder,
        clearable: this.clearable,
        ...this.$attrs
      }
    },
    // 是否在搜索
    searchMode() {
      return !!this.searchText
    },
    // 过滤后的图标
    iconFilted() {
      return this.fontIcon.map(iconClass => ({
        title: iconClass.title,
        icon: iconClass.icon.filter(icon => icon.indexOf(this.searchText) >= 0)
      })).filter(iconClass => iconClass.icon.length > 0)
    }
  },
  watch: {
    value(value, oldVal) {
      this.currentValue = value
      if (!valueEquals(value, oldVal)) {
        this.dispatch('ElFormItem', 'el.form.change', value)
      }
    }
  },
  created() {
    this.currentValue = this.value
  },
  methods: {
    selectIcon(iconName = '') {
      this.$emit('input', iconName)
      if (iconName && this.autoClose) {
        this.pop = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/public.scss';
.group {
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  border-top: none;
  border-bottom: none;
  .class {
    .class-title {
      line-height: 30px;
      text-align: center;
      background-color: $color-bg;
      border-radius: 4px;
      margin: 10px 0px;
    }
    .class-row {
      .class-col {
        line-height: 40px;
        text-align: center;
        color: $color-text-sub;
        &:hover {
          color: $color-text-main;
          background-color: $color-bg;
          border-radius: 4px;
          font-size: 26px;
          box-shadow: inset 0px 0px 0px 1px $color-border-1;
        }
      }
    }
  }
}
</style>
