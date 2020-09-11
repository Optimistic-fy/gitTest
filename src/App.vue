<template>
  <div id="app" :style="{ height: bodyHeight + 'px', overflow: 'auto' }">
    <!-- keep-alive用于缓存  exclude用于取消缓存-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <TabBar v-show="$route.meta.showTabbar" />
  </div>
</template>


<script>
// import { requireShare } from './utils/share'
import TabBar from './common/TabBar'
import { getAppid } from '@/utils/public'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    TabBar
  },
  data() {
    return {
      bodyHeight: ''
    }
  },
  created() {
    let url = window.location.href
    this.$store.state.appid = getAppid(url)
    this.addLink(url)
    this.getAppidInfo();
    this.$store.dispatch('getModuleStatus');
  },
  mounted() {
    // let url = window.location.href;
    // requireShare(url)
    this.bodyHeight = document.documentElement.clientHeight
  },
  computed: {
    ...mapState(['appid', 'stylePath'])
  },
  methods: {
    ...mapActions(['getAppidInfo']),
    addLink(url) {
      var link = document.createElement('link');
      link.setAttribute('type', 'text/css');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', `${this.stylePath}${this.appid}/css/unifyColor.css?time=${new Date().getTime()}`);
      document.head.appendChild(link);
    }
  }
}
</script>

<style scoped>
#app {
  color: #000;
}
body {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>