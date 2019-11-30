
export default {
  namespaced: true,
  state: {
    datasets: []
  },
  actions: {
    /**
     * @description 设置数据集数据
     * @param {Object} state vuex state
     * @param {String} datasets 数据集数据
     */
    setDatasets({ state }, datasets) {
      state.datasets = datasets
    }
  }
}
