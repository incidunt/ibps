<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form-item label="栅格间隔" label-width="100px">
          <el-input v-model.number="fieldOptions.gutter" type="number" />
        </el-form-item>
        <el-form-item label="水平排列方式" label-width="100px">
          <el-select v-model="fieldOptions.justify" style="width:100%;">
            <el-option value="start" label="左对齐" />
            <el-option value="end" label="右对齐" />
            <el-option value="center" label="居中" />
            <el-option value="space-around" label="两侧间隔相等" />
            <el-option value="space-between" label="两端对齐" />
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式" label-width="100px">
          <el-select v-model="fieldOptions.align" style="width:100%;">
            <el-option value="top" label="顶部对齐" />
            <el-option value="middle" label="居中" />
            <el-option value="bottom" label="底部对齐" />
          </el-select>
        </el-form-item>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading">列配置项</div>
      <div class="panel-body">
        <draggable
          v-model="fieldItem.field_options.columns"
          v-bind="draggableOptions"
          class="list-group"
          @start="isDragging = true"
          @end="()=>{isDragging= false}"
        >
          <div
            v-for="(item,i) in fieldItem.field_options.columns"
            :key="i"
            class="list-group-item"
          >
            <div class="actions-left">
              <el-input v-model.number="item.span" size="mini" type="number" placeholder="栅格值" />
            </div>
            <el-button-group class="actions">
              <el-button size="small" type="text" title="新增" icon="ibps-icon-add" @click="addColumn(i)" />
              <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
              <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
            </el-button-group>
          </div>
        </draggable>
        <div class="more-actions">
          <div class="el-button el-button--text" @click="addColumn">添加列 </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditorMixin from '../mixins/editor'
import Draggable from 'vuedraggable'
export default {
  components: {
    Draggable
  },
  mixins: [EditorMixin],
  data() {
    return {
      draggableOptions: {
        handle: '.draggable',
        ghostClass: 'sortable-ghost',
        distance: 1,
        disabled: false,
        animation: 200,
        axis: 'y'
      }
    }
  },
  methods: {
    addColumn(i = -1, type) {
      const newColumn = {
        span: '',
        fields: []
      }
      if (i > -1) {
        this.fieldItem.field_options.columns.splice(i + 1, 0, newColumn)
      } else {
        this.fieldItem.field_options.columns.push(newColumn)
      }
    },
    removeColumn(i) {
      this.fieldItem.field_options.columns.splice(i, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  .list-group {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
  .list-group-item {
    position: relative;
    display: block;
    padding: 5px;
    margin-bottom: -1px;
    .actions-left{
      height: 24px;
      line-height: 24px;
      .el-input {
          display: inline-block;
          width: 80%;
          vertical-align: middle;
      }
    }

    .actions {
      position: absolute;
      width: 60px;
      top: 2px;
      right: 0;
      line-height: 20px;
      padding-left: 1px;
      .el-button {
        padding-right: 4px;
        margin-right: 2px;
      }
      [data-role="sort_choice"]{
          cursor: move
      }
    }
  }

  .no-move {
    transition: transform 0s;
  }
  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
}
  .more-actions {
    text-align: left;
    margin-top: 5px;
    margin-right:10px;
    .el-button {
      padding-right: 0;
      margin-right: 0;
    }
  }

</style>

