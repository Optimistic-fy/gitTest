<template>
  <div>
    <div class="jobcontent">
      <!-- 搜索 -->
      <div class="search_text">
        <div class="search" @click="searchFocus">
          <input class="search_input" type="text" v-model="searchParam.keyword" placeholder="请输入相关搜索的内容" confirm-type="search" @confirm="getJobList" ref="searchText">
          <div class="btn default_back_color" @click.stop="getSearchJobList">搜索</div>
        </div>
      </div>
      <SearchParam :jobCategory="jobCategory" @cityVal='cityVal' @IndustryVal='IndustryVal' @eduVal='eduVal' @sortedVal='sortedVal' @priorityVal='priorityVal'></SearchParam>
      <!-- 职位列表 -->
      <div class="list-box" id="listWarp" ref="wrap">
        <jobList :listData="listData" :childrenId="childrenId" :text="text" :buttonText="buttonText" :finished="finished" :isFirstPage="isFirstPage" :isFinalPage="isFinalPage" :scrollHeight="scrollHeight" :pageNumber="searchParam.pageNumber"
          @changeState="changeState" @signInf="signInf" @noLogin="noLogin" @getPrePageList="getPrePageList" @getNextPageList="getNextPageList" id="job-list-div" />
      </div>
    </div>
  </div>
</template>

<script>
import JobList from './JobList'
import SearchParam from './SearchParam'
import BScroll from 'better-scroll'
import { mapActions, mapState } from 'vuex'
import { requireShare } from '../utils/share.js'

