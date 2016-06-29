<template>
<user-selector
  :selected-ids="selectedIds"
  lable="请选择吧"
  v-on:on-change="onChange"></user-selector>
</template>

<script>
const _ = require('underscore')
const api = require('./assets/data')
import userSelector from './components/Select.vue'
export default {
  components: {
    userSelector
  },

  data () {
    return {
      selectedIds: []
    }
  },

  events: {
  },

  methods: {
    onChange (o) {
      console.log('父中消息:' + o)
    }
  },

  computed: {
  },

  ready () {

  },

  created () {
    var data = api('java')
    var temp = []
    _.each(data.matched, function (user) {
      temp.push(user.userName)
    })
    console.log('准备数据:' + temp.join(','))
    this.$set('selectedIds', temp)
  }
}
</script>

<style lang="less">

</style>
