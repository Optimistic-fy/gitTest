<template>
  <div>
    <div class="job-guid">
      <div class="guide-all">
        <template v-if="guide.length > 0">
          <ul class="guide-list">
            <li @click="clickGuideList(item.snowflakeId)"
                v-for="item in guide"
                :key="item.id">
              <div class="guide-content">
                {{item.title}}
              </div>
              <div class="time">
                {{item.publishTime.split(' ')[0]}}
                <img src="http://img.81lianpin.com/wechat_app/shanxi/right@2x.png"
                     mode="" />
              </div>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="no-result">
            暂无数据
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { requireShare } from '../utils/share.js'

export default {
  name: 'Guide',
  data () {
    return {
      guide: [],
      searchParam: {
        pageNumber: 1, // 几页
        pageSize: 10, // 一页的数量
      },
    }
  },
  mounted () {
    requireShare();
    let vm = this
    vm.$post(`${vm.$global.PREFIX}/guide/list`, vm.searchParam).then(res => {
      if (res.data.code === 200) {
        let data = res.data.root
        vm.guide = data.content
      }
    })
  },
  computed: {

  },
  methods: {
    clickGuideList (id) {
      this.$router.push({ path: '/jobGuideDetail', query: { id } })
    }
  }
}
</script>

<style scoped>
.job-guid,
.guide-all {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
}
.guide-all {
  top: 0;
  background: #fff;
}
.guide-list {
  padding: 0 30px;
}
.guide-list li {
  height: 90px;
  line-height: 90px;
  font-size: 26px;
  color: #333333;
  border-top: 1px solid #f4f4f4;
}
.guide-list .guide-content {
  width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
}
.guide-list .time {
  float: right;
  color: #888888;
}
.time img {
  width: 10px;
  height: 20px;
  padding-left: 15px;
}
</style>