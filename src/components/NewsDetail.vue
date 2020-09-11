<template>
  <div>
    <div class="news-detail" id="all_ontent">
      <div class="all-content" v-if="contents != null">
        <div class="head" v-if="contents.title">
          <div class="title"> {{contents.title}}</div>
          <div class="come">
            <div class="left">
              <span class="government" v-if="contents.author">{{contents.author}}</span>
              <span class="time">{{time}}</span>
            </div>
            <div class="right">
              <img class="eye" :src="publicPath + 'icon_read.png' + '?time=' + new Date().getTime()" mode="" />
              <span class="count">{{contents.view}}</span>
            </div>
          </div>
        </div>
        <div class="news-content">
          <div class="article" v-html="contents.content"></div>
        </div>
      </div>
    </div>
    <transition name="guide">
      <div class="guide_btn default_back_color" v-if="isShare" @click="goToPage">
        <div class="icon_div"><img class="img" :src="publicPath + 'icon_news.png' + '?time=' + new Date().getTime()" /></div>
        <div class="guide_text" v-if="ismore">更多资讯</div>
      </div>
    </transition>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import utils from '../utils/index.js'
import { requireShare } from '../utils/share.js'

export default {
  name: 'GuideDetail',
  data() {
    return {
      contents: {},
      time: '',
      publicPath: '',
      ismore: true,
      isShare: false,
      signs: '',
      shareParam: {},
      scrollInterval: 0
    }
  },
  created() {
    let vm = this;
    vm.publicPath = this.stylePath + this.appid + "/img/";

    let id = this.$route.query.id;
    vm.$get(`${vm.$global.PREFIX}/news/detail/` + id).then(res => {
      console.log('详情res', res)
      if (res.data.code === 200) {
        vm.contents = res.data.root;
        let content = vm.contents.content || '';
        content = utils.filterHtml(content);
        vm.contents.content = content;
        vm.time = vm.contents.createTime.split(' ')[0];
        // console.log("contents", vm.contents)
        //初始化分享 
        vm.initShare().then((res) => {
          requireShare(vm.shareParam);
        })
      }
    })
  },
  mounted() {
    let vm = this;
    let pageUrl = window.location.href;
    if (pageUrl.indexOf("isshare") != -1) {
      vm.signs = true;
      vm.isShare = true;
    }
    window.addEventListener("scroll", vm.showIcon, true);

  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  methods: {
    initShare() {
      let vm = this;
      return new Promise((resolve, reject) => {
        let typeName = vm.$route.name;
        let shareDesc = vm.contents.summary;
        let shareTitle = vm.contents.title;
        let currentUrl = window.location.href;
        let shareImg = vm.contents.headImg + '?' + new Date().getTime();
        if (currentUrl.indexOf("isshare") == -1) {
          currentUrl = currentUrl + "&isshare=true";
        }
        if (vm.contents.headImg == null || vm.contents.headImg == '' || vm.contents.headImg == undefined) {
          shareImg = vm.stylePath + vm.appid + "/img/new_detail_share.jpg" + "?" + new Date().getTime();
        }
        vm.shareParam = {
          type: typeName,
          imgUrl: shareImg,
          desc: shareDesc,
          title: shareTitle,
          link: currentUrl
        }
        resolve()
      })
    },
    goToPage() {
      this.$router.push({ path: `/${this.appid}/news` })
    },
    showIcon() {
      let vm = this;
      if (vm.signs) {
        let top = document.getElementById('all_ontent').scrollTop;
        let scroll = top - vm.scrollInterval;
        vm.scrollInterval = top;
        if (scroll < 0) {
          vm.ismore = true;
        } else {
          vm.ismore = false;
        }
      }
    },
  }

}
</script>

<style scoped>
.news-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.all-content .head {
  border-bottom: 1px solid #dcdcdc;
  padding: 0 30px;
}
.head .title {
  font-size: 40px;
  margin-top: 40px;
  /* padding: 0 30px; */
  letter-spacing: 5px;
}
.head .come {
  font-size: 25px;
  padding: 20px 0;
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
.news-content {
  padding: 30px 30px;
  word-wrap: break-word;
}
.icon_div {
  display: flex;
  align-items: center;
}
.icon_div img {
  vertical-align: baseline;
  width: 40px;
  height: 40px;
}
.guide_text {
  margin-left: 10px;
}

.article {
  font-size: medium;
}
</style>