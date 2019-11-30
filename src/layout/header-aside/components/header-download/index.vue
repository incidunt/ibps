<template>
  <div class="ibps-mr-5">
    <el-popover
      placement="bottom-end"
      width="450"
      trigger="click"
      popper-class="header-download-popper"
    >
      <el-button
        slot="reference"
        class="ibps-ml-0 ibps-mr btn-text can-hover"
        type="text"
      >
        <el-badge
          :max="99"
          :value="downloadCount"
        >
          <ibps-icon
            name="download"
            size="16"
          />
        </el-badge>
      </el-button>

      <el-card body-style="padding:0;">
        <el-row slot="header" :gutter="24">
          <el-col :span="10">
            <h2 style="margin: 0;">下载列表({{ downloadCount }}条)</h2>
          </el-col>
          <el-col :span="12" :offset="2">
            <el-input v-model="search.parameters[0].value" placeholder="文件名称">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </el-col>
        </el-row>
        <div style="height:249px;">
          <el-scrollbar
            style="height: 100%;width:100%;"
          >
            <ibps-list-group>
              <el-timeline res>
                <el-timeline-item
                  v-for="download in downloadList"
                  :key="download.dateGroup"
                  :timestamp="download.dateGroup"
                  placement="top"
                >
                  <el-card>
                    <ibps-list-download
                      v-for="(file,index) in download.files"
                      :key="index"
                      :title="file.name"
                      :label="file.desc"
                      :extra="file"
                      :to="genDownloadUrl(file.link)"
                    >
                      <el-avatar
                        slot="icon"
                        :icon="fileType2Icon(file.type)"
                        shape="circle"
                        style="background-color: #87d068"
                      />
                    </ibps-list-download>
                  </el-card>
                </el-timeline-item>
              </el-timeline>

            </ibps-list-group>
          </el-scrollbar>
        </div>
        <div class="message-more">
          <el-link type="primary" @click="clickMore"> 查看更多</el-link>
        </div>
      </el-card>
    </el-popover>
  </div>
</template>

<script>
import { getDownloadList } from '@/api/platform/socket/file'
import IbpsListDownload from '@/business/platform/socket/list-download/list-download'
import FileUtils from '@/utils/file'
import { mapState } from 'vuex'

export default {
  components: { IbpsListDownload },
  data() {
    return {
      search: {
        parameters: [{
          key: 'name',
          value: ''
        }],
        requestPage: {
          limit: 10,
          pageNo: 1
        }
      },
      downloadList: [],
      downloadCount: 0
    }
  },
  computed: {
    ...mapState('ibps', {
      messageNew: state => state.message.hasNew
    })
  },
  watch: {
    messageNew: function(val) {
      val ? this.loadData().then(response => {
        const data = response.data
        this.downloadList = data.dataResult
        this.downloadCount = data.pageResult ? data.pageResult.totalCount : 0
      }) : ''
    }
  },
  created() {
    this.loadData().then(response => {
      const data = response.data
      this.downloadList = data.dataResult
      this.downloadCount = data.pageResult ? data.pageResult.totalCount : 0
    })
  },
  methods: {
    /**
     * 加载数据
     */
    loadData() {
      return getDownloadList(this.search)
    },
    /**
     * 获取更多
     */
    clickMore() {
      // 查询页数++
      this.search.requestPage.pageNo++
      this.loadData().then(response => {
        const data = response.data
        this.downloadList.push(...data.dataResult)
      }).catch(() => {
        this.search.requestPage.pageNo--
      })
    },
    /**
     * 文件后缀转成 faIcon
     * @param fileType
     * @returns {string}
     */
    fileType2Icon(fileType) {
      return FileUtils.getFileType(fileType)
    },
    /**
     * 根据伪链生成下载地址
     * @param link
     * @returns {string}
     */
    genDownloadUrl(link) {
      return FileUtils.genDownloadUrl(link)
    }
  }

}
</script>
<style lang="scss">
  .header-download-popper {
    padding: 0 !important;

    .message-more {
      padding: 15px 0;
      text-align: center;
      border-top: 1px solid #EBEEF5;
    }
  }
  .ibps-list-group > .el-timeline {
    padding-left: 10px;
    padding-top: 20px;
  }
  .el-timeline-item__content {
    width: 90%;
  }
</style>

