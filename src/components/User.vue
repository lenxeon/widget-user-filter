<template>
  <li :class="itemClass" v-if="(user)" @click="itemClickHandler">
      <i :class="icoClass"></i>
      <i class="fa mr-5 {{user.ico}}"></i>
      <span>{{user.userName}}</span>
  </li>
</template>
<script>
export default {
  name: 'item',

  props: {
    user: Object
  },

  watch: {
  },

  methods: {
    itemClickHandler: function (event) {
      this.$dispatch('item-checked', this.user)
    }
  },

  computed: {
    itemClass () {
      return {
        'item': true,
        'hover': this.user.hover
      }
    },
    icoClass () {
      return {
        'fa': true,
        'mr-5': true,
        'fa-square-o': !this.user.checked,
        'fa-square': this.user.checked
      }
    }
  },

  ready () {
    // console.log(this.user)
  },
  created () {
    // console.log(this.$data)
  }
}
</script>
<style scoped>
</style>
