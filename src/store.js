import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isRainsearchShow: true,
    isMessageShow: true,
    count: 0,
    token: null,
    userCity: '福建省',
    user: {
      //type: //[1:省,2：地级市,3：县区]
    },
    areacode: null,
    disasterStatistics: null, //灾情统计
    lnglatShowHide: true, //显示地图下方光标位置经纬度
    colseSubPanel: true
  },
  getters: {
    /**this.$store.getters.userToken */
    userToken() {
      return localStorage.getItem('token')
    }
  },
  mutations: {
    toggleMessageShow(state) {
      state.isMessageShow = !state.isMessageShow
    },
    toggleRainsearchShow(state) {
      state.isRainsearchShow = !state.isRainsearchShow
    },
    CHANGE_COUNT(state, num) {
      state.count = num
    },
    SETTER_TOKEN(state, token) {
      localStorage.getItem('token', token)
      state.token = token
    },
    USER_CITY(state, usercity) {
      state.userCity = usercity
    },
    USER_COUNT(state, user) {
      state.user = user
    },
    AREA_CODE(state, obj) {
      state.areacode = obj
    },
    SET_DISASTER_STATISTICS(state, obj) {
      state.disasterStatistics = obj
    },
    SET_LNGLAT_SHOWHIDE(state) {
      state.lnglatShowHide = !state.lnglatShowHide
    },
    CLOSE_SUB_PANEL(state, flag) {
      state.colseSubPanel = flag
    }
  },
  actions: {
    changeRainsearchShow({ commit }) {
      commit('toggleRainsearchShow')
    },
    /**this.$store.dispatch("changeCount",1); */
    changeCount({ commit }, count) {
      commit('CHANGE_COUNT', count)
    },
    /** 用户登录登出，设置token值 */
    userLoginOrout({ commit }, token) {
      commit('SETTER_TOKEN', token)
    },
    userCity({ commit }, usercity) {
      commit('USER_CITY', usercity)
    },
    areaCode({ commit }, obj) {
      commit('AREA_CODE', obj)
    },
    userCount({ commit }, user) {
      commit('USER_COUNT', user)
    },
    disasterStatistics({ commit }, obj) {
      commit('SET_DISASTER_STATISTICS', obj)
    },
    changeCloseSubPanel({ commit }, flag) {
      commit('CLOSE_SUB_PANEL', flag)
    }
  }
})
