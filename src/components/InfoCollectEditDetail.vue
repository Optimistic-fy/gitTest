<template>
  <div>
    <div class="info">
      <div class="from-back info_head_line"
           v-if="show">
        信息来自留存档案，如需修改请联系<span>010-84243158</span>
      </div>
      <div>
        <div class="info_form_check"
             v-if="info">
          <div class="info_form_block">
            <div class="info_title">
              <div class="info_title_header default_info_border_color">基本信息</div>
              <div class="editor_btn btn_gradient_color"
                   @click="clickEditor">编辑</div>
            </div>
            <div class="block">
              <div class="label mustfill">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</div>
              <div class="input">{{info.name}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别</div>
              <div class="input">{{info.sex}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">入&nbsp;&nbsp;伍&nbsp;&nbsp;地</div>
              <div class="input">{{info.enlistProvince || ''}}{{info.enlistCity || ''}}{{info.enlistDistrict || ''}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">政治面貌</div>
              <div class="input">{{info.political}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">健康情况</div>
              <div class="input">{{info.health}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">文化程度</div>
              <div class="input">{{info.education}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">入伍时间</div>
              <div class="input">{{info.serviceBeginTime || ""}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">退伍时间</div>
              <div class="input">{{info.serviceEndTime || ""}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">手机号码</div>
              <div class="input">{{info.mobile}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">邮&nbsp;&nbsp;箱&nbsp;&nbsp;号</div>
              <div class="input">{{info.email}}</div>
            </div>
            <div class="block">
              <div class="label mustfill">家庭住址</div>
              <div class="input">{{info.familyAddress}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">身份证号</div>
              <div class="input">{{info.idCard}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">退役证编号</div>
              <div class="input">{{info.retireNumber}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">退役安置方式</div>
              <div class="input">{{info.retirePlacementMode}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">安&nbsp;&nbsp;置&nbsp;&nbsp;地</div>
              <div class="input">{{info.placementProvince || ''}}{{info.placementCity || ''}}{{info.placementDistrict || ''}}</div>
            </div>

            <!-- <div class="block">
              <div class="label mustfill">部队从事的主要岗位</div>
              <div class="input">{{info.armyPosition}}</div>
            </div> -->

            <div class="block">
              <div class="label mustfill">本人特长</div>
              <div class="input">{{info.speciality}}</div>
            </div>
          </div>

          <div class="info_form_block">
            <div class="info_title">
              <div class="info_title_header default_info_border_color">培训意愿</div>
            </div>

            <div class="block">
              <div class="label mustfill">培训类型</div>
              <div class="input">{{info.trainType}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">培训地点</div>
              <div class="input">{{info.trainProvince || ''}}{{info.trainCity || ''}}{{info.trainDistrict || ''}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">培训专业</div>
              <div class="input">{{info.trainMajor}}</div>
            </div>

            <!-- <div class="block">
              <div class="label mustfill">培训课程</div>
              <div class="input">{{info.trainClass}}</div>
            </div> -->
          </div>

          <div class="info_form_block">

            <div class="info_title">
              <div class="info_title_header default_info_border_color">就业需求</div>
            </div>

            <div class="block">
              <div class="label mustfill">是否需要马上就业</div>
              <div class="input">{{info.urgentNeedJob}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">就业地点</div>
              <div class="input">{{info.employmentProvince || ''}}{{info.employmentCity || ''}}</div>
            </div>

            <div class="block">
              <div class="label mustfill">期望行业</div>
              <div class="input">
                <span v-for="(item, index) in info.expectIndustryList"
                      :key="index"
                      style="padding-right: 10px;">{{item}}</span>
              </div>
            </div>

            <div class="block">
              <div class="label mustfill">期望薪资</div>
              <div class="input">{{info.expectSalaryRang}}</div>
            </div>
          </div>
        </div>
        <div class="no-info"
             v-else>
          你尚未完善信息！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { requireShare } from '../utils/share.js'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      info: [],
      show: false
    }
  },
  mounted() {
    requireShare();
    this.queryUserInfo()
  },
  computed: {
    ...mapState(['appid'])
  },
  methods: {
    // 查询用户信息
    queryUserInfo() {
      let vm = this
      this.$get(`${vm.$global.PREFIX}/user/info`).then(res => {
        if (res.data.root) {
          vm.info = res.data.root
          vm.info.serviceBeginTime = res.data.root.serviceBeginTime.substr(0, 7)
          vm.info.serviceEndTime = res.data.root.serviceEndTime.substr(0, 7)
          if (res.data.root.type == '1') {
            vm.show = true
          } else if (res.data.root.type == '0') {
            if (res.data.root.printName != null && res.data.root.printName != '' && res.data.root.printName != undefined) {
              vm.show = true
            } else {
              vm.show = false
            }
          }
          else {
            vm.show = false
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    clickEditor() {
      this.$router.push({ path: `/${this.appid}/infoCollectEdit` })
    }
  }
}
</script>

<style scoped>
.info {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background: #f4f4f4;
}
.from-back {
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #fff;
  font-size: 30px;
}
.from-back span {
  font-weight: bolder;
}
.info_form_block {
  background: #ffffff;
}
.info_title {
  border-bottom: 1px solid #dcdcdc;
  line-height: 1;
  height: 90px;
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 12px;
}
.info_title_header {
  font-size: 34px;
  padding: 0 30px;
}
.editor_btn {
  width: 140px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 34px;
  color: #fff;
  border-radius: 10px;
  margin-left: 365px;
}
.info_form_check .block {
  padding: 30px 0;
  margin: 0 30px;
  display: flex;
  align-items: center;
  border-top: 1px solid #dcdcdc;
  position: relative;
}
.info_form_block .block:nth-child(2) {
  border-top: none;
}
.info_form_check .label {
  font-size: 32px;
  padding-left: 18px;
  color: #888888;
}
.info_form_check .input {
  font-size: 32px;
  margin-left: 40px;
}
.address_textarea {
  width: 400px;
  height: 130px;
}
.industry_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  line-height: 60px;
  margin: 0 30px;
}
.no-info {
  width: 100%;
  text-align: center;
  font-size: 30px;
}
</style>