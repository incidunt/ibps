
<template>
  <span>
    <el-tag
      v-if="items && items.length == 0"
      :key="index"
      :type="'info'"
      :closable="closable"
      disable-transitions
    >无</el-tag>

    <template v-for="(v,index) in items" v-else>
      <el-tag
        v-if="v.type === 'none'"
        :key="index"
        :type="'info'"
        disable-transitions
      >无</el-tag>
      <el-tag
        v-else-if="v.type === 'all'"
        :key="index"
        :closable="closable"
        disable-transitions
        @close="handleRemove(index,v,items)"
      >所有人</el-tag>
      <template v-else>
        <el-tag
          v-for="(id,j) in convertRightsId(v.rightsId)"
          :key="index+id"
          :closable="closable"
          :type="checkTagType(v.type)"
          :title="checkTypeText(v.type)"
          disable-transitions
          effect="plain"
          @close="handleRemove(j,v,items)"
        >{{ convertRightsName(v.rightsName,j) }}</el-tag>
      </template>
    </template>
  </span>
</template>
<script>
import { ownRightsOptions, typeArr } from './constants'
export default {
  props: {
    value: {
      type: Array
    },
    closable: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object
    },
    typeKey: {
      type: String,
      default: 'read'
    },
    name: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      items: [],
      options: ownRightsOptions
    }
  },
  computed: {
    list() {
      return this.item
    },
    typeKeys() {
      return this.typeKey
    },
    boName() {
      return this.name
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        this.items = this.value
      },
      immediate: true
    }
  },
  methods: {
    checkTagType(type) {
      const index = typeArr.findIndex(item => item.type === type)
      return typeArr[index].color
    },
    checkTypeText(type) {
      const arr = Object.keys(this.options)
      const rights = {}
      let targetTitle = ''
      arr.forEach(i => {
        const right = this.options[i]
        rights[this.options[i].type] = right
      })
      for (var l in rights) {
        if (l === type) {
          targetTitle = rights[type].label
        }
      }
      return targetTitle
    },
    onClick() {
      this.dialogRightsVisible = true
    },
    convertRightsId(ids) {
      if (this.$utils.isEmpty(ids)) return []
      return ids.split(',')
    },
    convertRightsName(names, j) {
      if (this.$utils.isEmpty(names)) return ''
      return names.split(',')[j] || ''
    },
    handleRemove(index, item, items) {
      this.$emit('remove', index, item, items, this.list, this.typeKeys, this.boName)
    }
  }
}
</script>
