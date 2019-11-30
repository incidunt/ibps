<template>
  <div :style="{ width:`${width}px`}">
    <el-tabs v-model="activeTabName" type="border-card" class="formbuilder-tab-container">
      <el-tab-pane
        :style="{ width:`${width-3}px`}"
        label="表单字段"
        name="fieldType"
        class="field-type-container"
      >
        <el-scrollbar
          style="height: 100%;width:100%;"
          wrap-class="sidebar-wrapper"
        >
          <div
            v-for="fieldType in fieldTypes"
            :key="fieldType.name"
            class="panel panel-default"
          >
            <div class="panel-heading">{{ fieldType.label }} <el-tooltip :content="fieldType.tip"><i class="el-icon-question" /></el-tooltip>
            </div>
            <div class="panel-body">
              <draggable
                tag="ul"
                :list="fieldType.fields"
                v-bind="{group:{ name:'field', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="handleMove"
                @end="handleMoveEnd"
                @start="handleMoveStart"
              >

                <li
                  v-for="(item, index) in fieldType.fields"
                  :key="index"
                  :class="'data-'+item.field_type"
                  class="form-edit-widget-label"
                >
                  <a>
                    <i class="ibps-icon" :class="item.icon" />
                    <span>{{ (fieldType.fields)[index].label }}</span>
                  </a>
                </li>
              </draggable>

              <!-- <el-row :gutter="10">
                <draggable
                  v-model="fieldType.fields"
                  v-bind="{group:{ name:'field', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                  :move="handleMove"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                >
                  <template v-for="(field,j) in fieldType.fields">
                    <el-col :key="field.field_type" :span="12" class="field-col">
                      <el-button
                        :icon="(fieldType.fields)[j].icon"
                        class="field-button"
                        @click="addField((fieldType.fields)[j])"
                      >{{ (fieldType.fields)[j].label }}</el-button>
                    </el-col>
                  </template>
                </draggable>
              </el-row> -->
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane :style="{ width:`${width-3}px`}" label="业务对象" name="bo">
        <el-scrollbar
          style="height: 100%;width:100%;"
          wrap-class="sidebar-wrapper"
        >
          <el-tree
            :data="boTreeData"
            :props="{
              children: 'children',
              label: 'name'
            }"
            default-expand-all
            @node-click="handleBoClick"
          />
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
// 常量
import FIELD_TYPES from '../../constants/fieldTypes'
import GROUP_FIELDS from '../constants/groupFields'
import { getDefaultAttributes } from '../utils'

import TreeUtils from '@/utils/tree'

export default {
  name: 'left-aside',
  components: {
    Draggable
  },
  props: {
    boData: {
      type: Array
    }
  },
  data() {
    return {
      width: 220,
      activeTabName: 'fieldType',
      fieldTypes: []
    }
  },
  computed: {
    boTreeData() {
      return TreeUtils.transformToArrayFormat(this.boData, {
        idKey: 'id',
        pIdKey: 'parentId'
      })
    }
  },
  created() {
    this.initData()
  },
  methods: {
    /**
     * 初始化数据
     */
    initData() {
      this.initFieldTypes()
    },
    initFieldTypes() {
      const groupFieldMap = {}
      for (const key in FIELD_TYPES) { // 对字段进行分组处理
        const field = FIELD_TYPES[key]
        field.field_type = key
        field.is_input = typeof (field.is_input) === 'boolean' ? field.is_input : true
        const groupKey = field.group || 'common'
        const newField = JSON.parse(JSON.stringify(getDefaultAttributes(field)))
        if (!groupFieldMap[groupKey]) { groupFieldMap[groupKey] = [] }
        groupFieldMap[groupKey].push(newField)
      }
      // 合并分组
      for (const key in GROUP_FIELDS) {
        const groupField = GROUP_FIELDS[key]
        if (!groupField) {
          continue
        }
        groupField.fields = groupFieldMap[key] || []
        if (groupField.fields && groupField.fields.length > 0) {
          this.fieldTypes.push(groupField)
        }
      }
    },
    handleMoveEnd(evt) {
      // console.log('end', evt)
    },
    handleMoveStart({ oldIndex }) {
      // console.log('start', oldIndex, this.basicComponents)
    },
    handleMove() {
      return true
    },
    /**
     * 新增字段
     */
    addField(field) {
      this.$emit('add-field', {
        field: getDefaultAttributes(field)
      })
    },
    /**
     * 设置bo的对象属性
     */
    handleBoClick(data) {
      this.$emit('set-field', data)
    }
  }
}
</script>
<style lang="scss" scoped>
  .field-col {
    padding: 5px;
    padding-left:10px !important;
  }
  .field-button {
    width: 95px;
    overflow: hidden;
    padding: 8px;
    text-align: left;
  }
</style>
