<template>
  <ibps-container type="full" class="page">
    <el-row :gutter="12">

      <el-col :span="17">
        <el-card>
          <div slot="header" class="clearfix">
            基础示例
          </div>
          <el-row>
            <ibps-attachment-selector
              v-model="attachmentValue1"
              :file-size="1024"
              multiple
            />

            <ibps-highlight>
              &lt;ibps-attachment-selector v-model="attachmentValue" /&gt;
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
            单选
          </div>
          <ibps-attachment-selector
            v-model="attachmentValue2"
            :placeholder="placeholder1"
          />
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            多选
          </div>
          <ibps-attachment-selector
            v-model="attachmentValue3"
            :placeholder="placeholder1"
            multiple
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            单选【文件尺寸 1024k】
          </div>
          <ibps-attachment-selector
            v-model="attachmentValue4"
            :placeholder="placeholder1"
            :file-size="1024"
          />
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            多选【限制个数:2个】
          </div>
          <ibps-attachment-selector
            v-model="attachmentValue5"
            :placeholder="placeholder1"
            :limit="2"
            multiple
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            单选[只读]
          </div>
          <ibps-attachment-selector
            v-model="attachmentValue6"
            :placeholder="placeholder1"
            readonly
            download
            preview
          />
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            多选【限制个数:2个】
          </div>
          <ibps-attachment-selector
            v-model="attachmentValue7"
            :placeholder="placeholder1"
            :limit="2"
            multiple
          />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            基础示例
          </div>
          <ibps-image
            :limit="4"
            tip="提示提示提示提示"
            :value="postList"
            :size="1"
            :accept="accept"
          />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            【上传方式为ibps上传附件形式】
          </div>
          <ibps-image
            :limit="4"
            :value="postList"
            :size="1"
            upload-type="ibpsUpload"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="ibps-mt-10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            【限制图片类型：".jpg",大小：1M，上传数量：3】
            【图片尺寸：200*200】
          </div>
          <ibps-image
            :limit="3"
            :value="postList"
            :size="2"
            width="200"
            height="200"
            :accept="accept"
          />
          <div>
            <!-- <el-button @click="submitIt">提交</el-button> -->
          </div>

        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            【限制图片尺寸：100*100】
          </div>
          <ibps-image
            :limit="3"
            :value="postList"
            :size="2"
            width="100"
            height="100"
          />
        </el-card>

      </el-col>
    </el-row>
  </ibps-container>
</template>

<script>
import IbpsAttachmentSelector from '@/business/platform/file/attachment/selector'
import IbpsImage from '@/components/ibps-image'

export default {
  components: {
    IbpsAttachmentSelector,
    IbpsImage
  },
  data() {
    return {
      showRes: null,

      attachmentValue1: '',
      placeholder1: '请选择附件',
      multiple1: true,

      attachmentValue2: '',
      attachmentValue3: '',

      attachmentValue21: '',
      attachmentValue31: '',

      attachmentValue4: '',
      attachmentValue5: '',

      attachmentValue6: '531973109335457792',
      attachmentValue7: '',

      isSubmit: false,
      postList: [],
      // [{ name: 'lc.png', url: 'static/images/lc.png' }],
      accept: 'image/jpeg'
    }
  },
  watch: {
    attachmentValue1(val) {
      this.showRes = val
    },
    attachmentValue2(val) {
      this.showRes = val
    },
    attachmentValue3(val) {
      this.showRes = val
    },
    attachmentValue4(val) {
      this.showRes = val
    },
    attachmentValue5(val) {
      this.showRes = val
    },
    attachmentValue6(val) {
      this.showRes = val
    }
  },
  methods: {
    change1(val) {
      console.log(val)
    },
    submitIt() {
      this.isSubmit = true
      // console.log(data)
    }
  }
}
</script>

