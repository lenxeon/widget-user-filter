<template>
  <div class="dropdown lft jq-select">
    <button class="btn  btn-sm btn-default dropdown-toggle mr-5"
        @click="dropdownOpenHandler"
        type="button" data-toggle="dropdown"
        placeholder="提交人">提交人:{{showText}}
        <span class="caret"></span>
    </button>
    <ul class="dropdown-menu check-list-field-container" @click="dropdownClickHandler">
        <div class="input-group  ml-15 mr-15">
            <input type="text"
                placeholder="搜索"
                v-model="keyword"
                @click="focusHandler"
                @blur="blurHandler"
                @keyup.up="upSelectHandler"
                @keyup.down="downSelectHandler"
                @keyup.enter="enterSelectHandler"
                @keyup="searchTagHandler | debounce 300"
                class="input-sm form-control radius search"/>
            <span :class="searchIcoClass" @click="cleanKeywordHandler">
              <span>More</span>
            </span>
        </div>
        <div class="result-view" v-show="!searching">
            <li role="separator" class="divider"></li>
            <li @click="clearSelectHandler" v-if="selected.length>0" class="item">
                <span class="empty">清除所有</span>
            </li>
            <item v-for="user in selected" :user="user"></item>
            <li v-show="selected.length>0" role="separator" class="divider"></li>

            <item v-for="user in defUser" :user="user"></item>
            <!-- <li v-show="defUser.length>0" role="separator" class="divider"></li> -->

            <li v-show="recommandUser.length>0"
              class="dropdown-header">推荐用户:</li>
            <item v-for="user in recommandUser" :user="user"></item>

            <li v-show="recommandGroup.length>0"
              class="dropdown-header">推荐用户组:</li>
            <item v-for="user in recommandGroup" :user="user"></item>
        </div>
        <div class="result-view" v-show="searching">
            <li role="separator" class="divider"></li>
            <item v-if="matched.length>0"
              v-for="user in matched"
              :user="user"></item>
            <li v-if="matched.length==0" class="item">
                <span class="empty">没有匹配的</span>
            </li>
        </div>
      </ul>
  </div>
</template>

