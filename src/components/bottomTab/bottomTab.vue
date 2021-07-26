<!--  -->
<template>
  <div class="liveTab">
    <div class="left">
      <div style="width:200px">
        震中降水查询
      </div>
      <el-form :model="form">
        <el-form-item label="震中经度">
          <el-input v-model="form.lon"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="震中纬度">
          <el-input v-model="form.lat"></el-input>
        </el-form-item>
        <el-form-item label="震中经度">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="form.date"
                          style="width: 100%;"
                          value-format="timestamp"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-button @click="rainSearch(form)">查询</el-button>
    </div>
    <div class="right">
      <!--
      <el-tabs v-model="activeName"
               @tab-click="handleClick">
        <el-tab-pane v-for="item in dayArray"
                     :key="item"
                     :label="item"
                     :name="index">{{item}}
        </el-tab-pane>
      </el-tabs>
    -->
      <div class="timeTabs">
        <el-button v-for="(value, name) in dayArray"
                   :key="name"
                   v-on:click="i = name"
                   type="primary">{{ value }}</el-button>
      </div>
      <div id="rainEchart"
           class="rainEchart1"></div>
    </div>
  </div>
</template>

<script>
//import { businessApi } from "@/api";
import { getRain } from '@/api/search'
import { getSignature } from '@/util/signature'
import format from 'date-fns/format'
import echarts from 'echarts'
export default {
  name: 'bottomTab',
  components: {},
  props: {
    date: {
      default: () => {
        return format(new Date(), 'yyyy-dd-mm ')
      }
    }
  },
  data () {
    return {
      rainObj: '',
      i: 0,
      form: {
        lon: '120.0962',
        lat: '29.5617',
        date: ''
      },
      res: '',
      dayArray: ["2021-07-26 ", "2021-07-27 ", "2021-07-28 ", "2021-07-29 ", "2021-07-30 ", "2021-07-31 ", "2021-08-01 "],
      raindata: [],
      datedata: [],
      testraindata: []
    }
  },
  computed: {},
  watch: {
    i: function (val) {
      this.drawDrainChart('rainEchart', val)
    }
  },
  methods: {
    getDateArray () {
      var ary = []
      var date = new Date()
      for (let i = 0; i <= 144; i += 24) {
        // 144是前六天的小时数
        const dateItem = new Date(date.getTime() + i * 60 * 60 * 1000) // 使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
        const y = dateItem.getFullYear() // 获取年份
        const m = dateItem.getMonth() + 1 // 获取月份js月份从0开始，需要+1
        const d = dateItem.getDate() // 获取日期
        const valueItem = y + '-' + m + '-' + d // 组合
        ary.push(valueItem) // 添加至数组
        this.dayArray.push(format(valueItem, 'YYYY-MM-DD '))
      }
    },
    async drawDrainChart (id, i) {
      this.raindata = []
      this.datedata = []

      // let data = JSON.parse(this.res)
      // data = data.weather_hourly_1h[0].data
      // console.log(data)

      for (let index = i * 24; index < i * 24 + 24; index++) {
        this.datedata.push(index)
        let data = await this.res[index]
        data = await data.pre
        this.raindata.push(data)
      }
      // 以上是数据处理
      this.myChart = echarts.init(document.getElementById(id))
      this.myChart.setOption({
        xAxis: {
          type: 'category',
          data: this.datedata
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.raindata,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      })
    },
    async rainSearch () {
      // 只能获取最近15天的天气预报 时间戳没用
      // const date = Math.round(this.form.date / 1000)
      const signature = getSignature(this.form.lon, this.form.lat)
      this.res = await getRain(signature)
      debugger
      //this.res = await businessApi.geteaItemDetailList('/rain')
      this.res = this.res.data.weather_hourly_1h[0].data
      this.drawDrainChart('rainEchart', 0)
      // console.log('res2', res2, date)
    }
  },
  created () { },
  mounted () {
    this.getDateArray()
    this.rainSearch()
  }
}
</script>
<style scoped>
.timeTabs {
  display: flex;
}
.timeTab {
  margin-left: 25px;
}
.right {
  width: 1000px;
  height: 300px;
}
.rainEchart {
  width: 80%;
  height: 300px;
  left: 1100px;
  top: 150px;
  color: chartreuse;
  margin: 0;
  padding: 0;
  list-style: none;
}
.rainEchart1 {
  width: 80%;
  height: 300px;
}
.liveTab {
  display: flex;
}
.left {
  width: 200px;
}
.el-input /deep/.el-input__inner {
  height: 25px !important;
}
.el-form-item {
  margin-bottom: 0px !important;
}
</style>
