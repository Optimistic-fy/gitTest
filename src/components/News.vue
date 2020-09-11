<template>
  <div>
    <div class="news_top">
      <van-tabs class="tabs"
                v-model="checkItem"
                swipeable
                @click="handleClickCate">
        <van-tab v-for="item in categoryItemList"
                 :key="item.snowflakeId"
                 :name="item.tagName"
                 :title="item.tagName">
        </van-tab>
      </van-tabs>
      <div class="more_category">
        <van-icon name="bars"
                  @click="showMoreCategory" />
      </div>
    </div>
    <div class="information"
         ref="newlist">
      <template v-if="news.length > 0">
        <div class="list">
          <div class="down">{{text}}</div>
          <div class="list-item"
               v-for="(item,imdex) in news"
               :key="imdex"
               @click="clickInformation(item.snowflakeId)">
            <div class="left">
              <div class="item-title">
                {{item.title}}
              </div>
              <div class="time-read">
                <span class="date-line">
                  <img class="clock"
                       :src="publicPath + 'icon_time.png' + '?time=' + new Date().getTime()" />
                  <span>{{item.createTime.split(' ')[0]}}</span>
                </span>
                <span class="read-line">
                  <img class="eye"
                       :src="publicPath + 'icon_read.png' + '?time=' + new Date().getTime()" />
                  <span>{{item.view}}</span>
                </span>
              </div>
            </div>
            <div class="right"
                 v-if="item.headImg">
              <img :src="item.headImg"
                   mode="" />
            </div>
          </div>
          <div class="no-more">{{buttonText}}</div>
        </div>
      </template>
      <template v-else>
        <div class="no-result">
          {{loadingText}}
        </div>
      </template>
    </div>
    <popup v-model="showCategory"
           position="bottom"
           duration="5s"
           :style="{ height: '100%' }">
      <div class="category_content">
        <div class="category_top">
          <div class="news_name default_info_border_color">新闻资讯</div>
          <van-icon name="cross"
                    @click="closeList" />
        </div>
        <ul class="category_list">
          <template v-for="item in categoryItemList">
            <li @click="checkCategory(item.tagName)"
                :key="item.snowflakeId"
                :class="item.tagName === checkItem ? 'default_color' : ''">{{item.tagName}}</li>
          </template>
        </ul>
      </div>
    </popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { requireShare } from '../utils/share.js'
import BScroll from 'better-scroll'
import { Popup } from 'vant'

