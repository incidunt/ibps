<template>
  <div>
    <el-table
      v-if="field && field.id"
      :data="tableData"
    >
      <el-table-column>
        <template v-slot:header>
          <span :class="{ 'is_req': field.field_options.required}">{{ field.label }}</span>
        </template>
        <widget-form-field
          :element="field"
        />
      </el-table-column>
    </el-table>
    <div v-if="selectWidget && selectWidget.id == field.id" class="widget-view-action">
      <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
      <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div v-if="selectWidget && selectWidget.id == field.id" class="widget-view-drag">
      <i class="ibps-icon-arrows drag-widget" />
    </div>
  </div>
</template>

<script>
import WidgetFormField from './widget-form-field'
export default {
  components: {
    WidgetFormField
  },
  props: {
    element: Object,
    select: Object,
    index: Number,
    data: Object
  },
  data() {
    return {
      selectWidget: this.select,
      field: this.element,
      tableData: [{ name: '' }]
    }
  },
  computed: {
    fields() {
      return this.data.field_options.columns
    },
    code() {
      return this.data.name
    }
  },
  watch: {
    element: {
      handler(val) {
        this.field = val
      },
      deep: true
    },
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.fields[index]
    },
    handleWidgetDelete(index) {
      if (this.fields.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.fields[index - 1]
        }
      } else {
        this.selectWidget = this.fields[index + 1]
      }

      this.$nextTick(() => {
        this.fields.splice(index, 1)
      })
    },
    handleWidgetClone(index) {
      const cloneData = {
        ...this.fields[index],
        field_options: { ...this.fields[index].field_options },
        id: this.$utils.guid()
      }

      this.fields.splice(index, 0, JSON.parse(JSON.stringify(cloneData)))

      this.$nextTick(() => {
        this.selectWidget = this.fields[index + 1]
      })
    }
  }
}
</script>
