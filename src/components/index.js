import Vue from 'vue'

import ibpsContainer from './ibps-container'
import ibpsContainerFrame from './ibps-container-frame'
import ibpsLinkBtn from './ibps-link-btn'
import ibpsCheckbox from './ibps-checkbox'

// 注意 有些组件使用异步加载会有影响
Vue.component('ibps-container', ibpsContainer)
Vue.component('ibps-container-frame', ibpsContainerFrame)
Vue.component('ibps-checkbox', ibpsCheckbox)
Vue.component('ibps-link-btn', ibpsLinkBtn)
Vue.component('ibps-highlight', () => import('./ibps-highlight'))
Vue.component('ibps-icon', () => import('./ibps-icon'))
Vue.component('ibps-icon-svg', () => import('./ibps-icon-svg/index.vue'))
Vue.component('ibps-icon-select', () => import('./ibps-icon-select/index.vue'))
Vue.component('ibps-icon-svg-select', () => import('./ibps-icon-svg-select/index.vue'))
Vue.component('ibps-empty', () => import('./ibps-empty/index.vue'))

Vue.component('ibps-toolbar', () => import('./ibps-toolbar/index.vue'))
Vue.component('ibps-crud', () => import('./ibps-crud/index.vue'))
Vue.component('ibps-layout', () => import('./ibps-layout/index.vue'))
Vue.component('ibps-tree', () => import('./ibps-tree/index.vue'))
Vue.component('ibps-list', () => import('./ibps-list/list.vue'))
Vue.component('ibps-item', () => import('./ibps-list/list-item.vue'))
Vue.component('ibps-list-group', () => import('./ibps-list/list-group.vue'))
Vue.component('ibps-hyperlink', () => import('./ibps-link'))
Vue.component('ibps-image', () => import('./ibps-image/index.vue'))
Vue.component('ibps-help', () => import('./ibps-help/index.vue'))

