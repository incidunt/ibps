<template>
  <div class="panel panel-default">
    <div class="panel-heading">图片设置</div>
    <div class="panel-body">
      <el-form-item>
        <template slot="label">图片类型<help-tip prop="imageTypeVal" /></template>
        <el-select v-model="fieldOptions.accept" style="width:100%;">
          <el-option value="" label="不限制" />
          <el-option
            v-for="item in imageTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">图片大小<help-tip prop="imageSizeVal" /></template>
        <el-input v-model="fieldOptions.size" placeholder="文件大小（单个）" type="text"><template slot="append">M</template></el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">图片尺寸<help-tip prop="imageWidthAndHeightVal" /></template>
        <el-input v-model="fieldOptions.width" placeholder="宽度" type="text">
          <template slot="prepend">宽度</template>
          <template slot="append">px</template>
        </el-input>
        <p />
        <el-input v-model="fieldOptions.height" placeholder="高度" type="text">
          <template slot="prepend">高度</template>
          <template slot="append">px</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">图片数量<help-tip prop="imageLimitVal" /></template>
        <el-input v-model="fieldOptions.limit" placeholder="" type="number" />
      </el-form-item>
      <el-form-item>
        <template slot="label">上传方式<help-tip prop="imageUploadTypeVal" /></template>
        <el-select v-model="fieldOptions.uploadType" style="width:100%;">
          <el-option
            v-for="item in uploadTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">提示信息<help-tip prop="placeholder" /></template>
        <el-input v-model="fieldOptions.tip" rows="3" placeholder="" type="textarea" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { imageTypeOptions, uploadTypeOptions } from '@/business/platform/form/constants/fieldOptions'
import EditorMixin from '../mixins/editor'

export default {
  mixins: [EditorMixin],
  data() {
    return {
      imageTypeOptions: imageTypeOptions,
      uploadTypeOptions: uploadTypeOptions
    }
  }
}
</script>

