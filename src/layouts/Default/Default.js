import { localStorageSetting } from "@/util/ds.common";
export default {
  data(){
    return {
      lastTime: null, // 最后一次点击的时间
      currentTime: null, // 当前点击的时间
      timeOut: this.$config.timeOut * 60 * 1000 // 设置超时时间:30分钟
    }
  },
  beforeRouteEnter(to, from, next){
    next(vm=>{
      vm.lastTime = new Date().getTime()
    })
  },
  methods: {
    isTimeOut(){
      if(!this.$config.isUseTimeOut){return;}
      this.currentTime = new Date().getTime() // 记录这次点击的时间
      if (this.currentTime - this.lastTime > this.timeOut) { // 判断上次最后一次点击的时间和这次点击的时间间隔是否大于30分钟
        if (localStorageSetting("userid")) { // 如果是登录状态
          localStorageSetting("userid", "remove")
          this.$router.push({name: 'login'})
        } else {
          this.lastTime = new Date().getTime()
        }
      } else {
        this.lastTime = new Date().getTime() // 如果在30分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
      }
    }
  },
};
