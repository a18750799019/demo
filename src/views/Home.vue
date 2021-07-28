<template>
<div class="ds-main-container" :data-theme="themeType">
  <div class="header">
    <div class="center">
      <img src="/imgs/logoName.png">
      <!-- <span>{{$config.sysTitle}}</span> -->
    </div>
    <div class="right">
      <ul>
        <li >
          <div @click="isRainsearchShow=!isRainsearchShow">降水查询</div>
        </li>
      </ul>
      <div class="user">
        <img src="/imgs/icon-user.png">
        <div class="ellipsis-one" :title="currUser.name">

          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link dropdownText">
              {{currUser.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  command="修改密码">修改密码</el-dropdown-item>
              <el-dropdown-item  command="退出">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- <div class="skin">
        <img src="/imgs/icon-skin.png">
        <div>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link dropdownText">
              换肤<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :class="{'is-ddl-active':item.selected}" :key="item.id" v-for="item in $config.themes" :command="item">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div> -->
      <div class="date">
        <div class="time"> {{dateObj.time}} </div>
        <div class="week"> {{dateObj.date}} {{dateObj.week}}</div>
      </div>
    </div>
  </div>  
  
  <dialog-panel
    width="941px"
    :dialogVisible="dialogReportStatisObj.state"
    :title="dialogReportStatisObj.title"
    @close="closeReportStatisObjReceive"
  >
   <div style="height:518px;padding:0 10px;">
      <form-config 
        :tableData="dialogReportStatisObj.tableData" 
        :tableConf="dialogReportStatisObj.tableConf" >
      </form-config>
    </div>
  </dialog-panel>
  <dialog-panel
    class="mockDialog"
    :dialogVisible="dialogMockObj.state"
    :title="dialogMockObj.title"
    :width="dialogMockObj.width"
    @close="closeMockObjReceive"
  >
  <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="地震发生时间:" style="height:31px">
        <el-row :gutter="5">
        <el-col :span="12" style="height:31px">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.date" style="width:100%" class="datePicker"></el-date-picker>
        </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="地震发生地点:" style="padding-top:16px;">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-select v-model="form.city" placeholder="市" @change="changeAreacode($event,'mockCity')" class="citySelect">
              <el-option
                v-for="item in form.opt_cities"
                :key="item.areacode"
                :label="item.name"
                :value="item.areacode">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="form.town" placeholder="县区" @change="changeAreacode($event,'mockTown')" class="countrySelect">
               <el-option
                v-for="item in form.opt_towns"
                :key="item.areacode"
                :label="item.name"
                :value="item.areacode">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input placeholder="请输入详细地址" v-model="form.detailAddress" class="addressDetail"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="5" style="padding-top:12px;">
          <el-col :span="8" class="longitude">
            经度&nbsp;&nbsp;<el-input oninput="value=value.replace(/[^\d.]/g,'')" style="width:calc(100% - 55px)" class="longitudeInput" placeholder="输入经度" v-model="form.lng"></el-input>
          </el-col>
          <el-col :span="8" class="latitude">
            &nbsp;&nbsp;&nbsp;纬度&nbsp;&nbsp;<el-input oninput="value=value.replace(/[^\d.]/g,'')" style="width:calc(100% - 50px)" class="latitudeInput" placeholder="输入纬度" v-model="form.lat"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button class="mapSelect" type="primary" @click="showMap()">地图选点</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="地震震源震级:" style="padding-top:8px;">
        <el-row :gutter="5">
          <el-col :span="8" class="magnitude">
            震源&nbsp;&nbsp;<el-input oninput="value=value.replace(/[^\d.]/g,'')" style="width:calc(100% - 50px)" placeholder="输入震源" v-model="form.range" class="magnitudeInput"></el-input>
          </el-col>
          <el-col :span="2" class="kilometer">
            千米
          </el-col>
          <el-col :span="8" class="focus">
            震级&nbsp;&nbsp;<el-input oninput="value=value.replace(/[^\d.]/g,'')" style="width:calc(100% - 50px)" placeholder="输入震级" v-model="form.level" class="focusInput"></el-input>
          </el-col>
          <el-col :span="2" class="level">
            级
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div style="text-align:center;margin-bottom:10px;padding-top:12px;">
      <el-button @click="mockEa()" class="mockEaBtn" style="color:#fff;width:120px;height:36px;">模拟地震</el-button>
    </div>
  </dialog-panel>

<dialog-panel
    :dialogVisible="repwsd.state"
    :title="repwsd.title"
    :width="repwsd.width"
    @close="closeRepwdObjReceive"
  >
  <el-form ref="form" :model="repwsd" label-width="100px" style="height:300px;margin:0 50px 0 0;">
      <el-form-item label="旧密码:" style="padding-top:16px;">
         <el-row>
           <el-col>
             <el-input type="password" placeholder="请输入密码" v-model="repwsd.oldpwd"></el-input>
           </el-col>
         </el-row>
      </el-form-item>
      <el-form-item label="新密码:" style="padding-top:16px;">
         <el-input type="password" placeholder="请输入密码" v-model="repwsd.newpwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" style="padding-top:16px;">
         <el-input  type="password" placeholder="请输入密码" v-model="repwsd.renewpwd"></el-input>
      </el-form-item>
      <el-form-item>
         <el-button @click="changePwd" type="primary" style="width:150px;">提交</el-button>
      </el-form-item>
    </el-form>
  </dialog-panel>

  <mapDialog @mapClickInfo="mapClickInfoReceive" @closeMapObj="closeMapObjReceive" :dialogStatisObj="{state:isshowMapChoose}"></mapDialog>
  <keep-alive>
     <router-view ref="child"></router-view>
  </keep-alive>
 
</div>
</template>
<script>
import { localStorageSetting,pwdEncrypt } from "@/util/ds.common";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import formConfig from "@/_sys_components/formConfig"
import dialogPanel from "@/_sys_components/dialog"
import statisticConf from "@/util/ds-table-config-statistic.js"
import { businessApi, userApi,  commonApi} from "@/api";
import mapDialog from "@/components/mapDialog";
export default {
  components:{dialogPanel,formConfig,mapDialog},
  data(){
    return {
      isRainsearchShow:false,
      isshowMapChoose:false,
      areacode:{
        city:[],
        town:[],
        level:[],
        cityLabel: '',
        townLabel: '',
        levelLabel: '',
      },
      repwsd:{
        state:false,
        width:"350px",
        height:"200px",
        title:"修改密码",
        oldpwd:"",
        newpwd:"",
        renewpwd:""
      },
      form:{
        date:"",
        city:"",
        town:"",
        opt_cities:[],
        opt_towns:[],
        detailAddress:"",
        lng:"",
        lat:"",
        range:"",
        level:""
        },
      selectedMenu:{},
      rightMenu: [],
      menu:[],
      themeType:"",
      currUser: {
        name: this.$config.defaultUser
      },
      
      dateObj: {
        time: "",
        date: "",
        week: ""
      },
      
      dialogReportStatisObj:{
        state:false,
        title:"",
        tableData:[],
        tableConf:statisticConf,
        dieCount: 0,
        hurtCount: 0,
        hourseCount: 0,
      },
      dialogMockObj:{
        state:false,
        title:"",
        width:"633px"
      }
    }
  },
  beforeRouteEnter(to, from, next){
    next(vm=>{
      //配置主题
      let theme = localStorageSetting("themeObj");
      if(theme){
        vm.handleCommand(theme);
      }
      let user = localStorageSetting("userCount");
      
      let userid = localStorageSetting("userid");
      if(user && user.account && userid) {
        vm.$router.push("/main"); 
      } else {
         userApi.loginOut({
          url:vm.$api.loginout
        }).then(res=>{
          vm.$router.push("/login"); 
        })
      }
      if(user.accountType==0){
        vm.rightMenu = vm.$config.mainRightMenu.filter(v=>v.isUse )
      } else {
        vm.rightMenu = vm.$config.mainRightMenu.filter(v=>(v.isUse && v.path!=="sysconf"))
      }
    })
  },
  mounted(){
    setInterval(()=>{ 
      let _now = Date.now();
      this.dateObj = {
        time: format(_now, "HH:mm:ss"),
        date: format(_now, "yyyy-MM-dd"),
        week: this.$config.weekdays[getDay(_now)-1]
      }
    }, 1000);
    this.areacode.city =this.$areacode.province[0].city;
    this.form.opt_cities = this.$areacode.province[0].city;
  },
  methods:{
    mockEa(){
      let _cityLabel="", _townLabel="";
      if(this.form.city){
         _cityLabel = this.form.opt_cities.find(_=>_.areacode==this.form.city).name
      }
      if(this.form.town){
        _townLabel = this.form.opt_towns.find(_=>_.areacode==this.form.town).name
      }
      
      if(!this.form.detailAddress.includes(_townLabel)){
        this.form.detailAddress = _townLabel+this.form.detailAddress;
      }
      if(!this.form.detailAddress.includes(_cityLabel)){
        this.form.detailAddress = _cityLabel+this.form.detailAddress;
      }
      try{
        let obj1={
        lon: this.form.lng,
        lat: this.form.lat,
        occurTime:format(this.form.date,"yyyy-MM-dd HH:mm:ss"),
        focalDepth:this.form.range,
        magnitude:this.form.level,
        address:this.form.detailAddress
      }
        commonApi.pagingPost(this.$api.mockea_one,obj1).then(res=>{
        if(res.code==200){
          this.$message.success(res.msg);
          let _liveTabs =this.$refs.child.$refs.liveTabs;
          _liveTabs.getListInfo({
            year:_liveTabs.YearsObj.curr          
          })
          this.closeMockObjReceive() 
          return
        }
        
      });
      
        this.$message.success("正在计算灾损信息，请耐心等待");
        this.closeMockObjReceive()
      }catch(err){
        this.$message.success("请输入完整信息");
      }

      // businessApi.addMockEa({
      //   url:this.$api.eaAdd,
      //   params:{
      //     lon: this.form.lng,
      //     lat: this.form.lat,
      //     quakeLevel: this.form.level,
      //     depth: this.form.range,
      //     seismicTime:format(this.form.date,"yyyy-MM-dd HH:mm:ss"),
      //     address: this.form.detailAddress
      //   }
      // }).then(()=>{
      //   this.$message.success("正在计算灾损信息，请耐心等待");
      //   this.closeMockObjReceive();
      //   let _liveTabs =this.$refs.child.$refs.liveTabs;
      //   _liveTabs.getListInfo({
      //     year:_liveTabs.YearsObj.curr
      //   })
      // })
    },
    changePwd(){
      if(this.repwsd.oldpwd =="" || this.repwsd.newpwd =="" || this.repwsd.renewpwd ==""){
        this.$message.info("密码不允许为空");
        return ;
      }
      if(this.repwsd.newpwd !== this.repwsd.renewpwd ){
        this.$message.info("两次新密码不一致");
        return ;
      }
       businessApi.changePwd({
        url: this.$api.editPassword,
        params:{
          id: localStorageSetting("userCount").id,
          oldPassword:pwdEncrypt(this.repwsd.oldpwd),
          newPassword: pwdEncrypt(this.repwsd.newpwd)
        }
      }).then(data=>{
        if(data.code ==0){
          this.$message.success("修改成功");
          this.closeRepwdObjReceive();
        }else{
          this.$message.success(data.msg);
        }
      }).catch(res=>{
        this.$message.info("服务器故障，请稍后再试");
        
      })
    },
    handleCommand(item){
      if(item == "修改密码"){
         this.repwsd.state = true;
      }
      else if (item == "退出"){
        userApi.loginOut({
          url:this.$api.loginout
        }).then(res=>{
          localStorageSetting("userid","remove");
          localStorageSetting("userCount","remove");
          this.$router.push("/login"); 
        })
      } else{
        this.$config.themes = this.$config.themes.filter(v=>{
          v.selected = v.name == item.name;
          return v;
        })
        this.themeType = item.type;
        localStorageSetting("themeObj",item);
      }
    },
    toggleRightMenu(item){
      console.log(item)
    },
    
    closeReportStatisObjReceive(){
      this.dialogReportStatisObj.state = false
    },
    closeMockObjReceive(){
      this.dialogMockObj.state = false
    },
    closeRepwdObjReceive(){
      this.repwsd.state = false;
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
    showMap(){
      this.isshowMapChoose = true;
    },
    closeMapObjReceive(){
      this.isshowMapChoose = false;
    },
    mapClickInfoReceive(data){
      this.form.detailAddress= data.address;
      this.form.lng= data.lng;
      this.form.lat= data.lat;
      for (let i = 0; i < this.form.opt_cities.length; i++) {
        const element = this.form.opt_cities[i];
        if(element.name == data.city){
          this.form.city = element.areacode;
          this.changeAreacode(element.areacode,'mockCity');
          for (let j = 0; j < this.form.opt_towns.length; j++) {
             if(this.form.opt_towns[j].name == data.town){
              this.form.town = this.form.opt_towns[j].areacode;
             }
          }
          break;
        }
      }
    }
    

    
  }
}
</script>
<style lang="scss" scoped src="./Home/home.scss"></style>



