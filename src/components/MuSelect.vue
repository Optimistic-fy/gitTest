<template>
  <div class="mu_select">
    <div class="block"
         v-for="(item,index) in value"
         v-bind:key="index"
         @click="changeChecked(index)">
      <label class="label">{{item.label}}</label>
      <icon class="icon"
            name="checked"
            type="success"
            size="20"
            :class="item.disabled ? 'default_color' : 'not_check'" />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { requireShare } from '../utils/share.js'

export default {
  name: 'MuSelect',
  components: {
    Icon
  },
  data () {
    return {
      valueData: ''
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  mounted () {
    requireShare();
    this.valueData = this.value
  },
  methods: {
    // 点击的时候触发
    changeChecked (index) {
      if (index === 0) {
        this.valueData[index].disabled = true
        for (let i = 1; i < this.valueData.length; i++) {
          this.valueData[i].disabled = false
        }
      } else {
        this.valueData[0].disabled = false
        this.valueData[index].disabled = !this.valueData[index].disabled
      }
      this.$emit('input', this.valueData)
    }
  },
}
</script>

<style scoped>
.mu_select .block {
  height: 80px;
  line-height: 80px;
  margin: 0 20px;
  border-bottom: 1px #eeeeee solid;
}
.mu_select .block .label {
  float: left;
  font-size: 28px;
}
.mu_select .block .icon {
  float: right;
  display: block;
  width: 40px;
  height: 40px;
  margin-top: 20px;
}
.not_check {
  color: #b2b2b2;
}
</style>