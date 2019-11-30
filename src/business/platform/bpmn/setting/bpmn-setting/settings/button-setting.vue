<template>
  <div class="panel-default">
    <div class="panel-body">
      <div class="buttons ibps-pb-5 ibps-tr">
        <el-button type="success" size="mini" plain @click="editButton()">添加按钮</el-button>
        <el-button type="primary" size="mini" plain @click="initButton">初始化按钮</el-button>
        <el-button type="danger" size="mini" plain @click="cleanButton">清空按钮</el-button>
      </div>
      <el-table :data="buttons" border style="width: 100%">
        <el-table-column align="center" prop="name" label="按钮名称" />
        <el-table-column align="center" prop="aliasName" label="操作类型" width="180" />
        <el-table-column align="center" label="管理" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editButton(scope.$index)">编辑</el-button>
            <el-button type="text" size="small" @click="removeButton(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-button
      :visible="dialogFormVisible"
      :title="title"
      :data="editData"
      :button-type-map="buttonTypeMap"
      @callback="handleData"
      @close="visible => dialogFormVisible = false"
    />
  </div></template>
<script>
import { initButton, getButton } from '@/api/platform/bpmn/bpmDefinition'
import _defaultsDeep from 'lodash.defaultsdeep'
import EditButton from './../components/edit-button'

export default {
  components: {
    EditButton
  },
  props: {
    data: Array,
    nodeType: {
      type: String,
      default: 'userTask'
    }
  },
  data() {
    return {
      defaultValue: {
        alias: '',
        aliasName: '',
        name: '',
        code: '',
        afterScript: '',
        beforeScript: ''
      },
      buttonTypeMap: {},
      editData: {},
      editIndex: -1,
      dialogFormVisible: false,
      title: '添加按钮'
    }
  },
  computed: {
    buttons() {
      return this.data
    }
  },
  watch: {
    nodeType: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.loadButtonTypes()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 新增、编辑变量
    editButton(index) {
      const data = this.$utils.isNotEmpty(index) ? this.buttons[index] : {}
      this.editData = _defaultsDeep(JSON.parse(JSON.stringify(data)), this.defaultValue)
      this.editIndex = this.$utils.isNotEmpty(index) ? index : -1
      this.title = this.$utils.isNotEmpty(index) ? '编辑按钮' : '添加按钮'
      this.dialogFormVisible = true
    },
    // 删除变量
    removeButton(index) {
      this.buttons.splice(index, 1)
    },
    // 清空变量
    cleanButton() {
      this.$confirm('是否清空按钮?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttons.splice(0, this.buttons.length)
      })
    },
    /**
     * 处理数据
     */
    handleData(data) {
      if (this.editIndex > -1) {
        this.buttons.splice(this.editIndex, 1, data)
      } else {
        this.buttons.push(data)
      }
    },
    initButton() {
      initButton({
        nodeType: this.nodeType
      }).then(response => {
        this.buttons.splice(0, this.buttons.length)
        const buttons = response.data
        buttons.forEach(button => {
          this.buttons.push(button)
        })
      })
    },
    loadButtonTypes() {
      getButton({
        nodeType: this.nodeType
      }).then(response => {
        const buttonTypeMap = {}
        response.data.forEach(buttonType => {
          buttonTypeMap[buttonType.alias] = buttonType
        })
        this.buttonTypeMap = buttonTypeMap
      })
    }
  }
}
</script>