<script>
const _ = require('underscore')
const api = require('../assets/data')
import item from './User.vue'
const ENTER_KEY = 13
const LEFT_KEY = 37
const UP_KEY = 38
const DOWN_KEY = 40
const RIGHT_KEY = 39
export default {
  components: {
    item
  },
  props: {
    selectedIds: {
      default: function () {
        return []
      }
    },
    lable: {
      default: function () {
        return '请选择'
      }
    }
    // onChange: {
    //   type: Function,
    //   default (option) {
    //     console.log('哈哈')
    //     if (typeof option === 'object') {
    //       if (this.label && option[this.label]) {
    //         return option[this.label]
    //       }
    //     }
    //     return option
    //   }
    // }
  },

  data () {
    return {
      // 查询的关键词
      keyword: '',
      // 查询得到的结果
      matched: [],
      // 当前选择的第几个
      selectIndex: 0,
      // 两个特殊的值，当前用户和空用户（未分配）
      defUser: [],
      // 本次弹出后选择的，临时变量
      currentSelected: [],
      // 所有已选择的，展现用
      selected: [],
      // 所有已选择的Id,后台请求用
      // selectedIds: [],
      // 推荐的用户列表
      recommandUser: [],
      // 推荐的组列表
      recommandGroup: []
    }
  },

  events: {
    'item-checked' (user) {
      // 所有的是否选中断言，放到selectedIds中来确认
      var checked = _.indexOf(this.selectedIds, user.userName) >= 0
      if (!checked) {
        console.log('add:' + user.userName)
        this.selectedIds = _.union(this.selectedIds, [user.userName])
        this.currentSelected = _.union(this.currentSelected, [user])
        user.checked = true
      } else {
        console.log('remove:' + user.userName)
        this.selectedIds = _.without(this.selectedIds, user.userName)
        this.currentSelected = _.without(this.currentSelected, user)
        user.checked = false
      }
      var ids = this.selectedIds.join(',')
      this.$dispatch('on-change', ids)

      // this.selectedLog()
    }
  },

  widtch: {
    'keyword': function (val, old) {
      console.log(val)
      // if (this.multiple) {
      // 	this.onChange ? this.onChange(val) : null
      // } else {
      // 	this.onChange && val !== old ? this.onChange(val) : null
      // }
    }
  },

  methods: {
    selectedLog () {
      console.log(this.selectedIds.join(','))
    },

    // 设置待选择项hover选中高亮样式
    tachSelectedHandler () {
      this.selectIndex = Math.max(this.selectIndex, 0)
      this.selectIndex = Math.min(this.selectIndex, this.matched.length - 1)
      for (var i = 0; i < this.matched.length; i++) {
        this.matched[i].hover = (i === this.selectIndex)
      }
    },

    upSelectHandler (e) {
      e.preventDefault()
      console.log('upSelectHandler')
      this.selectIndex = Math.max(this.selectIndex - 1, 0)
      this.tachSelectedHandler()
      return false
    },

    downSelectHandler (e) {
      console.log('downSelectHandler')
      var length = this.matched.length
      this.selectIndex = Math.min(this.selectIndex + 1, length - 1)
      this.selectIndex = Math.max(this.selectIndex, 0)
      this.tachSelectedHandler()
      e.preventDefault()
      return false
    },

    clearSelectHandler (e) {
      this.selectedIds = []
      _.each(this.selected, function (user) {
        user.checked = false
      })
      // this.selected = []
    },

    enterSelectHandler (e) {
      console.log('enterSelectHandler')
      var user = this.matched[this.selectIndex]
      console.log(user.userName)
      user.checked = !user.checked
      // e.preventDefault()
      // return false
    },

    dropdownOpenHandler () {
      this.initdata()
      this.selectedFilter()
      // 每次展开都需要做的事，初始搜索, 上次的选择合并
      // 1. 初始搜索
      this.keyword = ''
      this.matched = []
      // 2. 上次的选择合并
      var curr = this.currentSelected.length
      var last = this.selected.length
      this.selected = _.union(this.currentSelected, this.selected)
      this.currentSelected = []
      var now = this.selected.length
      console.log('合并：' + last + '\t' + curr + '\t' + now)
      // 3. 对已选中的数据进行隐藏
      var temp = []
      for (var i = 0; i < this.recommandUser.length; i++) {
        var u = this.recommandUser[i]
        // 如果能在已选的范围中找到
        if ((_.indexOf(this.selectedIds, u.userName)) !== -1) {
          temp.push(u)
          this.recommandUser[i].hidden = true
        }
      }
      for (i = 0; i < this.recommandGroup.length; i++) {
        u = this.recommandGroup[i]
        // 如果能在已选的范围中找到
        if ((_.indexOf(this.selectedIds, u.userName)) !== -1) {
          temp.push(u)
          this.recommandGroup[i].hidden = true
        }
      }
      // console.log(temp.length)
      // this.recommandUser = _.without(this.recommandUser, temp)
      // console.log(this.recommandUser)
      // this.recommandGroup = _.without(this.recommandGroup, temp)
    },

    dropdownClickHandler (event) {
      event.stopPropagation()
      return false
    },

    cleanKeywordHandler (event) {
      this.keyword = ''
      this.matched = []
    },

    focusHandler (event) {
    },

    searchTagHandler (e) {
      // 每次触发都要联网，获取数据后需要检查是否已经被选择，需要设置第0个光标选中
      var keyCode = e.keyCode
      if (keyCode === UP_KEY || keyCode === LEFT_KEY || keyCode === RIGHT_KEY ||
        keyCode === DOWN_KEY || keyCode === ENTER_KEY) {
        return false
      }
      this.model = 'search'
      var data = api(this.keyword)
      // for (var i = 0; i < data.matched.length; i++) {
        // data.matched[i].$set('hover', false)
        // data.matched[i].$set('checked', false)
      // }
      // console.log(data.matched)
      data.matched = this.adornAndFilter(data.matched, false)
      this.$set('matched', data.matched)
      // 设置第0个光标选中
      this.selectIndex = 0
      this.tachSelectedHandler()
      // this.$set('recommandUser', data.recommandUser)
      // this.$set('recommandGroup', data.recommandGroup)
    },

    // 对selected中的数据根据selectedIds进行整理
    selectedFilter () {
      var me = this
      console.log('重新计算选中用户列表-1：' + this.selected.length)
      this.selected = _.filter(this.selected,
        function (user) {
          var flag = _.indexOf(me.selectedIds, user.userName) !== -1
          console.log(user.userName + '\t' + flag)
          return flag
        }
      )
      console.log('重新计算选中用户列表-2：' + this.selected.length)
    },

    // 先对所有的对象进行修饰，增加一些必要的属性
    adornAndFilter (obj, filter) {
      var temp = []
      for (var i = 0; i < obj.length; i++) {
        var u = obj[i]
        var checked = _.indexOf(this.selectedIds, u.userName) >= 0
        u.hover = false
        u.checked = checked
        if (filter && checked) {
          console.log('no' + checked)
        } else {
          temp.push(u)
        }
      }
      return temp
    },

    blurHandler (event) {
      // console.log(this.keyword)
    },

    initdata () {
      var data = api()
      // 修饰数据，并且决定是否做一些过滤操作
      data.defUser = this.adornAndFilter(data.defUser, true)
      data.recommandUser = this.adornAndFilter(data.recommandUser, true)
      data.recommandGroup = this.adornAndFilter(data.recommandGroup, true)
      this.$set('defUser', data.defUser)
      this.$set('recommandUser', data.recommandUser)
      this.$set('recommandGroup', data.recommandGroup)
    }
  },

  computed: {
    searching () {
      return this.keyword.trim().length > 0
    },

    // showRecommandUserSplit () {
    //   var users = _.find(this.recommandUser, function (user) {
    //     return !user.checked
    //   })
    //   console.log('推荐人数：' + users)
    //   return users || this.currentSelected.length >= 0
    // },
    //
    // showRecommandGroupSplit () {
    //   var groups = _.find(this.recommandGroup, function (user) {
    //     return !user.checked
    //   })
    //   console.log('推荐组数：' + groups)
    //   return groups || this.currentSelected.length >= 0
    // },

    searchIcoClass () {
      // console.log((this.keyword || '').trim().length)
      var flag = (this.keyword || '').trim().length === 0
      return {
        'icon': true,
        'noloading': flag,
        'clear-field': !flag
      }
    },

    showText () {
      var text = null
      var num = this.selectedIds.length
      var all = _.union(this.selected, this.currentSelected)
      all = _.filter(all, (user) => {
        return _.indexOf(this.selectedIds, user.userName) >= 0
      })
      for (var i = 0; i < all.length; i++) {
        if (text == null) {
          text = all[i].userName
        }
      }
      switch (num) {
        case 0: {
          text = '请选择'
          break
        }
        case 1: {
          break
        }
        default: {
          text = text + '等'
        }
      }
      return text
    }
  },

  ready () {

  },

  created () {
    console.log(this.selectedIds)
    this.initdata()
  }
}
</script>

