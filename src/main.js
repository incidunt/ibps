/**
 * 页面的入口
 * <pre>
 * 作者:hugh zhuang
 * 邮箱:3378340995@qq.com
 * 日期:2015-11-02-下午3:29:34
 * 版权:广州流辰信息技术有限公司
 * </pre>
 */
// 解决低版本浏览器不支持promise问题
// import 'babel-polyfill'
// import Es6Promise from 'es6-promise'
// Es6Promise.polyfill()

import Vue from 'vue'// Vue
import App from './App'// 应用

import store from './store' // 存储
import i18n from './i18n' // Internationalization 国际化

// 核心插件
import ibps from '@/plugins/ibps'

// 菜单和路由设置
import router from './router' // 路由

import '@/permission' // permission control 权限控制

// 平台核心插件
Vue.use(ibps)

new Vue({
  router,
  store,
  i18n,
  mounted() {
    // 展示系统信息
    this.$store.commit('ibps/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('ibps/account/load')
    // 获取并记录用户 UA
    this.$store.commit('ibps/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('ibps/fullscreen/listen')
  },
  render: h => h(App)
}).$mount('#app')
