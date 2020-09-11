<template>
  <div>
    <div class="person">
      <div class="baseSkill_seleted">
        <div class="my_skill">
          我的技能<div class="num">(还需要选择{{10 - chosesKill.length}}个技能)</div>
        </div>
        <div class="baseSkill_seleted_dv">
          <div class="baseSkill_seleted_ul">
            <div class="li default_back_color" v-for="(item,index) in chosesKill" :key="index" @click="delSkill(index)">{{item.skillName}}<div class="close_skill">x</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 全部基层技能 -->
      <div class="all_baseSkill_content">
        <div class="all_skills">
          <div class="anbao_ctn same_style_for_ul">
            <div class="li" v-for="(item, index) in skillList" :class="chosesKillArray.includes(item) ? 'default_skills_color' : ''" :key="index" @click="addSkill(item)">
              {{item}}
            </div>
            <div class="li" @click="showAdd">自填写 + </div>
          </div>
        </div>
      </div>
      <div class="btn_div default_back_color" @click="saveSkillInfo">保存</div>

      <Popup v-model="InputSkillModel" @hidePopup="InputSkillModel=false">
        <div class="center-box">
          <div class="add_input_skill">
            <div class="h2">添加标签</div>
            <input class="input" type="text" placeholder="请填写" cursor-spacing="70" v-model="inputSkill">
            <div class="chose_btn">
              <div class="btn confirm default_back_color" @click="addSkill(inputSkill, 10)">确认</div>
              <div class="btn cancel" @click="InputSkillModel=false">取消</div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Toast, Popup } from 'vant'
import { requireShare } from '../utils/share.js'

export default {
  components: {
    Toast,
    Popup
  },
  data() {
    return {
      chosesKill: [],
      chosesKillArray: [],
      skillList: ['格斗技能', '商务驾驶', '组织协调', '人事管理', '团队领导', '政府关系', '商务礼仪', '思想教育', '办公软件操作', '外语沟通', '传统销售', '网络销售', '机械维修', '车辆维修', '土木工程', '机械操作', '综合素质', '学习能力', '表达能力', '执行力', '领导力', '团队协作', '抗压力'],
      InputSkillModel: false,
      inputSkill: '',
      backFlag: true
    }
  },
  mounted() {
    requireShare();
    this.getSkillInfo()
  },
  computed: {
    ...mapState(['appid'])
  },
  methods: {
    // 添加技能
    addSkill(skill, num) {
      if (skill === '') {
        this.showToast('请填写技能')
      } else if (this.chosesKill.length >= 10) {
        this.showToast('最多添加10个技能')
      } else if (this.chosesKillArray.indexOf(skill) !== -1) {
        this.showToast('已经添加过该技能')
      } else if (this.chosesKill.indexOf(skill) === -1) {
        this.chosesKillArray.push(skill)
        this.chosesKill.push({
          skillName: skill,
          type: num || 0
        })
        this.InputSkillModel = false
      }
    },
    showToast(text, icon) {
      Toast({ message: text, icon: icon || 'none' })
    },
    // 删除技能
    delSkill(index) {
      this.chosesKill.splice(index, 1)
      this.chosesKillArray.splice(index, 1)
    },
    getSkillInfo() {
      var vm = this
      this.$get(`${vm.$global.PREFIX}/skill/query`).then(res => {
        if (res.data.root) {
          if (res.data.root !== null && res.data.root.length !== 0) {
            for (var i = 0; i < res.data.root.length; i++) {
              vm.chosesKill.push({
                skillName: res.data.root[i].skillName,
                type: res.data.root[i].skillType
              })
              vm.chosesKillArray.push(res.data.root[i].skillName)
            }
          }
        }
      })
    },
    // 保存技能
    saveSkillInfo() {
      var vm = this
      if (this.chosesKill.length == 0) {
        vm.showToast('最少填写一项技能')
        return false
      }
      this.$post(`${vm.$global.PREFIX}/skill/save`, this.chosesKill).then(res => {
        if (res.data.root) {
          vm.showToast('保存成功', 'success')
          vm.backFlag = false
          setTimeout(function () {
            vm.$router.push({ path: `/${vm.appid}/resume` });
            // vm.$router.back()
          }, 1000)
        } else {
          vm.showToast(res.data.msg)
        }
      })
    },
    showAdd() {
      this.InputSkillModel = !this.InputSkillModel
    }
  },
  beforeDestroy() {
    if (this.backFlag) {
      // this._dataStat.accessRecord('back', '军役直聘小程序-个人标签页面-退出')
    }
  }
}
</script>
<style scoped>
.person {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.baseSkill_seleted {
  padding: 40px;
  border-bottom: 4px #f4f4f4 solid;
}
.my_skill {
  font-size: 35px;
  line-height: 80px;
}
.my_skill:before {
  content: "* ";
  font-size: 30px;
  line-height: 60px;
  color: red;
}
.my_skill .num {
  display: inline;
  color: #999999;
  margin-left: 40px;
}
.baseSkill_seleted_ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.baseSkill_seleted_ul .li {
  display: inline-block;
  width: 30%;
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
  font-size: 30px;
  color: #ffffff;
  border-radius: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
  margin: 0 20px 30px 0;
  padding: 0 10px;
}
.same_style_for_ul {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.same_style_for_ul .li {
  display: inline-block;
  width: 30%;
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
  font-size: 30px;
  background-color: #f4f4f4;
  color: #333333;
  border-radius: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  margin: 0 10px 30px 0;
}
.btn_div {
  height: 80px;
  line-height: 80px;
  margin: 20px 40px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
  margin-bottom: 80px;
  font-size: 30px;
}
.all_skills {
  padding: 40px;
}
.close_skill {
  display: inline;
  line-height: 60px;
  margin-left: 20px;
}
.add_input_skill {
  width: 530px;
}
.add_input_skill .h2 {
  font-size: 30px;
  line-height: 80px;
}
.add_input_skill .input {
  width: 100%;
  font-size: 32px;
  padding: 10px;
  border: 1px #999999 solid;
}
.add_input_skill .chose_btn {
  margin-top: 20px;
  text-align: center;
  display: flex;
  justify-content: space-around;
}
.add_input_skill .chose_btn .btn {
  width: 40%;
  height: 66px;
  line-height: 66px;
  justify-content: center;
  border-radius: 10px;
  font-size: 30px;
}
.add_input_skill .chose_btn .confirm {
  color: #ffffff;
}
.van-popup {
  border-radius: 10px;
  padding: 40px;
}
.person .van-popup--center {
  transform: none;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -300px;
}
.van-toast {
  width: 300px;
  transform: none;
  margin-top: -50px;
  margin-left: -150px;
  font-size: 30px;
  line-height: 40px;
}
</style>