<template class="fields-table">
  <div>
    <h5>字段列表</h5>
    <div class="ibps-table">
      <el-table
        ref="tables"
        :data="listData"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          type="index"
        />
        <el-table-column
          label="列名"
          prop="field"
        />
        <el-table-column
          label="列注释"
          prop="fieldComment"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.fieldComment" :readonly="readonly" />
          </template>
        </el-table-column>
        <el-table-column
          label="物理类型"
          prop="sqlType"
        />
        <el-table-column
          label="JAVA类型"
          prop="javaType"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.javaType" :readonly="readonly" />
          </template>
        </el-table-column>
        <el-table-column
          label="JAVA属性名"
          prop="propName"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.propName" :readonly="readonly" />
          </template>
        </el-table-column>
        <el-table-column
          label="主键"
          width="55"
          prop="keyName"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.keyName|optionsFilter(keyNameOptions,'type')">
              {{ scope.row.keyName|optionsFilter(keyNameOptions,'label') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="showList"
          width="70"
        >
          <template slot="header" slot-scope="scope">
            <el-checkbox
              v-model="checkAll['showList']"
              :index="scope"
              :disabled="readonly"
              :indeterminate="indeterminate['showList']"
              @change="(value) => { handleCheckAllChange(value,'showList')}"
            >列表</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.showList"
              :disabled="readonly"
              true-label="Y"
              false-label="N"
              @change="(value) =>{ handleCheckedChange(value,'showList')}"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="70"
          prop="showQuery"
        >
          <template slot="header" slot-scope="scope">
            <el-checkbox
              v-model="checkAll['showQuery']"
              :index="scope"
              :disabled="readonly"
              :indeterminate="indeterminate['showQuery']"
              @change="(value) => { handleCheckAllChange(value,'showQuery')}"
            >查询</el-checkbox>
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.showQuery"
              :disabled="readonly"
              true-label="Y"
              false-label="N"
              @change="(value) =>{ handleCheckedChange(value,'showQuery')}"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="允许为空"
          width="75"
          prop="isNull"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.isNull"
              true-label="Y"
              false-label="N"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="控件类型"
          prop="control"
        >
          <template slot-scope="scope">
            <ibps-dictionary
              ref="dictionary"
              v-model="scope.row.control"
              :disabled="readonly"
              :data="fieldControlDictionary"
              type-key="fieldControl"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="默认值"
          prop="defaultValue"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.defaultValue" disabled="disabled" />
          </template>
        </el-table-column>
        <el-table-column
          width="70"
          label="排序"
          prop="sn"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.sn" :readonly="readonly" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import TreeUtils from '@/utils/tree'
import IbpsDictionary from '@/business/platform/cat/dictionary/select'
import { queryFieldList } from '@/api/platform/codegen/tableConfig'
import { findByTypeKey } from '@/api/platform/cat/dictionary'
import { keyNameOptions } from '../constants'

export default {
  components: {
    IbpsDictionary
  },
  props: {
    isFields: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyNameOptions: keyNameOptions,
      listData: [],
      showQuery: [],
      isNull: [],
      control: '',
      list: '',
      demand: '',
      input: '',
      checkedCities: [],
      showListChecked: true,

      fieldControlDictionary: [],

      checkAll: {
        showList: true,
        showQuery: true
      },
      indeterminate: {
        showList: false,
        showQuery: false
      }
    }
  },
  watch: {
    listData: {
      handler: function(val, oldVal) {
        this.$emit('change', val)
      },
      deep: true
    }
  },
  created() {
    this.loadFieldControlDictionary()
  },
  methods: {
    handleCheckAllChange(value, key) {
      this.listData.forEach(data => {
        data[key] = value ? 'Y' : 'N'
      })
    },
    handleCheckedChange(value, key) {
      const checkedCount = this.getCheckedCount(key)
      this.checkAll[key] = checkedCount === this.listData.length
      this.indeterminate[key] = checkedCount > 0 && checkedCount < this.listData.length
    },
    getCheckedCount(key) {
      return this.listData.filter(data => { return data[key] === 'Y' }).length
    },
    clear() {
      this.listData = []
    },
    rootData(data) {
      this.listData = data
      // for (var i = 0; i < this.listData.length; i++) {
      //   this.listData[i].sn = i + 1
      // }
    },
    loadFieldControlDictionary() {
      findByTypeKey({ typeKey: 'fieldControl' }).then(response => {
        const data = response.data
        this.fieldControlDictionary = TreeUtils.transformToArrayFormat(data)
      }).catch(() => {
      })
    },
    init(value) {
      queryFieldList({
        tableName: value,
        boId: '',
        dsAlias: 'dataSource_default'
      }).then(response => {
        this.listData = response.data
        for (var i = 0; i < this.listData.length; i++) {
          this.listData[i].sn = i + 1
        }
        if (value === '') {
          this.listData = []
        } else {
          const data = response.data
          this.listData = data
        }
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.fields-table{
  height: 200px;
  table,th,td,tr{
    border:1px solid #dcdfe6;
  }
  table{
    width: 100%;
    border-collapse:collapse;
  }
  tr th{
    text-align:left;
    background: #F5F5F6;
    margin-top: -1px;
  }
  .checkbox{
    text-align: center;
  }
  .pagination{
    margin-top: -1px;
    border:1px solid #dcdfe6;
  }
  .ibps-table{
    border-right: 1px solid #dcdfe6;
  }
}

</style>
