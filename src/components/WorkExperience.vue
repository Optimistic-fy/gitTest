<template>
  <div>
    <div class="info_form">
      <div class="block">
        <div class="label mustfill">公司名称</div>
        <div class="input"><input type="text"
                 v-model="experience.companyName"
                 placeholder="请填写" /></div>
      </div>

      <div class="block">
        <div class="label mustfill">职位名称</div>
        <div class="input"><input type="text"
                 v-model="experience.positionText"
                 placeholder="请填写"></div>
      </div>

      <div class="block">
        <div class="label mustfill">在职时间</div>
        <div class="input">
          <div class="input_box_r">
            <div class="input_time"
                 mode="date"
                 fields="month"
                 @click="pickTimeChoose('startTime')">
              <div v-if="experience.startTime"
                   class="uni-input">{{experience.startTime}}</div>
              <div v-else
                   class="uni-input"
                   :style="{color: experience.startTime ? '' : '#888888'} ">开始时间</div>
            </div>
            <span class="txt">至</span>
            <div class="input_time"
                 mode="date"
                 fields="month"
                 @click="pickTimeChoose('endTime')">
              <div v-if="experience.endTime"
                   class="uni-input">{{experience.endTime}}</div>
              <div v-else
                   class="uni-input"
                   :style="{color: experience.endTime ? '' : '#888888'} ">结束时间</div>
            </div>
          </div>
        </div>
      </div>

      <div class="introduce_textarea">
        <div class="label">描述</div>
        <textarea class="txtarea"
                  maxlength="200"
                  v-model="experience.workDescription"
                  placeholder="描述你的工作职责、项目和业绩等"></textarea>
        <div class="word_num">{{experience.workDescription.length}}/200字</div>
      </div>

      <div class="save_info">
        <div class="btn default_back_color"
             @click="saveInfo">保 存</div>
      </div>
    </div>
    <!-- 时间选择pick -->
    <van-popup v-model="showselectTime"
               position="bottom"
               :style="{ height: '40%' }">
      <van-datetime-picker v-model="currentDate"
                           type="year-month"
                           @cancel="onCancel"
                           @confirm="onConfirm"
                           :min-date="minDate"
                           :max-date="maxDate" />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { formatTime } from '../utils/index'
import { requireShare } from '../utils/share.js'

export default {
  components: { Toast },
  data () {
    return {
      experience: {
        companyName: '',
        positionText: '',
        startTime: '',
        endTime: '',
        workDescription: ''
      },
      backFlag: true,
      currentDate: new Date(),
      showselectTime: false,
      timeType: '',
      minDate: new Date(1965, 0, 1),
      maxDate: new Date(2125, 10, 1)
    }
  },
  mounted () {
    requireShare();
    this.getInfo()
    // this._dataStat.accessRecord('view', '军役直聘小程序-工作经历页面-访问')
  },
  methods: {
    // 时间选择
    pickTimeChoose (timeType) {
      this.showselectTime = true
      this.timeType = timeType
    },
    // picker点击取消
    onCancel () {
      this.showselectTime = false

    },
    // picker点击确定
    onConfirm (val) {
      this.showselectTime = false
      let time = formatTime(this.currentDate, 'line')
      if (this.timeType === 'startTime') {
        this.experience.startTime = time.slice(0, 7)
      } else if (this.timeType === 'endTime') {
        this.experience.endTime = time.slice(0, 7)
      }
    },
    startTimeChange (res) {
      let data = res.detail.value
      let index = res.target.dataset.index
      this.experience.startTime = data
    },
    endTimeChange (res) {
      let data = res.detail.value
      let index = res.target.dataset.index
      this.experience.endTime = data
    },
    getInfo () {
      let vm = this
      vm.$get(`${vm.$global.PREFIX}/work/info`).then(res => {
        if (res.data.root) {
          vm.experience = res.data.root
        }
      }).catch(err => {
        console.log(err)
      })
    },
    saveInfo () {
      let vm = this
      let experience = Object.assign({}, this.experience)
      experience.startTime = experience.startTime.split('').length == 7 ? experience.startTime + '-00' : experience.startTime
      experience.endTime = experience.endTime.split('').length == 7 ? experience.endTime + '-00' : experience.endTime,

        this.$post(`${vm.$global.PREFIX}/work/save`, experience).then(res => {
          if (res.data.root) {
            vm.showToast('保存成功', 'success')
            vm.backFlag = false
            // vm._dataStat.dataStatistic('experience', '', 'save', '军役直聘小程序-工作经历页面-保存')
            setTimeout(function () {
              vm.$router.back()
            }, 1000)
          } else {
            vm.showToast(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    showToast (text, icon) {
      Toast({ message: text, icon: icon || 'none' })
    }
  },
  beforeDestroy () {
    if (this.backFlag) {
      // this._dataStat.accessRecord('back', '军役直聘小程序-工作经历页面-退出')
    }
  }
}
</script>

<style>
.info_form {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 30px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.info_form .block {
  padding: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
  position: relative;
}
.info_form .label {
  font-size: 32px;
  padding-left: 18px;
}
.info_form .mustfill:after {
  content: "*";
  position: absolute;
  left: 0;
  font-size: 40px;
  color: #ed4f4c;
}
.info_form .input,
.info_form input {
  text-align: right;
  font-size: 32px;
}
.input label {
  margin-left: 30px;
}
.input_box_r {
  display: flex;
}
.input_time {
  padding-left: 40px;
}
.txt {
  padding-left: 40px;
  text-align: center;
}
.save_info {
  padding: 0 40px;
}
.save_info .btn {
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #ffffff;
  border-radius: 10px;
  font-size: 35px;
}
.introduce_textarea {
  position: relative;
  /* padding: 0px 40px; */
  padding-bottom: 80px;
}
.introduce_textarea .label {
  line-height: 80px;
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
  padding: 0 40px;
}
</style>