export default {
  components: {
    JobList,
    SearchParam
  },
  computed: {
  },
  data() {
    return {
      loginState: false,
      listData: [],
      childrenId: '',
      searchParam: {
        pageNumber: 1, // 几页
        pageSize: 70, // 一页的数量
        keyword: '', // 搜索关键字
        sorted: 'time', // 排序
        city: '', // 城市
        educations: [], // 学历
        jobCategory: '', // 工业
        priority: 0, // 军属或者军人
        userCity: '',
        provinceName: '',
        cityName: '',
        companyName: ''
      },
      jobCategory: {},
      showLogo: false,
      finished: false,
      myScroll: null,
      text: '',
      buttonText: '加载中...',
      scrollHeight: 0,
      shareParam: {},
      totalPage: 0,
      isFirstPage: true,
      isFinalPage: false,
      pageNumber: ''
    }
  },
  created() {
    let number = localStorage.getItem('pageNumber')
    if (number != null) {
      this.searchParam.pageNumber = parseInt(number)
      this.getProvince()
    } else {
      this.getProvince()
    }
    // this.getProvince()
    // this.$store.state.ifRefresh = false
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  methods: {
    ...mapActions(['storeInfo', 'getAppidInfo']),
    searchFocus() {
      this.$refs.searchText.focus();
    },
    //获取省份
    getProvince() {
      this.getAppidInfo().then(res => {
        this.searchParam.provinceName = res;
        this.getJobList()
      })
    },
    initShare() {
      let vm = this;
      return new Promise((resolve, reject) => {
        let typeName = vm.$route.name;
        let currentUrl = window.location.href;
        if (currentUrl.indexOf("isshare") == -1) {
          currentUrl = currentUrl + "?isshare=true";
        }
        vm.shareParam = {
          type: typeName,
          imgUrl: vm.stylePath + vm.appid + "/img/job_list_share.jpg" + "?" + new Date().getTime(),
          desc: "",
          title: "",
          link: currentUrl
        }
        resolve()
      })
    },
    onDownRefresh() {
      this.handleSearchChange('down')
      this.myScroll.finishPullDown();
    },
    onLoad() {
      if (!this.finished) {
        this.searchParam.pageNumber = this.searchParam.pageNumber + 1
        this.getJobList()
      }
      this.myScroll.finishPullUp()
    },
    // 立即投递回调
    changeState(index) {
      let arr = this.listData
      arr[index].isDeliver = 1
      this.$set(this.listData, arr)
    },
    // 登陆回调a
    signInf(blu, id) {
      this.getSignUp = blu
      this.thatId = id
    },
    getSearchJobList() {
      this.handleSearchChange()
      if (this.searchParam.keyword == '') {
        this.searchParam.companyName = '';
      }
    },
    // 获取职位列表对象
    getJobList() {
      let vm = this
      const searchParam = { ...this.searchParam };
      if (searchParam.provinceName === '全国') {
        searchParam.provinceName = '';
      }
      vm.$post(`${vm.$global.PREFIX}/job/search`, searchParam).then(res => {
        if (res.data.code === 200) {
          if (res.data.root.content.length === 0 && res.data.root.number === 1) {
            vm.listData = []
            vm.finished = true;
            vm.buttonText = '暂无数据！';
          } else {
            if (res.data.root.content && res.data.root.content.length < 70) {
              vm.finished = true;
              vm.isFinalPage = true;
              vm.buttonText = '我是有底线的！';
            } else {
              vm.finished = false;
              vm.buttonText = '上拉加载更多...';
            }
            vm.listData = res.data.root.content
            for (let index = 0; index < vm.listData.length; index++) {
              let title = vm.listData[index]['cityName'];
              if (title.length <= 4) {
                if (title.indexOf('市') !== -1) {
                  vm.listData[index]['cityName'] = title.slice(0, title.length - 1);
                }
              }
            }
            vm.totalPage = res.data.root.totalPages
            // if (vm.searchParam.pageNumber == 1) {
            //   vm.listData = res.data.root.content
            // } else {
            //   vm.listData = vm.listData.concat(res.data.root.content)
            // }
          }
          if (res.data.root.totalElements == 0) {
            this.isFirstPage = true;
            this.isFinalPage = true;
          } else {
            this.getPage()
          }
        }
      }).catch(err => {
        vm.finished = true;
        vm.buttonText = '我是有底线的！';
        console.log(err);
      })
    },
    // 日期转换
    dataTransform(time) {
      if (time !== '') {
        let thatDate = new Date()
        // let thathours = thatDate.getHours()
        let mydate = thatDate.getFullYear() + '-' + (thatDate.getMonth() + 1) + '-' + thatDate.getDate() // 当前时间
        let jobDate = time.split(' ') // 工作发布时间
        let hours = jobDate[1].split(':') // [11, 54, 10] = [时，分，秒]
        let dataArr = jobDate[0].split('-')
        let jobYear = { // 当前工作年月日
          year: dataArr[0],
          Month: dataArr[1],
          day: dataArr[2]
        }
        let thisYear = { // 当前时间年月日
          year: thatDate.getFullYear() + '',
          Month: thatDate.getMonth() + 1 + '',
          day: thatDate.getDate() + ''
        }
        if (jobDate[0] === mydate) {
          return hours[0] + ':' + hours[1]
        } else if (jobYear.year === thisYear.year && jobYear.Month === thisYear.Month) {
          if (thisYear.day - jobYear.day === 1) {
            return '昨天'
          }
          // thisYear.day - jobYear.day + '天前'
        } else {
          return jobDate[0]
        }
      }
    },
    cityVal(cityVal) {
      if (cityVal.city === '全部') {
        this.searchParam.cityName = ''
      } else {
        this.searchParam.cityName = cityVal.city ? cityVal.city.replace('市', '') : ''
      }
      this.searchParam.provinceName = cityVal.province
      this.handleSearchChange()
    },
    IndustryVal(IndustryVal, leftIndys) {
      if (leftIndys === 0) {
        this.searchParam.jobCategory = ''
      } else {
        this.searchParam.jobCategory = IndustryVal
      }
      this.handleSearchChange()
    },
    eduVal(eduVal) {
      this.searchParam.educations = eduVal
      this.handleSearchChange()
    },
    sortedVal(sortedVal) {
      this.searchParam.sorted = sortedVal
      this.handleSearchChange()
    },
    priorityVal(priorityVal) {
      this.searchParam.priority = priorityVal
      this.handleSearchChange()
    },
    // 关闭登陆
    close(value) {
      this.loginState = false
    },
    noLogin(val) {
      this.loginState = val
    },
    // 登录成功
    loginSuccess() {
      this.getJobList()
    },
    //获取上一页数据
    getPrePageList() {
      if (this.searchParam.pageNumber > 1) {
        this.searchParam.pageNumber = this.searchParam.pageNumber - 1;
        this.isFirstPage = false;
        this.isFinalPage = false;
        this.getJobList();
        this.clearLocal();
        this.myScroll.scrollTo(0, 0, 0);
      }
    },
    //获取下一页数据
    getNextPageList() {
      if (this.searchParam.pageNumber < this.totalPage) {
        this.searchParam.pageNumber = this.searchParam.pageNumber + 1;
        this.isFirstPage = false;
        this.isFinalPage = false;
        this.getJobList();
        this.clearLocal();
        this.myScroll.scrollTo(0, 0, 0);
      }
    },
    //返回之前高度，并判断上下页显示情况
    goToHeight() {
      let scrollheight = localStorage.getItem('scrollHeight')
      if (scrollheight != null) {
        this.myScroll.scrollTo(0, scrollheight)
        this.getPage()
      }
    },
    //判断上下页样式显示
    getPage() {
      if (this.pageNumber === 1 || this.searchParam.pageNumber === 1) {
        this.isFirstPage = true;
      } else {
        this.isFirstPage = false;
      }
      if (this.pageNumber === this.totalPage || this.searchParam.pageNumber === this.totalPage) {
        this.isFinalPage = true;
      } else {
        this.isFinalPage = false;
      }
    },
    //清楚高度以及页码缓存
    clearLocal() {
      localStorage.removeItem('scrollHeight');
      localStorage.removeItem('pageNumber');
    },
    //搜索页码  1  ，页面回到顶部
    handleSearchChange(str) {
      this.searchParam.pageNumber = 1;
      this.finished = false
      this.getJobList()
      if (!str) {
        this.myScroll.scrollTo(0, 0);
      }
      this.clearLocal();
    }
  },
  watch: {
    listData() {
      this.$nextTick(() => {
        if (!this.myScroll) {
          this.myScroll = new BScroll(this.$refs.wrap, {
            scrollY: true,
            probeType: 3,
            // pullDownRefresh: true,
            // pullUpLoad: true,
            pullDownRefresh: {
              threshold: 50,
            },
            // pullUpLoad: {
            //   threshold: -40 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
            // },
            click: true,
            scrollbar: {
              fade: true,
              interactive: false
            },
            bounce: true
          })
          this.myScroll.on('pullingDown', () => {
            this.onDownRefresh()
          })
          // this.myScroll.on('pullingUp', () => {
          //   this.onLoad()
          // })
          this.myScroll.on('scroll', (position) => {
            this.scrollHeight = position.y;
            if (position.y > 50) {
              this.text = '释放立即刷新'
            } else {
              this.text = '下拉刷新'
            }
          })
        } else {
          this.myScroll.refresh()
        }
        this.goToHeight()
      })
    }
  },
  activated() {
    // 初始化分享
    this.initShare().then((res) => {
      requireShare(this.shareParam);
    });
    //解决ios滚动问题
    if (this.myScroll) {
      this.myScroll.refresh()
    }
    if (window.location.href.includes('accessToken')) {
      this.storeInfo()
    }
    // let number = localStorage.getItem('pageNumber')
    // if (number != null && this.$store.state.ifRefresh) {
    //   this.searchParam.pageNumber = parseInt(number)
    //   this.getProvince()
    // }
    let vm = this;
    let hasCompanyName = this.$store.state.companyName;
    if (hasCompanyName) {
      vm.searchParam.keyword = hasCompanyName;
      vm.searchParam.companyName = hasCompanyName;
      vm.getSearchJobList();
    }
    if (localStorage.getItem('industryName') && localStorage.getItem('industryId')) {
      vm.searchParam.jobCategory = localStorage.getItem('industryId')
      vm.jobCategory = {
        id: localStorage.getItem('industryId'),
        name: localStorage.getItem('industryName'),
        index: localStorage.getItem('industryIndex')
      }
      this.getSearchJobList();
      localStorage.removeItem('industryName')
      localStorage.removeItem('industryId')
      localStorage.removeItem('industryIndex')
    }
  },
  deactivated() {
    localStorage.setItem('scrollHeight', this.scrollHeight);
    localStorage.setItem('pageNumber', this.searchParam.pageNumber);
    this.searchParam.keyword = '';
    this.searchParam.companyName = '';
    this.$store.state.companyName = '';
  }
}
</script>

<style>
.jobcontent {
  padding: 0 30px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 90px;
}
.search_text {
  width: 100%;
  line-height: 74px;
  padding: 12px 0;
  background: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.search_text div {
  width: 98%;
  height: 74px;
  margin: 0 auto;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.search_text div .search_input {
  background: #dcdcdc;
  width: 100%;
  text-align: left;
  font-size: 28px;
  padding-left: 22px;
}
.search_text div .btn {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  width: 22%;
  height: 74px;
  border-radius: 0;
  line-height: 74px;
  color: #ffffff;
  font-size: 28px;
  text-align: center;
}
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: (rgba(0, 0, 0, 0.5));
}
.list-box {
  position: fixed;
  top: 180px;
  left: 0;
  right: 0;
  bottom: 90px;
  background: #f4f4f4;
}
</style>