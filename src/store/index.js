import Vue from 'vue'
import Vuex from 'vuex'

import ibps from './modules/ibps'
import getters from './getters'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    ibps
  },
  getters
})

