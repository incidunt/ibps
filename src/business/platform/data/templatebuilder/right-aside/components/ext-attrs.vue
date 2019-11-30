<template>
  <div class="setting-export-container">
    <!-- 扩展属性 -->
    <div class="panel-footer">扩展属性</div>
    <el-form label-position="top">
      <el-form-item>
        <label slot="label">
          数据标题
          <el-tooltip class="item" effect="light" placement="bottom">
            <div slot="content" style="line-height:1.5;">
              本设置用于自定义对话框顶部数据标题，<br>
              数据标题用于快速辨识一条数据，<br>
              适用于自定义对话框顶部数据标题等功能场景中。
            </div>
            <i class="ibps-icon-help" />：
          </el-tooltip>
        </label>
        <el-button type="primary" @click="settingDataTitle()">设置数据标题</el-button>
      </el-form-item>
      <!-- <el-form-item label="导出字段：">
        <el-button type="primary" @click="setDataTitle('expand')">设置导出字段</el-button>
      </el-form-item> -->
    </el-form>
    <!-- <div style="margin:0 0 20px 0;">
          <span>导出时选择字段：</span>
          <el-radio v-model="data.select_field" label="Y">是</el-radio>
          <el-radio v-model="data.select_field" label="N">否</el-radio>
          <span style="margin-left:30px">导出数据形式
            <el-tooltip class="item" effect="light" placement="bottom">
              <div slot="content" style="line-height:1.5;">
                数据库元数据:数据库存什么数据就导出什么数据；<br>
                界面形式数据:界面展示格式是什么样就导出；<br>
                例：用户选择器在数据库保存的是json格式数据，<br>
                数据库元数据导出就直接导出json，<br>
                界面形式数据就导出用户姓名。
              </div>
              <i class="el-icon-warning" />
            </el-tooltip>
            ：
          </span>
          <el-radio v-model="data.export_type" label="db">数据库元数据形式</el-radio>
          <el-radio v-model="data.export_type" label="page">界面形式数据</el-radio>
        </div>
        <div>
          <el-table
            max-height="400px"
            :data="data.fields"
            style="width: 100%"
            border
          >
            <el-table-column
              width="240"
              align="center"
              prop="date"
              label="字段"
            />
            <el-table-column
              prop="name"
            >
              <template slot="header">
                <span style="margin-right:40px;">权限</span>
                <el-button size="mini" @click="setDataTitle('all')">所有人</el-button>
                <el-button size="mini" @click="setDataTitle('none')">无</el-button>
                <el-button size="mini" @click="setDataTitle('editor')">编辑</el-button>
              </template>
              <template v-slot="scope">
                <el-tag
                  v-for="tag in scope.row.name"
                  :key="tag.index"
                  :closable="tag === '无' ? false : true"
                  :type="tag === '无' ? 'info' : ''"
                  @close="handleDeleteTag(tag,scope.$index, scope.row)"
                >
                  {{ tag }}
                </el-tag>
                <div style="display:inline-block;float:right;">
                  <el-button
                    icon="el-icon-edit"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                  />
                  <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="handleRefresh(scope.$index)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <config-selector
            :visible="configSelectorVisible"
            title="导出字段授权"
            @close="visible => configSelectorVisible = visible"
          />
        </div> -->

    <data-title
      :visible="dataTitleDialogVisible"
      :data="attrs.data_title"
      :fields="fields"
      @callback="handleDataTitle"
      @close="(visible)=>dataTitleDialogVisible=visible"
    />
  </div>
</template>

<script>
import DataTitle from './data-title'

export default {
  components: {
    DataTitle
  },
  props: {
    data: {
      type: Object
    },
    fields: {// 字段
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataTitleDialogVisible: false,
      attrs: {}
    }
  },
  watch: {
    'data.attrs': {
      handler: function(val, oldVal) {
        this.attrs = val || {}
      },
      immediate: true
    }
  },
  methods: {
    // 设置数据标题
    settingDataTitle() {
      this.dataTitleDialogVisible = true
    },
    handleDataTitle(data) {
      this.handleData('data_title', data)
    },
    handleData(key, value) {
      this.$emit('input', key, value)
    }
  }
}
</script>

<style lang="scss">
.setting-export-container {
  .el-form {
    margin: 10px 0 0 20px;
  }
  .el-form-item__label {
    line-height: 12px;
  }
  .el-button {
    width: 100%;
  }
}
</style>

