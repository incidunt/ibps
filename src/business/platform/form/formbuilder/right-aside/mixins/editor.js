export default {
  props: {
    fieldItem: {
      type: Object,
      required: true
    },
    types: {
      type: String
    },
    boData: {
      type: Array
    },
    fields: {
      type: Array
    }
  },
  computed: {
    fieldOptions() {
      return this.fieldItem.field_options || {}
    },
    fieldType() {
      return this.fieldItem.field_type
    },
    code() {
      return this.fieldItem.code
    },
    isSub() {
      return !!this.fieldItem.isSub
    },
    // 业务对象的字段
    boFields() {
      if (this.$utils.isEmpty(this.boData)) {
        return []
      }
      if (this.fieldItem.field_type === 'table') {
        return this.boData.filter((bo) => {
          return bo.type === 'table'
        })
      } else {
        if (this.isSub) {
          if (this.$utils.isNotEmpty(this.code)) {
            return this.boData.filter((bo) => {
              return bo.attrType === 'subField' && bo.tableName === this.code
            })
          } else {
            return []
          }
        } else {
          return this.boData.filter((bo) => {
            return bo.attrType === 'field'
          })
        }
      }
    }
  }
}
