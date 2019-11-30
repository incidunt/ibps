<template>
  <div class="menu-tool">
    <div v-for="(group,index) in menuTools" :key="index" class="menu-group">
      <div v-for="(item,i) in group" :key="i" class="menu-item" :class="{'menu-select': item.type === 'select'}">
        <el-tooltip effect="dark" :content="item.descr" placement="bottom">
          <div v-if="item.type === 'icon'" class="menu-icon">
            <span
              :style="{
                'background-position':item.position
              }"
            />
          </div>
          <el-dropdown
            v-else-if="item.type === 'select'"
            trigger="click"
            @command="(command)=>{handleCommand(item,command)}"
          >
            <div class="el-dropdown-link">
              <template v-if="!item.icon">
                {{ item.selected }}
                <i class="el-icon-arrow-down el-icon--right" />
              </template>
              <div v-else class="menu-select menu-select-icon">
                <div class="menu-icon ">
                  <span
                    :style="{
                      'background-position':item.position
                    }"
                  />
                </div>
                <i class="el-icon-arrow-down el-icon--right" />
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(command,ci) in item.options" :key="ci" :command="command">
                <template v-if="item.optionType === 'object'">
                  <div v-if="item.bgIcon" class="menu-icon">
                    <span
                      :style="{
                        'background-position':command.position
                      }"
                    />
                  </div>
                  <div v-else :class="[command.className]">{{ command.text }}</div>
                </template>
                <template v-else>{{ command }}</template>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuTools: [
        [
          {
            type: 'icon',
            position: '41.65% 0',
            descr: '撤销'
          },
          {
            type: 'icon',
            position: '0 100%',
            descr: '重做'
          }
        ],
        [
          {
            type: 'select',
            selected: '宋体',
            descr: '字体',
            options: ['宋体', '楷体', '黑体']
          },
          {
            type: 'select',
            selected: '9',
            descr: '字号',
            options: ['9', '10', '11', '12', '14', '18', '24', '30', '36']
          },
          {
            type: 'icon',
            position: '58.31% 0',
            descr: '粗体'
          },
          {
            type: 'icon',
            position: '16.66% 50%',
            descr: '斜体'
          },
          {
            type: 'icon',
            position: '33.32% 50%',
            descr: '下划线'
          }
        ],
        [
          {
            type: 'icon',
            position: '91.63% 50%',
            descr: '顶部对齐'
          },
          {
            type: 'icon',
            position: '74.97% 50%',
            descr: '居中对齐'
          },
          {
            type: 'icon',
            position: '41.65% 50%',
            descr: '底部对齐'
          },
          {
            type: 'icon',
            position: '83.3% 0',
            descr: '左对齐'
          },
          {
            type: 'icon',
            position: '66.64% 0',
            descr: '居中对齐'
          },
          {
            type: 'icon',
            position: '74.97% 0',
            descr: '右对齐'
          }
        ],
        [
          {
            type: 'select',
            icon: true,
            bgIcon: true,
            position: '8.33% 100%',
            descr: '边框线',
            optionType: 'object',
            key: 'position',
            options: [
              {
                position: '24.99% 50%'
              },
              {
                position: '83.3% 50%'
              },
              {
                position: '8.33% 100%'
              },
              {
                position: '8.33% 50%'
              },
              {
                position: '49.98% 50%'
              },
              {
                position: '66.64% 50%'
              },
              {
                position: '58.31% 50%'
              }
            ]
          },
          {
            type: 'select',
            icon: true,
            descr: '边框线粗细',
            optionType: 'object',
            position: '0 0',
            options: [
              {
                className: '',
                text: '无边框'
              },
              {
                className: 'menu-item-line menu-item-line-1'
              },
              {
                className: 'menu-item-line  menu-item-line-2'
              },
              {
                className: 'menu-item-line  menu-item-line-3'
              },
              {
                className: 'menu-item-line  menu-item-line-4'
              }
            ]
          }
        ],
        [
          {
            type: 'select',
            icon: true,
            bgIcon: true,
            position: '33.32% 0',
            descr: '插入/擅长',
            optionType: 'object',
            options: []
          }
        ],
        [
          {
            type: 'icon',
            position: '49.98% 0',
            descr: '合并'
          }
        ],
        [
          {
            type: 'icon',
            position: '24.99% 0',
            descr: '插入图片'
          },
          {
            type: 'select',
            icon: true,
            position: '24.99% 0',
            descr: '设置背景图',
            options: []
          }
        ],
        [
          {
            type: 'select',
            icon: true,
            position: '0 50%',
            descr: '纸张设置',
            options: []
          }
        ],
        [
          {
            type: 'select',
            icon: true,
            position: '24.99% 100%',
            descr: '纸张设置',
            options: []
          },
          {
            type: 'icon',
            position: '16.66% 100%',
            descr: '页眉页脚'
          }
        ]
      ]
    }
  },
  methods: {
    handleCommand(item, command) {
      if (item.optionType === 'object' && item.key) {
        item[item.key] = command[item.key]
        return
      }
      item.selected = command
    }
  }
}
</script>
<style lang="scss" >
  .menu-tool {
    background: #fafafa;
    display: flex;

    .menu-group {
      display: flex;
    }
    .menu-item {
      border: 1px solid transparent;
      transition: border .3s;
      cursor: pointer;
      display: flex;
      align-items: center;

      .ban {
        cursor: not-allowed;
      }

      &.selected {
        border-color: #e0e0e0;
      }
    }
  }
  .menu-icon {
    width: 30px;
    height: 25px;
    position: relative;

    span {
      position: absolute;
      overflow: hidden;
      background: url("./../../../../assets/images/form/print_menu_tool_icon.png") no-repeat;
      /*background-position: 41.65% 0;*/
      background-size: 243px 54px;
      width: 18px;
      height: 18px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      /*opacity: .4;*/
    }
  }
  .menu-select-icon{
    display: flex;
    align-items: center;
    .menu-icon{
      width: 20px;
    }
    i{
      margin-left: 0;
    }
  }
  .menu-select{
    min-width: 40px;
  }
  .menu-item-line{
    padding: 7px;
    margin: 7px auto;
    border-bottom: solid #000;
    &.menu-item-line-1{
      border-width: 1px;
    }
    &.menu-item-line-2{
      border-width: 2px;
    }
    &.menu-item-line-3{
      border-width: 3px;
    }
    &.menu-item-line-4{
      border-width: 4px;
    }
  }
</style>
