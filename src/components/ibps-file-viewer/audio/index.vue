<template>
  <aplayer
    :music="music"
  />
</template>
<script>
import Aplayer from 'vue-aplayer'

export default {
  name: 'ibps-file-audio',
  components: {
    Aplayer
  },
  props: {
    url: {
      type: String
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      music: {
        title: this.title,
        author: '',
        src: this.url
      }
    }
  }

}

</script>
