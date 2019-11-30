<template>
  <div class="panel-body">
    <el-form v-model="bo" label-width="100px">
      <el-form-item label="保存方式：">
        <el-radio v-model="bo.saveMode" label="table">业务表</el-radio>
        <el-radio v-model="bo.saveMode" label="instance">实例表</el-radio>
      </el-form-item>
      <el-form-item label="绑定对象：">
        <bo-def-selector v-model="bo.code" value-key="code" :version="bo.version" @change="changeBo" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { findTreeData } from '@/api/platform/bo/boDef'
import { mapActions } from 'vuex'
import BoDefSelector from '@/business/platform/bo/def/selector'

export default {
  components: {
    BoDefSelector
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      oldCode: '',
      init: false

    }
  },
  computed: {
    bo() {
      return this.data
    }
  },
  watch: {
    'bo.code'(val, oldVal) {
      if (val !== oldVal && !this.init) {
        this.init = true
        this.oldCode = val
      }
      this.setBoData(val)
    }
  },
  methods: {
    ...mapActions({
      setBoDefData: 'ibps/bpmn/setBoDefData'
    }),
    changeBo(data) {
      this.bo.name = data.name
      this.bo.version = data.version
      if (this.$utils.isNotEmpty(this.oldCode) && this.bo.code !== this.oldCode) {
        this.init = false
        this.$alert('业务对象发生变化，请注意修改外部子流程配置，否则无法正常工作！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        // 清空表单
        this.$emit('clean')
      }
    },
    setBoData(code) {
      if (this.$utils.isEmpty(code)) {
        return
      }

      findTreeData({ code: code }).then(response => {
        this.setBoDefData(response.data)
      }).catch(() => {
      })
    }

  }
}
</script>

