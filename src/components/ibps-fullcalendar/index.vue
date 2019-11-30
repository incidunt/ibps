
<template>
  <FullCalendar
    :default-view="defaultView"
    locale="zh-cn"
    theme-system="bootstrap"
    :locales="locales"
    :content-height="contentHeight"
    :events="events"
    :header="header"
    :plugins="calendarPlugins"
  />
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import zhCNLocale from '@fullcalendar/core/locales/zh-cn'
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'

export default {
  components: {
    FullCalendar
  },
  props: {
    events: {
      type: Array,
      default() {
        return []
      }
    },
    eventSources: {
      type: Array,
      default() {
        return []
      }
    },
    editable: {
      type: Boolean,
      default: true
    },
    selectable: {
      type: Boolean,
      default: true
    },
    selectHelper: {
      type: Boolean,
      default: true
    },
    header: {
      type: Object,
      default() {
        return {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }
      }
    },
    defaultView: {
      type: String,
      default: 'dayGridMonth'
    },
    contentHeight: {
      type: Number
    },
    sync: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      calendarPlugins: [dayGridPlugin],
      locales: [zhCNLocale]
    }
  }
}
</script>
