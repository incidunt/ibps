<template>
  <el-submenu :index="menu.path || uniqueId">
    <template slot="title">
      <i v-if="menu.icon" :class="`ibps-icon ibps-icon-${menu[iconKey]}`" />
      <ibps-icon-svg v-else-if="menu[iconSvgKey]" :name="menu[iconSvgKey]" />
      <i v-else class="ibps-icon ibps-icon-file-o" />
      <span slot="title">{{ generateTitle(menu[nameKey],menu[labelKey]) || generateTitle('untitled') }}</span>
    </template>
    <template v-for="(child, childIndex) in menu[childKey]">
      <ibps-layout-header-aside-menu-item v-if="child[childKey] === undefined" :key="childIndex" :menu="child" />
      <ibps-layout-header-aside-menu-sub v-else :key="childIndex" :menu="child" />
    </template>
  </el-submenu>
</template>

<script>
import { uniqueId } from 'lodash'
import menuUtil from '@/utils/menu'
import I18n from '@/utils/i18n'

// 组件
import IbpsLayoutMainMenuItem from '../menu-item'

export default {
  name: 'ibps-layout-header-aside-menu-sub',
  components: {
    'ibps-layout-header-aside-menu-item': IbpsLayoutMainMenuItem
  },
  props: {
    menu: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      nameKey: menuUtil.NAME_KEY,
      labelKey: menuUtil.LABEL_KEY,
      iconKey: menuUtil.ICON_KEY,
      iconSvgKey: menuUtil.ICON_SVG_KEY,
      childKey: menuUtil.CHILD_KEY,
      uniqueId: uniqueId('ibps-menu-empty-')
    }
  },
  methods: {
    generateTitle(name, title, ...values) {
      return I18n.generateTitle(name, title, values)
    }
  }
}
</script>
