<template>
  <div class="college">
    <div class="college-content">
      <div class="top-search">
        <div class="collgeg-search">
          <van-icon class="search-icon"
                    name="search" />
          <span class="gap">|</span>
          <input type="text"
                 v-model="inputschool"
                 placeholder="请输入院校名" />
        </div>
      </div>
      <!-- 院校列表 -->
      <div class="college-list" ref="collegelist">
        <template v-if="schoolList && schoolList.length > 0 ">
            <div>
                <div class="down">{{text}}</div>
                <li class="list-item"
                    @click="clickCollege(item.snowflakeId)"
                    v-for="item in schoolList"
                    :key="item.snowflakeId">
                    <div class="left">
                        <div class="item-title">
                        {{item.name}}
                        </div>
                    </div>
                    <!-- <div class="right">
                        <img :src="item.imgUrl"
                            mode="">
                    </div> -->
                </li>
                <div class="no-more">{{buttonText}}</div>
            </div>
        </template>
        <template v-else>
            <div class="no-result">
                {{loadingText}}
            </div>
        </template>
      </div>
      <!-- 搜索列表 -->
      <ul class="school-list"
          v-if="showSchoolList && searchList.length > 0">
        <li v-for="(item, index) in searchList"
            :key="index"
            @click="getSchoolDetail(item.id)">{{item.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { List, Icon } from 'vant'
import { requireShare } from '../utils/share.js'
import { mapState } from 'vuex'
import BScroll from 'better-scroll'

export default {
  components: { List, Icon },
  data () {
    return {
      inputschool: '',
      showSchoolList: false,
      schoolList: [],
      searchList: [],
      searchParam: {
        pageNumber: 1, // 几页
        pageSize: 10, // 一页的数量
      },
      noMore: false, // 是否还有更多
      schoolScroll: null,
      text: '',
      buttonText: '上拉加载更多...',
      loadingText: '加载中...',
    }
  },
  created () {
    requireShare();
    this.getData(this.searchParam)
  },
  computed: {
    ...mapState(['appid'])
  },
  mounted () {
  },
  methods: {
    onDownRefresh () {
      this.searchParam.pageNumber = 1;
      this.noMore = false;
      this.getData(this.searchParam);
      this.schoolScroll.finishPullDown();
    },
    onLoad () {
      if (!this.noMore) {
        this.searchParam.pageNumber = this.searchParam.pageNumber + 1;
        this.getData(this.searchParam);
      }
      this.schoolScroll.finishPullUp();
    },
    clickCollege (id) {
      this.$router.push({ path: `/${this.appid}/recruitCollegesDetail`, query: { id } });
    },
    getSchoolDetail (id) {
      this.$router.push({ path: `/${this.appid}/recruitCollegesDetail`, query: { id } });
    },
    getData (searchParam) {
      let vm = this
      this.loading = true
      vm.$post(`${vm.$global.PREFIX}/school/list`, searchParam).then(res => {
        if (res.data.code === 200) {
            if (res.data.root.content.length === 0 && res.data.root.number === 1) {
                vm.schoolList = []
                vm.noMore = true;
                vm.loadingText = '暂无院校！';
            } else {
                if (res.data.root.content && res.data.root.content.length < 10) {
                    vm.noMore = true;
                    vm.buttonText = '我是有底线的！';
                }else{
                    vm.noMore = false;
                    vm.buttonText = '上拉加载更多...';
                }
                if (vm.searchParam.pageNumber == 1) {
                    vm.schoolList = res.data.root.content
                } else {
                    vm.schoolList = vm.schoolList.concat(res.data.root.content)
                }
                vm.loading = false;
            }
        }
      }).catch(err => {
        vm.noMore = true;
        vm.buttonText = '我是有底线的！';
      })
    }
  },
  watch: {
    inputschool () {
      if (this.inputschool) {
        this.showSchoolList = true
        this.searchList = []
        let schoolList = this.schoolList
        for (let i in schoolList) {
          if (schoolList[i].name.includes(this.inputschool)) {
            this.searchList.push({ name: schoolList[i].name, id: schoolList[i].snowflakeId })
          }
        }
      } else {
        this.showSchoolList = false
      }
    },
    schoolList(){
        this.$nextTick(() => {
        if (!this.schoolScroll) {
          this.schoolScroll = new BScroll(this.$refs.collegelist, {
            scrollY: true,
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

          this.schoolScroll.on('pullingDown', () => {
            this.onDownRefresh()
          })

          this.schoolScroll.on('pullingUp', () => {
            this.onLoad()
          })

          this.schoolScroll.on('scroll', (position) => {
            if (position.y > 50) {
              this.text = '释放立即刷新'
            } else {
              this.text = '下拉刷新'
            }
          })
        } else {
          this.schoolScroll.refresh()
        }
      })
    }
  },
  activated () {
    let vm = this;
    if (this.schoolScroll) {
      this.schoolScroll.refresh()
    };
  }
}
</script>

<style>
.college,
.college-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.top-search {
    position: relative;
  background: #f4f4f4;
  padding: 15px 0;
  z-index: 1000;
}
.collgeg-search {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  margin: 0 30px;
  font-size: 30px;
  display: flex;
  align-items: center;
}
.gap {
  padding: 0 20px;
  color: #d8d8d8;
}
.collgeg-search input {
  height: 40px;
  width: 620px;
  color: #000;
}
.college-list {
    position: fixed;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
  background: #f2f2f2;
}
.list-item {
  padding: 30px 30px;
  border-bottom: 1px solid #efeff4;
  overflow: hidden;
  background: #fff;
}
.list-item .left {
  position: relative;
  width: 450px;
  height: 120px;
  float: left;
  font-size: 30px;
}
.left .item-title {
  max-height: 130px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.list-item .right {
  float: right;
  height: 120px;
  width: 170px;
  background: #000000;
  border-radius: 15px;
}
.list-item .right img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}
.school-list,
.no-school {
  position: fixed;
  top: 123px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 10;
  font-size: 30px;
}
.school-list li {
  border-bottom: 1px solid #f4f4f4;
  padding: 10px 0 10px 30px;
}
.no-more {
  line-height: 80px;
  text-align: center;
}
</style>