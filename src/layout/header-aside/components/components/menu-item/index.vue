<template>
  <el-menu-item :index="menu.type==='header'?menu.id:(menu.path || uniqueId)" :type="menu.type">
    <i v-if="menu.icon" :class="`ibps-icon ibps-icon-${menu[iconKey]}`" />
    <ibps-icon-svg v-else-if="menu[iconSvgKey]" :name="menu[iconSvgKey]" />
    <i v-else class="ibps-icon ibps-icon-file-o" />
    <span slot="title">{{ generateTitle(menu[nameKey],menu[labelKey]) || generateTitle('untitled') }}</span>
  </el-menu-item>
</template>

<script>
import { uniqueId } from 'lodash'
import menuUtil from '@/utils/menu'
import I18n from '@/utils/i18n'
export default {
  name: 'ibps-layout-header-aside-menu-item',
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
