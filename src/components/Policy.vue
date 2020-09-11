<template>
  <div class="information">
    <div class="information-list"
         ref="policylist">
      <template v-if="policy.length > 0">
        <div class="list">
          <div class="down">{{text}}</div>
          <div class="list-item"
               v-for="item in policy"
               :key="item.id"
               @click="clickInformation(item.snowflakeId)">
            <div class="left_box">
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
  </div>
</template>

<script>
import { requireShare } from '../utils/share.js'
import { mapState } from 'vuex'
import BScroll from 'better-scroll'

export default {
  name: 'Policy',
  data () {
    return {
      policy: [],
      searchParam: {
        pageNumber: 1, // 几页
        pageSize: 10, // 一页的数量
      },
      publicPath: '',
      policylist: null,
      noMore: false, // 是否还有更多
      text: '',
      buttonText: '上拉加载更多...',
      loadingText: '加载中...'
    }
  },
  created () {
    this.publicPath = this.stylePath + this.appid + "/img/";
  },
  mounted () {
    requireShare();
    this.getData()
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  methods: {
    getData () {
      let vm = this;
      this.$post(`${this.$global.PREFIX}/policy/page?` + Math.random() / 9999, vm.searchParam).then(res => {
        if (res.data.code === 200) {
          if (res.data.root.content.length === 0 && res.data.root.number === 1) {
            vm.policy = []
            vm.noMore = true;
            vm.loadingText = '暂无政策！';
          } else {
            if (res.data.root.content && res.data.root.content.length < 10) {
              vm.noMore = true;
              vm.buttonText = '我是有底线的！';
            } else {
              vm.noMore = false;
              vm.buttonText = '上拉加载更多...';
            }
            if (vm.searchParam.pageNumber == 1) {
              vm.policy = res.data.root.content;
            } else {
              vm.policy = vm.policy.concat(res.data.root.content);
            }
          }
        }
      }).catch(err => {
        vm.noMore = true;
        vm.buttonText = '我是有底线的！';
      })
    },
    clickInformation (id) {
      // console.log('id', id)
      this.$router.push({ path: `/${this.appid}/policyDetail`, query: { id } });
    },
    onDownRefresh () {
      this.searchParam.pageNumber = 1;
      this.noMore = false;
      this.getData();
      this.policyScroll.finishPullDown();
    },
    onLoad () {
      if (!this.noMore) {
        this.searchParam.pageNumber = this.searchParam.pageNumber + 1;
        this.getData();
      }
      this.policyScroll.finishPullUp();
    },
  },
  watch: {
    policy () {
      this.$nextTick(() => {
        if (!this.policyScroll) {
          this.policyScroll = new BScroll(this.$refs.policylist, {
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

          this.policyScroll.on('pullingDown', () => {
            this.onDownRefresh()
          })

          this.policyScroll.on('pullingUp', () => {
            this.onLoad()
          })

          this.policyScroll.on('scroll', (position) => {
            if (position.y > 50) {
              this.text = '释放立即刷新'
            } else {
              this.text = '下拉刷新'
            }
          })
        } else {
          this.policyScroll.refresh()
        }
      })
    }
  },
  activated () {
    if (this.policyScroll) {
      this.policyScroll.refresh()
    };
  }
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
.information-list {
  padding: 0 30px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}
.list-item {
  padding: 30px 0;
  border-bottom: 1px solid #efeff4;
}
.list-item .left_box {
  position: relative;
  font-size: 30px;
}
.left_box .item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  margin-bottom: 40px;
}
.time-read {
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
.no-more {
  line-height: 80px;
  text-align: center;
}
</style>