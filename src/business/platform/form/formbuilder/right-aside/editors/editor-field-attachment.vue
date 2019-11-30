<template>
  <div class="panel panel-default bowen-options">
    <div class="panel-heading">参数设置</div>
    <div class="panel-body">
      <el-form-item label-width="120px">
        <template slot="label">
          <el-tooltip content="最大上传数量">
            <div class="ibps-ellipsis">最大上传数量<help-tip prop="fileQuantity" /></div>
          </el-tooltip>
        </template>
        <el-input-number v-model="fieldOptions.max_file_quantity" />
      </el-form-item>
      <el-form-item label-width="120px">
        <template slot="label">
          <el-tooltip content="文件大小(单个)">
            <div class="ibps-ellipsis">文件大小(单个)<help-tip prop="fileSize" /></div>
          </el-tooltip>
        </template>
        <el-input v-model="fieldOptions.max_file_size" placeholder="文件大小(单个)">
          <template slot="append">M</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">上传类型 <help-tip prop="fileType" /></template>
        <el-select v-model="fieldOptions.media_type" style="width:100%;">
          <el-option value="" label="不限制" />
          <el-option v-for="fileType in fileTypeOptions" :key="fileType.value" :value="fileType.value" :label="fileType.label" />
        </el-select>
        <el-input v-if="fieldOptions.media_type==='custom'" v-model="fieldOptions.media" type="textarea" rows="1" resize="none" autosize placeholder="自定义文件类型,逗号[,]分割" style="padding-top:5px;" />
      </el-form-item>

      <el-form-item>
        <template slot="label">
          允许下载
        </template>
        <el-switch v-model="fieldOptions.download" />
      </el-form-item>

      <el-form-item>
        <template slot="label">存储格式<help-tip prop="fileStore" /></template>
        <el-select v-model="fieldOptions.store" style="width:100%;">
          <el-option
            v-for="store in fileStoreOptions"
            :key="store.value"
            :value="store.value"
            :label="store.label"
          />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { fileTypeOptions, fileStoreOptions } from '@/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  data() {
    return {
      fileTypeOptions: fileTypeOptions,
      fileStoreOptions: fileStoreOptions
    }
  }
}
</script>

