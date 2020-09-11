<template>
  <div>
    <div class="page">
      <div v-if="list!==null && list.length>0">
        <div class="list_box"
             v-for="(item,index) in list"
             :key="index">
          <div class="list_l">
            <div>
              <div class="school_name">{{item.schoolName}}</div>
              <div class="major_specialty">
                <text class="">{{item.courseName}}</text>
                <text>></text>
                <text class="">{{item.majorName}}</text>
              </div>
            </div>
            <div class="time">
              <div class="time_img">
                <img class="img"
                     :src="publicPath + 'icon_time.png' + '?time=' + new Date().getTime()" />
              </div>
              <div>{{item.createTime}}</div>
            </div>
          </div>
          <div class="list_r">
            <img class="img"
                 :src="item.schoolImgUrl" />
          </div>
        </div>
      </div>
      <div v-else
           class="no-result">
        暂无报名记录
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { requireShare } from '../utils/share.js'

export default {
  data () {
    return {
      list: [{
        courseName: "",
        courseSnowflakeId: "",
        createTime: "",
        majorName: "",
        majorSnowflakeId: "",
        schoolAddress: '',
        schoolEmail: '',
        schoolHomePage: '',
        schoolImgUrl: "",
        schoolName: "",
        schoolPhone: '',
        schoolSnowflakeId: "",
        snowflakeId: "",
      }],
      params: {
        pageNumber: 1,
        pageSize: 10
      },
      publicPath: ''
    }
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  created () {
    requireShare();
    this.getList();
    this.publicPath = this.stylePath + this.appid + "/img/";
  },
  methods: {
    getList () {
      let vm = this
      this.$post(`${vm.$global.PREFIX}/enroll/list`, vm.params).then(res => {
        if (res.data.code === 200) {
          if (res.data.root) {
            if (res.data.root.content) {
              vm.list = res.data.root.content
            }
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.img {
  width: 100%;
  height: 100%;
}
.list_box {
  display: flex;
  justify-content: space-between;
  padding: 30px 30px;
  border-bottom: 1px solid #dcdcdc;
}
.school_name,
.major_specialty {
  max-width: 412px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.school_name {
  font-weight: 600;
  font-size: 36px;
  color: #000;
}
.list_l {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.list_r {
  width: 260px;
  height: 180px;
  border-radius: 10px;
  background: #007aff;
}
.major_specialty {
  height: 70px;
  line-height: 70px;
  font-size: 26px;
  color: #888;
  padding: 0 20px;
  margin-bottom: 20px;
}
.major_specialty text {
  margin: 0 5px;
}
.time {
  font-size: 26px;
  color: #888;
  display: flex;
  align-items: center;
}
.time_img {
  width: 30px;
  height: 30px;
  margin: 0 20px;
  font-size: 0px;
}
.no-result {
  border-top: 10px solid #f4f4f4;
  text-align: center;
  font-size: 30px;
  line-height: 60px;
  color: #666666;
}
</style>