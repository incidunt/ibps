import Vue from 'vue'
import { findHashRightsColumn } from '@/api/platform/desktop/column'
// CountTo 组件 === dashboard需要的
import CountTo from 'vue-count-to'
Vue.component('count-to', CountTo)
// 引入 ECharts 主模块
import 'echarts'
// echarts 组件
import VueECharts from 'vue-echarts'
Vue.component('v-chart', VueECharts)

// 日历组件
import FullCalendar from '@/components/ibps-fullcalendar'
Vue.component('v-full-calendar', FullCalendar)

// 工具栏
import IbpsDesktopToolbar from './toolbar'
Vue.component('ibps-desktop-toolbar', IbpsDesktopToolbar)
import '@/assets/styles/pages/dashboard.scss'

import { buildComponent } from './util'

let init = false
const components = []

export function initColumn(systemAlias) {
  findHashRightsColumn({
    systemAlias: systemAlias
  }).then(response => {
    const dataResult = response.data
    // 构建组件
    dataResult.forEach(column => {
      const name = `ibps-desktop-${column.alias}`
      Vue.component(name, (resolve, reject) => {
        resolve(buildComponent(name, column))
      })
      components.push(name)
    })
    init = true
  }).catch((error) => {
    init = true
    console.info(error)
  })
}

/**
 * 是否初始化
 */
export function isInit() {
  return init
}

export function getComponents() {
  return components
}
