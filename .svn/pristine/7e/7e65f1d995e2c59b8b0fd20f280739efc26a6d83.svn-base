import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router'
import store from './store';
import isdev from "@/util/ds.is-dev";
import { loadInitConf } from "@/util/ds.common";
import 'nprogress/nprogress.css'
// import "@/util/ds.cesium.popup.scss";
import 'animate.css' 

Vue.config.productionTip = false
window.Vue = Vue;

Vue.use(ElementUI);

Promise.all([loadInitConf("init"), loadInitConf("api"), loadInitConf("areacode")]).then(value => {
  Vue.prototype.$config = value[0];
  Vue.prototype.$areacode = value[2];
  const status = isdev ? "debug" : "release";
  let apiData = value[1];
  Object.keys(apiData).forEach(item => {
    apiData[item] = apiData[item][status]
      ? apiData[item][status]
      : apiData[item];
  });
  Vue.prototype.$api = apiData;
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});
