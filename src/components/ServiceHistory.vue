<template>
  <div>
    <div class="service">
      <div class="introduce_textarea">
        <textarea class="txtarea"
                  maxlength="500"
                  v-model="description"
                  placeholder="请认真的填写个人的自我介绍,及服役经历,请描述所任职位及部队表现"></textarea>
        <div class="notes">最少20个字</div>
        <div class="word_num">{{description.length}}/500字</div>
      </div>
      <div class="save_info">
        <div class="btn default_back_color"
             @click="saveInfo">保 存</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { requireShare } from '../utils/share.js'

export default {
  components: { Toast },
  data () {
    return {
      description: '',
      backFlag: true
    }
  },
  mounted () {
    requireShare();
    this.getInfo()
    // this._dataStat.accessRecord('view', '军役直聘小程序-服役履历页面-访问')
  },
  methods: {
    // 获取自我介绍
    getInfo () {
      var vm = this
      this.$get(`${vm.$global.PREFIX}/troop/experience`).then(res => {
        if (res.data.root) {
          this.description = res.data.root[0].description
        }
      })
    },
    saveInfo () {
      var vm = this
      if (this.description == '') {
        vm.showToast('自我介绍不能为空')
      } else if (this.description.length < 20) {
        vm.showToast('最少20个字')
      } else {
        this.$post(`${vm.$global.PREFIX}/troop/experience/edit`, { description: this.description }).then(res => {
          if (res.data.root) {
            vm.showToast('保存成功', 'success')
            vm.backFlag = false
            // vm._dataStat.dataStatistic('eduInfo', '', 'save', '军役直聘小程序-服役履历页面-保存')
            setTimeout(function () {
              vm.$router.back()
            }, 1000)
          } else {
            vm.showToast(res.data.msg)
          }
        })
      }
    },
    showToast (text, icon) {
      Toast({ message: text, icon: icon || 'none' })
    }
  },
  beforeDestroy () {
    if (this.backFlag) {
      // this._dataStat.accessRecord('back', '军役直聘小程序-服役履历页面-退出')
    }
  }

}
</script>
<style>
.service {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 0 40px;
}
.us_introduce {
  margin: 40px;
}
.introduce_textarea {
  position: relative;
  width: 100%;
  padding-bottom: 80px;
  margin-top: 40px;
}
.txtarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px #7f7f7f solid;
  padding: 20px;
  min-height: 400px;
  font-size: 35px;
}
.word_num {
  position: absolute;
  bottom: 0;
  right: 0;
  line-height: 80px;
  color: #bebdbd;
  font-size: 30px;
}
.save_info .btn {
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #ffffff;
  border-radius: 10px;
  font-size: 35px;
}
.notes {
  position: absolute;
  left: 0;
  bottom: 0;
  line-height: 80px;
  color: #bebdbd;
  font-size: 30px;
}
</style>