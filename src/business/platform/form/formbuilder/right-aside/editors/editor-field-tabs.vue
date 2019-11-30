<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-body">
        <el-form-item label="风格类型" label-width="100px" style="margin-bottom:0" />
        <el-form-item label-width="0">
          <el-radio-group v-model="fieldItem.field_options.type">
            <el-radio-button label="default">默认</el-radio-button>
            <el-radio-button label="card">卡片化</el-radio-button>
            <el-radio-button label="border-card">选项卡</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项卡位置" label-width="100px" style="margin-bottom:0" />
        <el-form-item label-width="0">
          <el-radio-group v-model="fieldItem.field_options.position">
            <el-radio-button label="left">左对齐</el-radio-button>
            <el-radio-button label="top">顶部对齐</el-radio-button>
            <el-radio-button label="bottom">底部对齐</el-radio-button>
            <el-radio-button label="right">右对齐</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading">标签配置项</div>
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
              <el-input v-model="item.label" size="mini" placeholder="标签名" />
            </div>
            <el-button-group class="actions">
              <el-button size="small" type="text" title="新增" icon="ibps-icon-add" @click="addColumn(i)" />
              <el-button size="small" type="text" title="删除" icon="el-icon-delete" @click="removeColumn(i)" />
              <el-button class="draggable" title="拖动排序" data-role="sort_choice" size="small" type="text" icon="ibps-icon-arrows" />
            </el-button-group>
          </div>
        </draggable>
        <div class="more-actions">
          <div class="el-button el-button--text" @click="addColumn">添加标签页 </div>
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
        label: '标签页',
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

