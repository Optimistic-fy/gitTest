<template>
  <div class="page_box">
    <div v-if="list.length > 0">
      <div class="delever_list"
           v-for="(item,index) in list"
           :key="index"
           @click="goJobDetail(item.id)">
        <div class="list_info">
          <div class="info_l">
            <div class="info_head">
              <div class="info_title"><span>{{item.jobTitle}}</span><span v-if="item.cityName">【{{item.cityName}}】</span></div>
              <div class="pay_text">【<span>{{item.salaryMin}}-{{item.salaryMax}}</span>/月】</div>
            </div>
            <div class="info_company">{{item.companyName}}</div>
          </div>
          <div class="info_r"><img class="img"
                 :src="publicPath + 'right_icon.png' + '?time=' + new Date().getTime()" /></div>
        </div>
        <div class="info_bottom">
          <div class="">企业反馈：
            <span class="state_text"
                  v-if="item.status === 0">未查看</span>
            <span class="state_text"
                  v-else>已查看</span>
          </div>
          <div class="">投递于：<span>{{item.createTime}}</span></div>
        </div>
      </div>
    </div>
    <div v-else
         class="no-result">
      暂无投递记录
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { requireShare } from '../utils/share.js'

export default {
  data () {
    return {
      list: [],
      publicPath: ''
    }
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  mounted () {
    requireShare();
    this.getData();
    this.publicPath = this.stylePath + this.appid + "/img/";
  },
  methods: {
    getData () {
      let vm = this
      vm.$get(`${vm.$global.PREFIX}/deliver/record`).then(res => {
        if (res.data.root) {
          vm.list = res.data.root
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 查看职位详情
    goJobDetail (id) {
      this.$router.push({ path: `/${this.appId}/jobDetail`, query: { id } })
    }
  }
}
</script>

<style scoped>
body {
  background: #f4f4f4;
}
.page_box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f4f4f4;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.delever_list {
  background: #fff;
  padding: 0 30px;
  margin-top: 10px;
  padding-top: 10px;
}
.list_info {
  border-bottom: 1px solid #c8c7cc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0px;
}
.info_r {
  height: 36px;
  width: 24px;
}
.img {
  display: block;
  width: 100%;
  height: 100%;
}
.info_head {
  font-size: 30px;
  font-weight: 600;
  height: 50px;
  display: flex;
}
.info_company {
  font-size: 24px;
  color: #888;
}
.info_bottom {
  height: 80px;
  line-height: 80px;
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 24px;
}
.pay_text {
  color: red;
  font-weight: 600;
}
.state_text {
  color: #3f8745;
  font-weight: 600;
}
.info_title {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.no-result {
  border-top: 10px solid #f4f4f4;
  text-align: center;
  font-size: 30px;
  line-height: 60px;
  color: #666666;
}
</style>