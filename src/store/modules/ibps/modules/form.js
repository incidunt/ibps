
export default {
  namespaced: true,
  state: {
    defaultFormDef: {
      name: '未命名表单',
      key: '',
      attrs: {
        inline: false, // 是否使用inline排版
        labelPosition: 'right', // 标签对齐方式
        labelWidth: '100', // 标签宽度
        labelWidthUnit: 'px', // 标签宽度单位
        size: 'small', // 尺寸
        statusIcon: false, // 显示验证图标
        descPosition: 'inline'
      },
      fields: [] // 字段列表
    },
    formDef: {}, // 表单定义
    curField: {},
    curFieldIndex: 0,
    activeName: 'form-property'
  },
  mutations: {
    /**
     * 更新表单定义
     * @param {*} state
     * @param {*} formDef
     */
    updateFormDef(state, formDef) {
      Object.assign(state.formDef, formDef)
    },
    /**
     *  更新表单字段
     * @param {*} state
     * @param {*} fields
     */
    updateFormFields(state, fields) {
      state.formDef.fields = fields
    },
    updateCurField(state, field,) {
      state.formDef.fields.splice(state.curFieldIndex, 1, field)
      state.curField = field
    },

    selectField(state, { field, isInit }) {
      state.curField = field
      // curFieldId, 就切换至'字段配置'页
      if (!isInit) {
        state.asideActiveName = 'field-config'
      }
    },
    toggleAsideActive(state, newName) {
      state.asideActiveName = newName
    }
  }
}