export default {
  name: 'News',
  data () {
    return {
      news: [],
      searchParam: {
        pageNumber: 1, // 几页
        pageSize: 10, // 一页的数量
        tagSnowflakeId: ''
      },
      noMore: false, // 是否还有更多
      newsScroll: null,
      text: '',
      buttonText: '上拉加载更多...',
      loadingText: '加载中...',
      publicPath: '',
      shareParam: {},
      scrollCategory: null,
      showCategory: false,
      checkItem: '',
      categoryItemList: []
    }
  },
  components: {
    Popup
  },
  created () {
    let vm = this;
    vm.publicPath = vm.stylePath + vm.appid + "/img/";
    vm.getCategoryList()
  },
  mounted () {
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  methods: {
    getCategoryList () {
      this.$get(`${this.$global.PREFIX}/tag/list`).then(res => {
        if (res.data.code === 200) {
          let root = res.data.root;
          if (root.length > 0) {
            this.categoryItemList = root;
            this.checkItem = root[0].tagName;
            this.searchParam.tagSnowflakeId = this.getSnofId();
            this.getData();
          } else {
            this.news = []
            this.noMore = true;
            this.loadingText = '暂无资讯！';
          }
        }
      })
    },
    initShare () {
      let vm = this;
      return new Promise((resolve, reject) => {
        let typeName = vm.$route.name;
        let currentUrl = window.location.href;
        if (currentUrl.indexOf("isshare") == -1) {
          currentUrl = currentUrl + "?isshare=true";
        }
        vm.shareParam = {
          type: typeName,
          imgUrl: vm.stylePath + vm.appid + "/img/new_list_share.jpg" + "?" + new Date().getTime(),
          desc: "",
          title: "",
          link: currentUrl
        }
        resolve()
      })
    },

    onDownRefresh () {
      this.searchParam.pageNumber = 1;
      this.noMore = false;
      this.getData();
      this.newsScroll.finishPullDown();
    },
    onLoad () {
      if (!this.noMore) {
        this.searchParam.pageNumber = this.searchParam.pageNumber + 1;
        this.getData();
      }
      this.newsScroll.finishPullUp();
    },
    clickInformation (id) {
      this.$router.push({ path: `/${this.appid}/newsDetail`, query: { id } })
    },
    // 获取新闻列表
    getData () {
      let vm = this;
      this.$post(`${this.$global.PREFIX}/news/page?` + Math.random() / 9999, vm.searchParam).then(res => {
        if (res.data.code === 200) {
          if (res.data.root.content.length === 0 && res.data.root.number === 1) {
            vm.news = []
            vm.noMore = true;
            vm.loadingText = '暂无资讯！';
          } else {
            if (res.data.root.content && res.data.root.content.length < 10) {
              vm.noMore = true;
              vm.buttonText = '我是有底线的！';
            } else {
              vm.noMore = false;
              vm.buttonText = '上拉加载更多...';
            }
            if (vm.searchParam.pageNumber == 1) {
              vm.news = res.data.root.content;
            } else {
              vm.news = vm.news.concat(res.data.root.content);
            }
          }
        }
      }).catch(err => {
        vm.noMore = true;
        vm.buttonText = '我是有底线的！';
      })
    },
    showMoreCategory () {
      this.showCategory = true;
    },
    closeList () {
      this.showCategory = false;
    },
    //弹框种类切换
    checkCategory (item) {
      this.getCateInfo(item)
      this.showCategory = false;
    },
    //顶部种类切换
    handleClickCate (e) {
      this.getCateInfo(e)
    },
    //根据雪花id获取总类名称
    getSnofId () {
      let list = this.categoryItemList;
      for (let item of list) {
        if (item.tagName == this.checkItem) {
          return item.snowflakeId;
        }
      }
    },
    //获取对应种类信息
    getCateInfo (e) {
      this.checkItem = e;
      this.searchParam.tagSnowflakeId = this.getSnofId();
      this.searchParam.pageNumber = 1;
      this.newsScroll.scrollTo(0, 0)
      this.getData();
    }
  },
  watch: {
    news () {
      this.$nextTick(() => {
        if (!this.newsScroll) {
          this.newsScroll = new BScroll(this.$refs.newlist, {
            scrollY: true,
            // pullDownRefresh: true,
            // pullUpLoad: true,
            pullDownRefresh: {
              threshold: 50,
            },
            pullUpLoad: {
              threshold: -40 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
            },
            click: true,
            scrollbar: {
              fade: true,
              interactive: false
            }
          })

          this.newsScroll.on('pullingDown', () => {
            this.onDownRefresh()
          })

          this.newsScroll.on('pullingUp', () => {
            this.onLoad()
          })

          this.newsScroll.on('scroll', (position) => {
            if (position.y > 50) {
              this.text = '释放立即刷新'
            } else {
              this.text = '下拉刷新'
            }
          })
        } else {
          this.newsScroll.refresh()
        }
      })
    }
  },
  activated () {
    let vm = this;
    if (this.newsScroll) {
      this.newsScroll.refresh()
    };
    vm.initShare().then((res) => {
      requireShare(vm.shareParam);
    });
  }
}
</script>

<style scoped>
.news_top {
  height: 80px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
}
.tabs {
  height: 80px;
  width: calc(100% - 65px);
}

.category {
  position: relative;
  height: 80px;
  background: #f6f6f6;
  width: calc(100% - 70px);
  overflow: hidden;
}
.category ul {
  height: 100%;
  width: 100%;
  white-space: nowrap;
  list-style: none;
  background: #f6f6f6;
}
.category ul li {
  position: relative;
  display: inline-block;
  font-size: 30px;
  width: 150px;
  height: 100%;
  line-height: 80px;
  text-align: center;
}
.more_category {
  position: absolute;
  right: 0;
  top: 0;
  background: #f6f6f6;
  padding: 0 15px 0 0;
  box-shadow: -5px 0px 10px 0px #f6f6f6;
}
.more_category .van-icon {
  height: 100%;
  font-size: 50px;
  line-height: 80px;
}
.category_content {
  padding: 40px;
}
.category_top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.category_top .van-icon {
  font-size: 30px;
}
.news_name {
  font-size: 30px;
  padding: 0 20px;
  display: inline-block;
}
.category_list {
  margin-top: 40px;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
}
.category_list li {
  font-size: 26px;
  padding: 20px 0;
  width: 140px;
  text-align: center;
  background: #f2f2f2;
  border-radius: 10px;
  margin: 10px;
}
.mint-header {
  height: 80px;
  line-height: 80px;
  background: #fff;
  color: #000;
  font-size: 32px;
}
.no-more {
  line-height: 80px;
  text-align: center;
}
.information {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 90px;
  background: #fff;
  padding: 0 30px;
}
.list-item {
  padding: 30px 0;
  border-bottom: 1px solid #dcdcdc;
  overflow: hidden;
}
.list-item .left {
  position: relative;
  width: 380px;
  height: 170px;
  float: left;
  font-size: 30px;
}
.left .item-title {
  line-height: 40px;
  max-height: 130px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #000;
}
.time-read {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  display: flex;
  align-items: center;
  color: #888888;
}
.date-line span {
  min-width: 170px;
}
.time-read .date-line,
.time-read .read-line {
  height: 100%;
  display: flex;
  align-items: center;
}
.time-read .date-line {
  padding-right: 60px;
}
.date-line .clock {
  height: 33px;
  width: 33px;
  margin-right: 10px;
}
.read-line .eye {
  width: 40px;
  height: 25px;
  padding-right: 10px;
}
.list-item .right {
  float: right;
  height: 170px;
  width: 255px;
  background: #000000;
  border-radius: 15px;
}
.right img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}
</style>