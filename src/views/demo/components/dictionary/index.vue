<template>
  <ibps-container type="full" class="page">
    <el-row :gutter="12">

      <el-col :span="17">
        <el-card>
          <div slot="header" class="clearfix">
            基础示例
          </div>
          <el-row>
            <ibps-dictionary
              v-model="selectedvalue1"
              :type-key="'mz'"
              :placeholder="placeholder1"
            />

            <ibps-highlight>
              &lt;ibps-dictionary v-model="resDictionary" /&gt;
            </ibps-highlight>

          </el-row>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card>
          <div slot="header" class="clearfix">
            <el-icon type="stats-bars" />
            数据展示
          </div>
          <el-row>
            <pre style="font-size:12px;">
{{ showRes }}
            </pre>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            多选
          </div>
          <ibps-dictionary
            v-model="selectedvalue2"
            :type-key="'mz'"
            :placeholder="placeholder1"
            multiple
          />
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            多选[有多选框]
          </div>
          <ibps-dictionary
            v-model="selectedvalue3"
            :type-key="'mz'"
            :placeholder="placeholder1"
            show-checkbox
            multiple
          />
        </el-card>
      </el-col>

    </el-row>

    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            多选[树形]
          </div>
          <ibps-dictionary
            v-model="selectedvalue21"
            :type-key="'tree'"
            :placeholder="placeholder1"
            select-mode="leaf"
            multiple
          />
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            多选[树形][有多选框]
          </div>
          <ibps-dictionary
            v-model="selectedvalue31"
            :type-key="'tree'"
            :placeholder="placeholder1"
            show-checkbox
            multiple
          />
        </el-card>
      </el-col>

    </el-row>

    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            单选树形 [只能选择叶子]
          </div>
          <ibps-dictionary
            v-model="selectedvalue4"
            :type-key="'tree'"
            :placeholder="placeholder1"
            select-mode="leaf"
          />
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            单选树形 [只能选择叶子][完整路径]
          </div>
          <ibps-dictionary
            v-model="selectedvalue5"
            :type-key="'tree'"
            :placeholder="placeholder1"
            select-mode="leaf"
            display-mode="path"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            单选树形 [任意节点]
          </div>
          <ibps-dictionary
            v-model="selectedvalue6"
            :type-key="'tree'"
            :placeholder="placeholder1"
          />
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            单选树形 [任意节点][完整路径]
          </div>
          <ibps-dictionary
            v-model="selectedvalue7"
            :type-key="'tree'"
            :placeholder="placeholder1"
            display-mode="path"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="ibps-mt-10">
      <p>ibps-hyperlink</p>
      <el-col>
        <ibps-hyperlink
          link="http://www.baidu.com"
          text="baidu.com"
        />
      </el-col>
    </el-row>
  </ibps-container>
</template>

<script>
import IbpsDictionary from '@/business/platform/cat/dictionary/select'

export default {
  components: {
    IbpsDictionary
  },
  data() {
    return {
      showRes: null,

      selectedvalue1: '',

      placeholder1: '请选择民族',
      separate1: '>',
      displayType1: 'path',
      multiple1: false,

      selectedvalue2: '',
      selectedvalue3: '',

      selectedvalue21: '',
      selectedvalue31: '',

      selectedvalue4: 'xj2',
      selectedvalue5: 'xj2',

      selectedvalue6: 'xj2',
      selectedvalue7: 'xj2'
    }
  },
  watch: {
    selectedvalue1(val) {
      this.showRes = val
    },
    selectedvalue2(val) {
      this.showRes = val
    },
    selectedvalue3(val) {
      this.showRes = val
    },
    selectedvalue4(val) {
      this.showRes = val
    },
    selectedvalue5(val) {
      this.showRes = val
    },
    selectedvalue6(val) {
      this.showRes = val
    }
  },
  methods: {
    change1(val) {
      console.log(val)
    }
  }
}
</script>

