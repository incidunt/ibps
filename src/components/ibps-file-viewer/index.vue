<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="title"
    fullscreen
    append-to-body
    custom-class="ibps-file-preview-dialog"
    @close="closeDialog"
  >
    <pdf-viewer
      v-if="fileType==='pdf'"
      ref="viewer"
    />
    <div
      v-else-if="fileType==='image'"
      class="lc-fixed-navbar"
    >
      <image-viewer :src="url" />
    </div>
    <audio-viewer
      v-else-if="fileType==='audio'"
      ref="viewer"
      :title="title"
      :url="url"
    />

    <video-viewer
      v-else-if="fileType==='video'"
      ref="viewer"
      :ext="fileExt"
      :url="url"
    />

    <div v-else class="lc-fixed-navbar">不支持预览的类型</div>
  </el-dialog>
</template>
<script>

/**
 * 文件预览
 * 1、'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'  类型支持
 * 2、图片支持缩放
 * 3、音频，语音支持
 * ==================
 * 下一版本支持
 * 1、pdf支持缩放
 * 2、音频，语音多格式支持
 *
 */
import PdfViewer from './pdf'
import ImageViewer from './image'
import AudioViewer from './audio'
import VideoViewer from './video'

const OFFICE_TYPE = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']
const PDF_TYPE = ['pdf']
const IMAGE_TYPE = ['jpg', 'jpeg', 'bmp', 'png']
const AUDIO_TYPE = ['mp3']
const VIDEO_TYPE = ['mp4']
export default {
  components: {
    PdfViewer,
    ImageViewer,
    AudioViewer,
    VideoViewer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String

    },
    fileExt: {
      type: String
    },
    url: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      fileType: ''
    }
  },
  watch: {
    visible: {
      handler: function(val, oldVal) {
        this.dialogVisible = this.visible
        if (this.dialogVisible) {
          this.loadViewer()
        }
      },
      immediate: true
    }
  },
  methods: {
    loadViewer() {
      if (IMAGE_TYPE.includes(this.fileExt)) {
        this.fileType = 'image'
      } else if (PDF_TYPE.includes(this.fileExt) || OFFICE_TYPE.includes(this.fileExt)) {
        this.fileType = 'pdf'
        this.$nextTick(() => {
          this.$refs.viewer.load(this.url)
        })
      } else if (AUDIO_TYPE.includes(this.fileExt)) {
        this.fileType = 'audio'
      } else if (VIDEO_TYPE.includes(this.fileExt)) {
        this.fileType = 'video'
      }
    },
    closeDialog() {
      this.fileType = ''
      this.$emit('close', false)
    }
  }
}
</script>
