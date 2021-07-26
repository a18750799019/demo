<!--灾情统计-->
<template>
  <dialog-panel
    width="960px"
    :dialogVisible="dialogStatisObj.state"
    :title="dialogStatisObj.title"
    @close="closeStatisObjReceive"
  >
   <div style="height:518px;padding:0 10px;">
      <form-config v-if="dialogStatisObj.tableConf" :tableConf="dialogStatisObj.tableConf" >
        <div slot="search_after">
          所属市： 
          <el-select class="diaStaDDL" clearable v-model="areacode.cityLabel" @change="changeAreacode($event,'city')" placeholder="请选择">
            <el-option
              v-for="item in areacode.city"
              :key="item.areacode"
              :label="item.name"
              :value="item.areacode">
            </el-option>
          </el-select>
          &nbsp;&nbsp;&nbsp;所属县： 
          <el-select class="diaStaDDL" clearable v-model="areacode.townLabel" @change="changeAreacode($event,'town')" placeholder="请选择">
            <el-option
              v-for="item in areacode.town"
              :key="item.areacode"
              :label="item.name"
              :value="item.areacode">
            </el-option>
          </el-select>
          &nbsp;&nbsp;&nbsp;烈度下限： 
          <el-select class="diaStaDDL" v-model="areacode.levelLabel" @change="changeAreacode($event,'level')" placeholder="请选择">
            <el-option
              v-for="item in areacode.level"
              :key="item.value"
              :label="item.key"
              :value="item.value">
            </el-option>
          </el-select>
          &nbsp;&nbsp;&nbsp;<el-button @click="loadStatis(null)" class="statisSearch" style="width:90px;" type="primary" size="mini">查询</el-button>
        </div>
      </form-config>
    </div>
    <div class="diaFooter padding-bottom-10 margin-left-10 padding-top-20">
      本次地震统计数据由灾情损失评估算法计算所得，死亡人数约：{{dialogStatisObj.dieCount}}人，受伤人数约：{{dialogStatisObj.hurtCount}}人， 房屋倒塌约：{{dialogStatisObj.hourseCount}}平方米
    </div>
  </dialog-panel>
</template>
<script>
import formConfig from "@/_sys_components/formConfig"
import dialogPanel from "@/_sys_components/dialog"
import { commonApi } from "@/api";
export default {
  components:{dialogPanel,formConfig},
  data(){
    return {
      areacode:{
        city: this.$areacode.province[0].city,
        town:[],
        level:this.$config.intensityScale,
        cityLabel: '',
        townLabel: '',
        levelLabel: '6',
      },
      curItem:null,
      dialogStatisObj:{
        state:true,
        title:"灾情统计",
        tableData:[],
        tableConf:null,
        dieCount: 0,
        hurtCount: 0,
        hourseCount: 0,
      },
    }
  },
  mounted(){
    // this.loadStatis();
  },
  methods:{
    
    closeStatisObjReceive(){
      // this.dialogStatisObj.state = false
      this.$emit("close");
    },
    loadStatis(item){
      item = item ? item : this.curItem;
      let disEa = item || this.$store.state.disasterStatistics||{};
      this.curItem = item;
      commonApi.pagingPost4Res(this.$api.zsTotal,{
        obsTime: disEa.obsTime||"1604332650975",
        intensity: this.areacode.levelLabel,
        regionId:this.areacode.townLabel!=''?this.areacode.townLabel:this.areacode.cityLabel.replace(/0+$/g,""),
        regionLv:this.areacode.townLabel!=''?2: this.areacode.cityLabel!=''?1:0
      }).then(data=>{
        this.dialogStatisObj.dieCount = data.objects.ha02
        this.dialogStatisObj.hurtCount = data.objects.ha03
        this.dialogStatisObj.hourseCount = data.objects.ha04
      }).catch(()=>{
        // this.$message("请求出错，请稍后再试");
        //  this.dialogStatisObj.state = false;
      })
      let _data = require("@/util/ds-table-config-statistic.js").default;
      _data.postData = {
        rows:10,
        page:1,
        obsTime:disEa.obsTime||"1604332650975",
        intensity: this.areacode.levelLabel,
        regionId:this.areacode.townLabel!=''?this.areacode.townLabel:this.areacode.cityLabel.replace(/0+$/g,""),
        regionLv:this.areacode.townLabel!=''?2: this.areacode.cityLabel!=''?1:0
      }
      _data.url = this.$api.zsMethod;
      this.dialogStatisObj.tableConf =  _data;
      // commonApi.pagingPost4Res(this.$api.zsMethod,).then(data=>{
      //   this.dialogStatisObj.tableData = data.rows;
      //   this.dialogStatisObj.tableConf.total = data.records;
      // }).catch(()=>{
      //   this.$message("请求出错，请稍后再试");
      //   this.dialogStatisObj.state = false;
      // })
    },
    changeAreacode(value, type){
      switch (type) {
        case "city":
          this.areacode.townLabel ="";
          for(let i=0;i<this.areacode.city.length;i++){
              if(this.areacode.city[i].areacode==this.areacode.cityLabel){
                  this.areacode.town= this.areacode.city[i].county;
                  return;
              }
            }
          break;
          case "mockCity":
            this.form.town ="";
            for(let i=0;i<this.form.opt_cities.length;i++){
                if(this.form.opt_cities[i].areacode==this.form.city){
                    this.form.opt_towns= this.form.opt_cities[i].county;
                    return;
                }
              }
          break;
      }
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .__sysFrom{
  padding:0;
}
</style>
