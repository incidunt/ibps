<template>
  <div>
    <bpmn-form-var
      :data="formVars"
      :props="{label: 'name'}"
      :disabled="disabled"
      @callback="hamdleFormVar"
    />
    {{ value }}
  </div>

</template>
<script>
import { mapState } from 'vuex'
import { getFormVars } from '../utils'
import BpmnFormVar from './form-var'

export default {
  name: 'form-var-select',
  components: {
    BpmnFormVar
  },
  props: {
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      boDefData: state => state.ibps.bpmn.boDefData,
      variables: state => state.ibps.bpmn.variables,
      curNode: state => state.ibps.bpmn.curNode
    }),
    nodeId() {
      if (this.curNode.nodeType === 'signTask' || this.curNode.nodeType === 'userTask') {
        return this.curNode.nodeId
      }
      return null
    },
    formVars() {
      return getFormVars(this.boDefData, this.variables, this.nodeId)
    }
  },
  methods: {
    hamdleFormVar(node) {
      let name = ''
      let source = ''
      if (node.attrType === 'field') {
        name = node.tableName + '.' + node.key + ''
        source = 'boVar'
      } else if (node.attrType === 'var') {
        name = node.key
        source = 'flowVar'
      } else if (node.attrType === 'bpmConstants') {
        name = node.key
        source = 'consVar'
      } else {
        return
      }
      this.$emit('input', {
        source,
        name
      })
    }
  }

}
</script>
