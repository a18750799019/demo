<!--  -->
<template>
  <div class="liveTab">
    <div class="left">
      <div >
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
        <el-form-item label="发震时间">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="form.date"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-button type="primary"
                 @click="rainSearch(form)">查询</el-button>
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
        lon: '119.28',
        lat: '26.08',
        date: new Date()
      },
      res: '',
      dayArray: [],
      raindata: [],
      datedata: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
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
    switchBottom() {
      this.bottomCtl = !this.bottomCtl;
    },
    getDateArray (currentDate) {
      this.dayArray = []
      var ary = []
      var date = currentDate
      for (let i = 0; i <= 168; i += 24) {
        // 144是前六天的小时数
        const dateItem = new Date(date.getTime() + i * 60 * 60 * 1000) // 使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
        const y = dateItem.getFullYear() // 获取年份
        let m = dateItem.getMonth() + 1 // 获取月份js月份从0开始，需要+1
        let d = dateItem.getDate() // 获取日期

        if (Number(m) < 10) {
          m = '0' + m
        }
        if (Number(d) < 10) {
          d = '0' + d
        }
        const valueItem = y + '-' + m + '-' + d // 组合
        ary.push(valueItem) // 添加至数组
        this.dayArray.push(valueItem)
      }
    },
    async drawDrainChart (id, i) {
      this.raindata = []

      // let data = JSON.parse(this.res)
      // data = data.weather_hourly_1h[0].data
      // console.log(data)
      // for (let index = 0; index < 24; index++) {
      //   this.datedata.push('00:00')
      // }
      for (let index = i * 24; index < i * 24 + 24; index++) {
        let data = await this.res[index]
        data = await data.pre
        this.raindata.push(data)
      }
      // 以上是数据处理
      this.myChart = echarts.init(document.getElementById(id))
      this.myChart.setOption({
        title: {
          text: '小时降雨量',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: this.datedata,
          axisLabel: {
            textStyle: {
              color: '#fff',//坐标值得具体的颜色

            }
          }
        },
        yAxis: {
          type: 'value',
          name: '降水(mm)',
          nameTextStyle:{
                         color:"#fff", 
                         fontSize:12,  
                     },
          axisLabel: {
            textStyle: {
              color: '#fff',//坐标值得具体的颜色

            }
          }
        },
        series: [
          {
            data: this.raindata,
            type: 'bar',
            showBackground: true,
            itemStyle: {
              color: '#83bff6'
            },
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      })
    },
    async rainSearch () {
      this.getDateArray(this.form.date)
      // 只能获取最近15天的天气预报 时间戳没用
      // const date = Math.round(this.form.date / 1000)
      const signature = getSignature(this.form.lon, this.form.lat)
      this.res = await getRain(signature)
      //this.res = await businessApi.geteaItemDetailList('/rain')
      this.res = this.res.data.weather_hourly_1h[0].data
      this.drawDrainChart('rainEchart', 0)
      
          window.dsCesium.viewer.entities.removeById("PointFlicker1");
          window.dsCesium.viewer.entities.removeById("PointFlicker2");
      window.dsCesium.viewer.camera.flyTo({
            destination: window.dsCesium.Cesium.Cartesian3.fromDegrees(
              this.form.lon,
              this.form.lat,
              50000.0
            )
          });
      // console.log('res2', res2, date)
    }
  },
  created () { },
  mounted () {
    this.getDateArray(new Date())
    this.rainSearch()
  }
}
</script>
<style scoped>
.timeTabs {
  display: flex;
  justify-content:space-between;
}
.timeTab {
  margin-left: 25px;
}
.right {
  width: 100%;
  height: 300px;
}
.rainEchart {
  width: 80%;
  height: 225px;
  left: 1100px;
  top: 150px;
  color: chartreuse;
  margin: 0;
  padding: 0;
  list-style: none;
}
.rainEchart1 {
  height: 100%;
}
.liveTab {
  display: flex;
}
.left {
  width: 20%;
  border-right: 1px solid #D5D8DC;
}
.el-input /deep/.el-input__inner {
  height: 25px !important;
}
.el-form-item {
  margin-bottom: 0px !important;
  margin-right: 15px !important;;
}
/deep/.el-form-item__label {
  color: #fff !important;
}
.liveTab {
  background: #405780;
      width: 100%
}
/deep/.el-button--primary {
  margin-left: 25px !important;
}
  .bottomCtl{
    position: absolute;
    width: 26px;
    height: 66px;
    right: -26px;
    top:50%;
    margin-top:-33px;
    background-image: url("/imgs/leftSh2.png");
  }
  .bottomCtlSwit{
    background-image: url("/imgs/leftSh1.png");
  }
</style>
