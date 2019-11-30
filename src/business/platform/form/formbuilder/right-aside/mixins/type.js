import EditorBase from '../editors/editor-base'
import EditorRules from '../editors/editor-rules'
import EditorRights from '../editors/editor-rights'
import EditorLayout from '../editors/editor-layout'
import EditorOptions from '../editors/editor-options'

import EditorFieldEditor from '../editors/editor-field-editor'
import EditorFieldTable from '../editors/editor-field-table'
import EditorFieldSelector from '../editors/editor-field-selector'
import EditorFieldDictionary from '../editors/editor-field-dictionary'
import EditorFieldAutonumber from '../editors/editor-field-autonumber'
import EditorFieldAttachment from '../editors/editor-field-attachment'
import EditorFieldCustomDialog from '../editors/editor-field-custom-dialog'
import EditorFieldLinkdata from '../editors/editor-field-linkdata'
import EditorFieldAddress from '../editors/editor-field-address'
import EditorFieldImage from '../editors/editor-field-image'
import EditorFieldHyperlink from '../editors/editor-field-hyperlink'
import EditorFieldSwitch from '../editors/editor-field-switch'

import EditorFieldApprovalOpinion from '../editors/editor-field-approval-opinion'

export default {
  components: {
    EditorBase,
    EditorRules,
    EditorRights,
    EditorLayout,
    EditorOptions,

    EditorFieldEditor,
    EditorFieldTable,
    EditorFieldDictionary,
    EditorFieldAutonumber,
    EditorFieldSelector,
    EditorFieldAttachment,
    EditorFieldCustomDialog,
    EditorFieldLinkdata,
    EditorFieldAddress,
    EditorFieldImage,
    EditorFieldHyperlink,
    EditorFieldSwitch,

    EditorFieldApprovalOpinion
  },
  props: {
    fieldItem: {
      type: Object,
      required: true
    },
    boData: {
      type: Array
    },
    fields: {
      type: Array
    }
  },
  computed: {
    fieldOptions() {
      return this.fieldItem.field_options || {}
    },
    fieldType() {
      return this.fieldItem.field_type
    }
  },
  methods: {
    handleSelect(field) {
      this.$emit('select', field)
    }
  }
}
