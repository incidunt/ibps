<template>
  <div class="ibps-attachment-selector">
    <div
      v-for="(item,index) in items"
      :key="index"
      class="selector-content"
      @click="handleClick(index)"
    >
      <el-tag
        ref="selectorTag"
        class="selector-tag"
        disable-transitions
      >
        <el-tooltip :content="item">
          <span class="ibps-ellipsis"><i class="el-icon-document" /> {{ item }}</span>
        </el-tooltip>
        <div class="tools">
          <el-tooltip v-if="allowReselect" class="item" effect="dark" content="重新选择" placement="bottom-start">
            <i class="ibps-icon-undo" @click.stop="handleReselect(index)" />
          </el-tooltip>
          <el-tooltip v-if="allowRemove" class="item" effect="dark" content="删除" placement="bottom-start">
            <i class="ibps-icon-delete" @click.stop="handleRemove(index)" />
          </el-tooltip>
          <el-tooltip v-if="download" class="item" effect="dark" content="下载" placement="bottom-start">
            <i class="ibps-icon-download" style="color:#409eff" @click.stop="handleDownload(index)" />
          </el-tooltip>
        </div>
      </el-tag>
    </div>
    <ul
      v-if="hasSelect"
      :class="{disabled:disabled}"
      class="selector-list"
      @click="handleSelect"
    >
      <label>
        <div class="plus">+</div>
        <div class="selector-empty">{{ placeholder }}</div>
      </label>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ibps-attachment-selector',
  props: {
    items: {
      type: Array
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    limit: {// 最大允许上传个数
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    download: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: true
    },
    labelKey: {
      type: String,
      default: 'fileName'
    }
  },
  computed: {
    hasSelect() {
      if (this.readonly) return false
      if (!this.multiple && this.items.length >= 1) return false
      if (this.multiple && (this.limit && this.items.length >= this.limit)) return false
      return true
    },
    allowReselect() {
      return !(this.readonly || this.disabled)
    },
    allowRemove() {
      return !(this.readonly || this.disabled)
    }
  },
  methods: {
    handleSelect() {
      if (this.readonly || this.disabled) return
      this.$emit('action-event', 'select')
    },
    handleReselect(index) {
      if (this.readonly || this.disabled) return
      this.$emit('action-event', 'reselect', index)
    },
    handleRemove(index) {
      if (this.readonly || this.disabled) return
      this.$emit('action-event', 'remove', index)
    },
    handleDownload(index) {
      this.$emit('action-event', 'download', index)
    },
    handleClick(index) {
      this.$emit('action-event', 'preview', index)
    }
  }
}
</script>
<style  lang="scss">
.ibps-attachment-selector{
  .selector-list {
    display: block;
    margin-top:0;
    padding: 0;
    background: #fff;
    min-height: 32px;
    max-height: 40px;
    border: dashed 1px #CCC;
    margin-bottom: 2px;
    overflow: auto;
  }
  .selector-list.disabled{
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
  }
  .selector-list.disabled label{
    cursor: not-allowed;
  }

  .selector-list label {
    margin: 0;
    display: table;
    width: 100%;
    font-weight: normal;
    cursor: pointer;
  }
  .selector-list label .plus {
    font-size: 20px;
    width: 20px;
    display: table-cell;
    vertical-align: middle;
    padding-left: 10px;
    padding-top: 0;
    cursor: pointer;
    color: #c0c4cc;
  }
  .selector-list .selector-empty {
    padding: 0 10px 0 0;
    text-align: left;
    line-height: 2;
    display: table-cell;
    vertical-align: middle;
    color: #c0c4cc;
  }
  .selector-content{
      .selector-tag{
        width: 100% ;
        background-color:transparent;
        color:#606266;
        border: none;
        transition: .5s;
        font-size: 15px;
        border: 1px solid #E9E9E9;
        margin-bottom: 6px;
        height: 32px;
        line-height: 30px;
      .el-icon-document{
        color: #409eff;
      }
      .tools{
        display: none;
        float: right;
        .ibps-icon-delete{
          color: #409eff;
          margin-top: 4px;
          margin-right: 0px;
        }
        .ibps-icon-undo{
          margin-right:5px;
          margin-top: 4px;
          color:#409eff;
        }
      }

    }
    .selector-tag:hover{
        color: #409eff;
        cursor: pointer;
        background-color:#f5f7fa;
      .tools{
        display: block;
      }
    }
  }

}
</style>
