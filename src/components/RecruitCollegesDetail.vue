<template>
  <div class="college-detail">
    <div class="all-college"
         v-if="schoolDetail !== null && schoolDetail !== undefined">
      <ul class="detail-head">
        <li class="head-item"
            @click="changeShow"
            :class="{'default_active_color': !clickCourse }">学院介绍</li>
        <li class="head-item"
            @click="changeShow"
            :class="{'default_active_color': clickCourse }">课程</li>
      </ul>
      <div class="detail-content"
           v-if="!clickCourse">
        <div class="college-name"
             v-if="schoolDetail.name">
          {{schoolDetail.name}}
        </div>
        <!-- <div class="college-pic"
             v-if="schoolDetail.imgUrl">
          <img :src="schoolDetail.imgUrl"
               mode="" />
        </div> -->
        <div class="college-article"
             v-html="schoolDetail.introduce"></div>
      </div>
      <div class="course"
           v-else>
        <div v-if="mayjor.length > 0">
          <ul class="left">
            <li :class="{'default_left_course_color': index == currentIndex }"
                v-for="(item, index) in mayjor"
                :key="item.id"
                @click="changeIndex(index, item.id, item.name)">
              <span class="course-click"
                    :class="{'default_back_color': index == currentIndex }"></span>
              <span class="mayjor">{{item.name}}</span>
            </li>
          </ul>
          <ul class="right"
              v-if="mayjorListAll && mayjorList.length == 0">
            <li @click="clickCourseItem(item.snowflakeId, schoolDetail.name)"
                v-for="item in mayjorListAll"
                :key="item.snowflakeId">{{item.name}}</li>
          </ul>
          <ul class="right"
              v-else>
            <li @click="clickCourseItem(item.snowflakeId, schoolDetail.name)"
                v-for="item in mayjorList"
                :key="item.snowflakeId">{{item.name}}</li>
          </ul>
        </div>
        <div class="no-corse"
             v-else>
          暂无课程！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requireShare } from '../utils/share.js'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      clickCourse: false,
      currentIndex: 0,
      currentMayjor: '',
      mayjorList: [],
      schoolDetail: {},
      mayjor: {},
      mayjorListAll: [],
      isFirstEnter:false
    }
  },
  beforeRouteEnter(to, from, next){
    if(from.name === 'courseDetail'){
        to.meta.isBack = true
    }
    next()
  },
  activated(){
      if(!this.$route.meta.isBack || this.isFirstEnter){
        this.schoolDetail = {}
        this.currentMayjor = ''
        this.mayjorListAll = []
        this.mayjorList = []
        this.clickCourse = false
        this.getDetail();
        this.getMayjor();
      }
      this.$route.meta.isBack = false;
      this.isFirstEnter = false;
  },
  created () {
    this.isFirstEnter = true
  },
  mounted () {
    // requireShare();
  },
  computed: {
    ...mapState(['appid'])
  },
  methods: {
    getDetail(){
        let vm = this
        let id = this.$route.query.id
        vm.$get(`${vm.$global.PREFIX}/school/detail/` + id).then(res => {
            if (res.data.code === 200) {
                vm.schoolDetail = res.data.root
            }
        })
    },
    getMayjor(){
        let vm = this
        let id = this.$route.query.id
        vm.$get(`${vm.$global.PREFIX}/school/major/` + id).then(res => {
            if (res.data.code === 200) {
                vm.mayjor = res.data.root
                if (vm.mayjor.length) {
                    vm.currentMayjor = vm.mayjor[0].name
                    vm.mayjorListAll = vm.mayjor[0].courses
                }
            }
        })
    },
    changeShow () {
      this.clickCourse = !this.clickCourse
    },
    clickCourseItem (id, school) {
      sessionStorage.setItem('chooseCourse', true)
      this.$router.push({ path: `/${this.appid}/courseDetail`, query: { id, schoolname: school, mayjor: this.currentMayjor } });
    },
    changeIndex (index, id, name) {
      this.currentIndex = index
      this.currentMayjor = name
      let self = this
      const mayjor = this.mayjor
      for (var item of mayjor) {
        if (item.id == id) {
          self.mayjorList = item.courses
        }
      }
    }
  }
}
</script>

<style scoped>
.college-detail,
.all-college {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.all-college {
  z-index: 1;
}
.detail-head {
    position: fixed;
    top: 0;
  height: 85px;
  line-height: 85px;
  width: 100%;
  background: #f4f4f4;
  display: flex;
  justify-content: center;
}
.detail-head li {
  display: inline-block;
  font-size: 32px;
  text-align: center;
  margin: 0 120px;
}
.detail-content {
    position: fixed;
    top: 85px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 40px 30px 50px 30px;
}
.college-name {
  font-size: 40px;
  text-align: center;
}
.college-pic {
  width: 100%;
  margin-top: 30px;
}
.college-pic img {
  width: 100%;
  background: #000000;
}
.college-article {
  font-size: 30px;
  letter-spacing: 5px;
}
.course {
  position: absolute;
  top: 85px;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #bdbcbc;
}
.left {
  position: absolute;
  top: 0;
  bottom: 0;
  background: #f4f4f4;
  border-right: 1px solid #bdbcbc;
  z-index: 10;
  width: 250px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.left li {
  width: 250px;
  min-height: 90px;
  font-size: 30px;
  border-right: 1px solid #bdbcbc;
  border-bottom: 1px solid #bdbcbc;
  display: flex;
  align-items: center;
}
.left .mayjor {
  width: 200px;
}
.right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 5;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.right li {
  height: 90px;
  line-height: 90px;
  font-size: 30px;
  text-align: center;
  margin-left: 250px;
  border-bottom: 1px solid #bdbcbc;
}
.course-click {
  display: inline-block;
  width: 10px;
  height: 30px;
  margin-right: 20px;
}
.no-corse {
  width: 100%;
  text-align: center;
  font-size: 30px;
  margin-top: 40px;
}
</style>