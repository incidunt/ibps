<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="人员类型：">
        <el-radio-group v-model="formData.source" @change="SameNode=>handleSameNode=SameNode">
          <el-radio
            v-for="item in userTypeOptions"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.source==='node'" label="节点：">
        <el-select v-model="formData.nodeId" @change="handleNode">
          <el-option
            v-for="node in nodeList"
            :key="node.value"
            :label="node.label"
            :value="node.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button :style="{'float':'right','marginBottom':'5px'}" type="primary" @click="addUser">添加</el-button>
    </div>
    <div class="tableContent">
      <el-table :data="formData.settings" border style="width: 100%">
        <el-table-column align="center" prop="graderel" label="上下级">
          <template slot-scope="scope">
            <el-select v-model="scope.row.graderel" placeholder="请选择">
              <el-option
                label="同级"
                value="s"
              />
              <el-option
                label="上级"
                value="u"
              />
              <el-option
                label="下级"
                value="d"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="grade" label="级数">
          <template slot-scope="scope">
            <el-input v-model="scope.row.grade" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="principal" label="是否负责人">
          <template slot-scope="scope">
            <el-select v-model="scope.row.principal" placeholder="请选择">
              <el-option
                label="是"
                value="Y"
              />
              <el-option
                label="否"
                value="N"
              />
            </el-select>
          </template>

        </el-table-column>
        <el-table-column align="center" label="管理" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import pluginMixin from '../mixins/plugin'
export default {
  mixins: [pluginMixin],
  data() {
    return {
      userTypeOptions: [
        { value: 'start', label: '发起人' },
        { value: 'prev', label: '上一步执行人' },
        { value: 'node', label: '相同节点执行人' }
      ],
      defaultData: {
        source: '',
        nodeId: '',
        nodeName: '',
        settings: []
      }
    }
  },
  methods: {
    addUser() {
      this.formData.settings.push({
        graderel: 's',
        grade: '1',
        principal: 'N'
      })
    },
    deleteRow(index, rows) {
      this.formData.settings.splice(index, 1)
    },
    getData() {
      const source = this.formData.source
      if (this.$utils.isEmpty(source)) {
        return {
          result: false,
          message: '请选择人员类型！'
        }
      }
      if (this.$utils.isEmpty(this.formData.settings)) {
        return {
          result: false,
          message: '请添加上下级设置！'
        }
      }

      let description = this.userTypeMap[source].label

      switch (source) {
        case 'node':
          if (this.$utils.isEmpty(this.formData.nodeId)) {
            return {
              result: false,
              message: '请指定节点'
            }
          }
          description += '【' + this.formData.nodeName + '】'
          break
        default:
          break
      }

      this.formData['description'] = description
      return {
        data: this.formData,
        result: true
      }
    }
  }
}
</script>

