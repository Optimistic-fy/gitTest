<template>
  <div>
    <div class="guide-detail">
      <div class="guide-content"
           v-if="contents">
        <div class="head">
          <div class="title"
               v-if="contents.title">
            {{contents.title}}
          </div>
          <div class="come">
            <div class="left">
              <span class="time"
                    v-if="contents.publishTime">{{contents.publishTime}}</span>
            </div>
            <div class="right">
              <span class="birth">来源：</span><span v-if="contents.source">{{contents.source}}</span>
            </div>
          </div>
        </div>
        <div class="guide-contents">
          <div class="article"
               v-html="contents.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requireShare } from '../utils/share.js'

export default {
  name: 'GuideDetail',
  data () {
    return {
      contents: []
    }
  },
  mounted () {
    requireShare();
    let vm = this
    let id = this.$route.query.id
    vm.$get(`${vm.$global.PREFIX}/guide/detail/` + id).then(res => {
      if (res.data.code === 200) {
        vm.contents = res.data.root
        let content = vm.contents.content || ''
        content = content.replace(/\<img/g, '<img style="width:100%;height:auto;display:block;margin:10px 0;"')
        vm.contents.content = content
      }
    })
  },
  computed: {
  }
}
</script>

<style scoped>
.guide-detail,
.guide-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
}
.guide-content {
  top: 0;
}
.guide-content .head {
  border-bottom: 1px solid #dcdcdc;
}
.head .title {
  font-size: 40px;
  margin-top: 40px;
  padding: 0 30px;
  letter-spacing: 5px;
}
.head .come {
  font-size: 26px;
  padding: 20px 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.left,
.right {
  color: #888888;
}
.right {
  padding-right: 30px;
}
.guide-contents {
  padding: 30px 30px;
}
.guide-contents .article {
  width: 100%;
  text-indent: 60px;
  font-size: 30px;
  letter-spacing: 5px;
  line-height: 40px;
}
</style>