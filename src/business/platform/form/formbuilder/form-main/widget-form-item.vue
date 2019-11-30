<template>
  <div v-if="element && element.id">
    <!--描述-->
    <template v-if="element.field_type==='desc'">
      <div
        class="ibps-desc widget-view"
        :class="{active: selectWidget&&selectWidget.id == element.id}"
        @click.stop="handleSelectWidget(index)"
      >
        <div class="title">{{ element.label }}</div>
        <div
          v-if="element&&element.field_options&&element.field_options.split_line"
          class="divider"
          :class="'ibps-'+element.field_options.line_style||'dashed'"
        />
        <div v-if="element&&element.desc" class="desc">
          {{ element.desc }}
        </div>

        <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-action">
          <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
          <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
        </div>

        <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-drag">
          <i class="ibps-icon-arrows drag-widget" />
        </div>
      </div>
    </template>
    <template v-else-if="element.field_type==='divider'">
      <div
        class="ibps-desc widget-view"
        :class="{active: selectWidget&&selectWidget.id == element.id}"
        @click.stop="handleSelectWidget(index)"
      >
        <el-divider
          :content-position="element.field_options.content_position"
        >{{ element.label }}</el-divider>

        <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-action">
          <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
          <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
        </div>

        <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-drag">
          <i class="ibps-icon-arrows drag-widget" />
        </div>

      </div>
    </template>
    <template v-else>
      <el-form-item
        class="widget-view"
        :class="{active: selectWidget&&selectWidget.id == element.id, 'is_req': element.field_options.required}"
        :label="element.label+(element.field_options && element.field_options.units?'('+element.field_options.units+')':'') "
        :label-width="element.field_options.is_label_width?element.field_options.label_width+(element.field_options.label_width_unit||'px'):null"
        @click.native.stop="handleSelectWidget(index)"
      >
        <widget-form-field
          :element="element"
          @click="handleSelectWidget(index)"
        />
        <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-action">
          <i class="ibps-icon-clone" @click.stop="handleWidgetClone(index)" />
          <i class="ibps-icon-trash" @click.stop="handleWidgetDelete(index)" />
        </div>

        <div v-if="selectWidget&&selectWidget.id == element.id" class="widget-view-drag">
          <i class="ibps-icon-arrows drag-widget" />
        </div>
      </el-form-item>
    </template>
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
      selectWidget: this.select
    }
  },
  computed: {
    fields() {
      return this.data.fields
    }
  },
  watch: {
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
