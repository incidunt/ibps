
import { mapState } from 'vuex'
import _defaultsDeep from 'lodash.defaultsdeep'

export default {
  props: {
    value: Object
  },
  data() {
    return {
      formData: { }
    }
  },
  computed: {
    ...mapState({
      nodeList: state => state.ibps.bpmn.userNodeList
    }),
    userTypeMap() {
      const map = {}
      this.userTypeOptions.forEach(item => {
        map[item.value] = item
      })
      return map
    },
    executorVar() {
      return this.formData && this.formData.executorVar ? this.formData.executorVar.name : ''
    }
  },
  watch: {
    value: {
      handler: function(val, oldVal) {
        this.formData = _defaultsDeep({}, val, this.defaultData)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleNode(val) {
      const node = this.nodeList.find((node) => {
        return node.value === val
      })
      this.formData.nodeName = node.label
    }
  }
}
