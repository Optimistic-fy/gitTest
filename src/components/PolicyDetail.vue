<template>
  <div class="news-detail">
    <div class="all-content"
         v-if="contents != null">
      <div class="head"
           v-if="contents.title">
        <div class="title">
          {{contents.title}}
        </div>
        <div class="come">
          <div class="left">
            <span class="government"
                  v-if="contents.author">{{contents.author}}</span>
            <span class="time">{{time}}</span>
          </div>
          <div class="right">
            <img class="eye"
                 :src="publicPath + 'icon_read.png?time=' + new Date().getTime()" />
            <span class="count">{{contents.view}}</span>
          </div>
        </div>
      </div>
      <div class="policy-contents">
        <div class="article"
             v-html="contents.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../utils/index.js'
import { requireShare } from '../utils/share.js'
import { mapState } from 'vuex'

export default {
  name: 'PolicyDetail',
  data () {
    return {
      contents: [],
      time: '',
      publicPath: ''
    }
  },
  created () {
    requireShare();
    this.publicPath = this.stylePath + this.appid + "/img/";
    let vm = this
    let id = this.$route.query.id
    vm.$get(`${vm.$global.PREFIX}/policy/detail/` + id).then(res => {
      if (res.data.code === 200) {
        vm.contents = res.data.root
        let content = vm.contents.content || ''
        content = utils.filterHtml(content)
        // content = content.replace(/\<\/font>/g,'</div>')
        vm.contents.content = content
        vm.time = vm.contents.createTime.split(' ')[0]
      }
    })
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
}
</script>

<style scoped>
.mint-header {
  height: 80px;
  line-height: 80px;
  background: #fff;
  color: #000;
  font-size: 32px;
}
.news-detail,
.all-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.all-content {
  top: 0;
}
.all-content .head {
  border-top: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
}
.head .title {
  font-size: 40px;
  margin-top: 40px;
  padding: 0 30px;
  letter-spacing: 5px;
}
.head .come {
  font-size: 30px;
  padding: 20px 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left .government {
  color: #576b95;
  letter-spacing: 5px;
  padding-right: 20px;
}
.left .time {
  color: #888888;
}
.right .eye {
  width: 40px;
  height: 25px;
  padding-right: 10px;
}
.right .count {
  color: #888888;
}
.policy-contents {
  padding: 30px 30px;
  word-wrap: break-word;
}
.policy-contents .article {
  font-size: 24px;
  letter-spacing: 5px;
  font-weight: normal;
}
</style>