<style lang="less">
body {
  .empty{
    text-align: center;
  }

  ul {
      margin-bottom: 0px;

      li {
          dl {
              line-height: 24px;
              height: 24px;
              padding: 0px;
              margin: 0px;

              &>dt {
                  color: #707070;
                  display: table-cell;
                  font-weight: normal;
                  text-align: left;
                  vertical-align: top;
                  width: 100px;
                  padding: 2px 0 2px 5px;
                  margin: 0px;
              }
              &>dd {
                  display: table-cell;
                  -moz-box-sizing: border-box;
                  -webkit-box-sizing: border-box;
                  box-sizing: border-box;
                  padding: 2px 0 2px 5px;
                  margin: 0px;
              }
          }
      }
  }
  .check-list-field-container {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;

    .result-view{
        max-height: 300px;
        overflow: auto;
    }

    li {
        display: block;
        padding: 3px 20px;
        clear: both;
        font-weight: 400;
        line-height: 1.42857143;
        color: #333;
        white-space: nowrap;
        cursor: pointer;
        &.divider{
            padding: 0px;
        }
        -webkit-user-select:none;
        &.item {
            .fa{
              width: 10px;
            }
            &:hover, &.hover, &.selected {
                background: #f5f5f5;
            }
            &.divider {
                padding: 0px;
            }
        }
    }
    .search {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -ms-box-sizing: border-box;
        box-sizing: border-box;
        -moz-border-radius: 3px 3px 3px 3px;
        border-radius: 3px 3px 3px 3px;
        position: relative;
        z-index: 1;
        width: 100%;
        min-height: 28px;
        height: 0;
        border: 1px solid #ccc;
        padding: 0 24px 0 6px;
        -webkit-box-shadow: #bbb 0 7px 2px -7px inset;
        -moz-box-shadow: #bbb 0 7px 2px -7px inset;
        box-shadow: #bbb 0 7px 2px -7px inset;
        margin: 0;
        font-size: 14px;
        font-family: inherit;
    }
    .icon {
        display: inline-block;
        height: 16px;
        margin: 0;
        overflow: hidden;
        padding: 0;
        text-align: left;
        text-indent: -999em;
        vertical-align: text-top;
        width: 16px;
    }
    .icon {
        position: absolute;
        top: 7px;
        right: 5px;
        z-index: 2;
        background: url('../assets/search.png');
    }
    .icon.clear-field {
        background: url('../assets/clear.png');
        cursor: pointer;
        opacity: 0.7;
    }
  }
}
</style>
