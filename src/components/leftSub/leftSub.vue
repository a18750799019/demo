<template>
  <div class="leftSubPanel" v-if="isshow">
    <template v-if="type =='liveMode'">
      <img class="close cursor-pointer" style="position:absolute;right:5px;top:5px;z-index:999" @click="closeFun" src="/imgs/icon-close.png">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="title" name="first">
          
        </el-tab-pane> 
        <el-tab-pane label="灾损" name="second" style="padding:0">
           <el-form ref="form" label-width="20px" class="margin-top-10">
            <el-form-item v-for="(item,i) in mapCasualtyLossLayer" :key="i">
            <label class="funSubItem">
              <el-checkbox @change="toggleZs($event, item)"  v-model="item.checked"></el-checkbox>
              <el-image class="funSUbImgs" :src="item.url"></el-image>
              <span>{{item.name}}</span>
            </label>
            </el-form-item>
          </el-form>
        </el-tab-pane> 
      </el-tabs>

    </template>
    <template v-if="type =='addressMode'">
      <div class="head">
        <span class="title">{{title}}</span>
        <img class="close cursor-pointer" @click="closeFun" src="/imgs/icon-close.png">
      </div>
    </template>
    <div v-if="type=='liveMode' && activeName=='first'" style="height:100%;">
      <div class="location">
        <div class="left inline-block"><img src="/imgs/icon-curr.png" alt=""></div>
        <div class="right inline-block">
          <div>当前地震现场采集自{{location}}</div>
          <div class="margin-top-10">{{time}} {{level?","+level+"M地震":""}}</div>
        </div>
        <div style="display:flex;justify-content: space-evenly;margin-top:10px;    flex-wrap: wrap;">
          <el-button size="mini" @click="distribute('intensity')" :disabled="liveDetailsInner.length==0" class="font-size-12 padding-vertical-5 cursor-pointer">上报震感分布</el-button>
          <el-button size="mini" @click="distribute('casualties')" :disabled="liveDetailsInner.length==0" class="font-size-12 padding-vertical-5 cursor-pointer">上报伤亡分布</el-button>
          <el-button size="mini" @click="distribute('damage')" :disabled="liveDetailsInner.length==0" class="font-size-12 padding-vertical-5 cursor-pointer" style="margin-top:10px;margin-left:0">上报建筑物损失分布</el-button>
        </div>
      </div>
      <div class="detailPanel">
        <div class="liveDetail" v-for="item in liveDetailsInner">
          <div class="headtabs">
            <div class="headItem" :class="{'on':item.selectedItem == 1}" @click="item.selectedItem=1">上报详情</div>
            <div class="headItem centerItem" :class="{'on':item.selectedItem == 2}" @click="item.selectedItem=2">现场图片</div>
            <div class="headItem" :class="{'on':item.selectedItem == 3}" @click="item.selectedItem=3">现场视频</div>
          </div>
                    
          <div v-if="item.selectedItem == 1" class="smallSubPanel">
            <table>
              <tr>
                <td style="line-height:19px;">上报者:{{item.user ?item.user.name:"-"}}<span class="color-red">[{{item.state||"离线"}}]</span></td>
                <td>
                  <span class="btnPhone" @click="callPhone(item.user ?item.user.account:item.reportUserPhone,item.user ?item.user.contact:item.reportUserPhone)"><img src="/imgs/icon-phone.png">电话</span>
                  <span v-if="false" class="btnMessage" @click="sendMesg(item)"><img src="/imgs/icon-message.png">消息</span>
                </td>
              </tr>
              <tr>
                <td colspan="2">发震时刻:{{item.reportTime}}</td>
              </tr>
              <tr>
                <td>纬度:{{item.lat?Number.parseFloat(item.lat).toFixed(2)+"度":"-"}}</td>
                <td>经度:{{item.lon? Number.parseFloat(item.lon).toFixed(2)+"度":"-"}}</td>
              </tr>
              <tr>
                <td>深度:{{item.quakes?item.quakes.depth:"-"}}</td>
                <td>震级:{{item.quakes?item.quakes.quakeLevel:"-"}}级</td>
              </tr>
              <tr>
                <td colspan="2">参考位置:{{item.reportAddress}}</td>
              </tr>
            </table>
          </div>
          <div class="smallSubPanel2" v-if="item.selectedItem == 2">
            <el-image
              style="width: 100%; height: 100%; border-radius:4px"
              :src="item.src"
              :preview-src-list="item.srcList"
              fit="cover">
            </el-image>
          </div>
          <div class="smallSubPanel3" v-if="item.selectedItem == 3">
            <video controls style="width:100%; height:100%;" :src="item.videoSrc"></video>
          </div>
        </div>
      </div>
    </div>
    <div class="addressModePanel" v-if="type =='addressMode'">
      <div v-for="item in searchResult" @click="setCenter(item)" class="searchResult">
        <div class="resLeftIcon">
          <!-- <img src="/imgs/icon-location1.png"> -->
          {{item.index}}
        </div>
        <div class="resRightContent">
          <div class="resName">{{item.name}}</div>
          <div>{{`距离选中位置约${getGreatCircleDistance(item.lat,item.lng,centerLat,centerLng)}公里`}}</div>
          <div>{{`所处生命线:${item.type}`}}</div>
        </div>
      </div>
      <div v-if="searchResult.length%10==0" class="moreLiveLine" @click="showMoveLiveLine">更多</div>
    </div>
    <div class="legend" v-if="casualtyItem" style="position: fixed;bottom: 161px;right: 230px;white-space: nowrap;">
      <iframe :src="casualtyItem.legendurl" style="background:#fff;width:220px;height:200px;"   frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
import { businessApi } from "@/api";
export default {
  props:{
    type:{
      default:()=>{ return "liveMode"}  //liveMode  address 
    },
    title:{
      default: ()=>{return "地震现场"}
    },
    location:{
      default:""
    },
    time:{
      default:()=>{return "";}
    },
    level:{
      default:()=>{return "";}
    },
    liveDetails:{
      default: ()=>{ return [{selectedItem:1},{selectedItem:2},{selectedItem:1}];}
    },
    close: {
      default:()=>{return false;}
    },
    searchResult:{
       default:()=>{return [];}
    },
    centerLng:{
      default:()=>{return ''}
    },
    centerLat:{
      default:()=>{return ''}
    },
  },
  data(){
    return{
      activeName:"first",
      mapCasualtyLossLayer:this.$config.czaisun.children, //灾损
      liveDetailsInner:this.liveDetails.slice(),
      isshow: !this.close,
      casualtyItem:null,
      colseSubPanel:true,
    }
  },
  watch:{
     '$store.state.colseSubPanel'(val){ 
      this.colseSubPanel=val;
    },
    isshow(val){
      if(!val){
         //移除灾损
        this.mapCasualtyLossLayer = this.mapCasualtyLossLayer.filter(v=>{
          v.checked = false;
          window.dsCesium.viewer.removeIgyLayer({
            layerName:v.layerName
          }); 
          return v;
        });
        this.casualtyItem = null;
      }
    },
    liveDetails(val){
      this.liveDetailsInner = val.slice();
    },
    searchResult(val){
      if(window.dsCesium.viewer){
          window.dsCesium.viewer.removeEntityLayer({
            layerName:"addresSearch"
          });
          window.dsCesium.viewer.addEntityLayer({
            layerName:"addresSearch",
            list: val,
            viewer: window.dsCesium.viewer,
            billboard: true
          })
        }
    },
    close(val){
      if(window.dsCesium.viewer){
        window.dsCesium.viewer.removeEntityLayer({
          layerName:"addresSearch"
        });
      }
      this.isshow = !val
    }
  },
  methods:{
    
  getGreatCircleDistance(lat1,lng1,lat2,lng2){
    var EARTH_RADIUS = 6378137.0;    //单位M
    var PI = Math.PI;
    function getRad(d){
        return d*PI/180.0;
    }
    function kmUnit(m){
        var v;
        if(typeof m === 'number' && !isNaN(m)){
             v = (m / 1000).toFixed(2)
        }
        return v;
    }
     /**
    * caculate the great circle distance
    * @param {Object} lat1
    * @param {Object} lng1
    * @param {Object} lat2
    * @param {Object} lng2
    */
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);
    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);
    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*EARTH_RADIUS;
    s = Math.round(s*10000)/10000.0;
    //console.log(s)
    return kmUnit(s);
    },

    toggleZs(value, item){
      if(item.checked && item.layerName !== ""){
        
        this.casualtyItem = item;
        this.mapCasualtyLossLayer = this.mapCasualtyLossLayer.filter(v=>{
          v.checked = v.name==item.name;
          window.dsCesium.viewer.removeIgyLayer({
            layerName:v.layerName
          });
          return v;
        });

        let _selEa = this.$store.state.disasterStatistics;
        window.dsCesium.viewer.addIgyLayer4Provider({
          provider: new Cesium.WebMapServiceImageryProvider({
            url: this.$config.geoServerUrl1,
            layers:item.haNo + _selEa.obsTime||"1604332650975",
            parameters: {
                service: 'WMS',
                format: 'image/png',
                transparent: true
            }
          }),
          layerName: item.layerName
        })
      }else{
        this.casualtyItem = null;
        window.dsCesium.viewer.removeIgyLayer({
          layerName:item.layerName
        });
      }
     
    },
    showMoveLiveLine(){
      this.$emit("showMoveLiveLine");
    },
    distribute(type){
      let myIcon = {
        "0": "imgs/legend/无.png",
        "1": "imgs/legend/有.png",
        "Ⅰ": "imgs/legend/绿.png",
        "Ⅱ": "imgs/legend/绿.png",
        "Ⅲ": "imgs/legend/绿.png",
        "Ⅳ": "imgs/legend/黄.png",
        "Ⅴ": "imgs/legend/黄.png",
        "Ⅵ": "imgs/legend/黄.png",
        "Ⅶ": "imgs/legend/橙.png",
        "Ⅷ": "imgs/legend/橙.png",
        "Ⅸ": "imgs/legend/橙.png",
        "X": "imgs/legend/红.png",
        "Ⅺ": "imgs/legend/红.png",
        "Ⅻ": "imgs/legend/红.png",
      } 

      switch(type){
        case "intensity":
          let list=[]
          break;

        case "casualties":
          break;

        case "damage":
          break;
      }
      //debugger
       this.liveDetailsInner = this.liveDetailsInner.filter((_,index)=>{
          _.index = ['0','1'].includes(_[type])? _[type]=="1"?"有":"无" : _[type];
          _.url= myIcon[_[type]]|| myIcon["0"];
          _.iconWidth = 20;
          _.iconHeight = 20;
          _.pixelOffset = [-13,17];
          return _;
        });
      //this.liveDetailsInner
      //地震现场，三个按钮
      if(window.dsCesium.viewer){
        window.dsCesium.viewer.removeEntityLayer({
            layerName:"dzxc"
          });
        window.dsCesium.viewer.addEntityLayer({
          layerName:"dzxc",
          list: this.liveDetailsInner,
          viewer: window.dsCesium.viewer,
          billboard: true
        })
      }
       
    },
    callPhone(account,phone){
      this.$message("正在连接同账号手机，请稍后")
      businessApi.callphone({
        url:this.$api.callphone,
        params:{
          account:account,
          content:phone
        }
      })
    },
    sendMesg(item){
      this.$prompt('请输需要发送的消息','', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '发送成功'
        });
      });
    },
    closeFun(){
        this.isshow = false; 
        this.$emit("closeIshow", this.isshow);
    },
    setCenter(item){
      if(window.dsCesium.viewer){
        window.dsCesium.viewer.camera.flyTo({
            destination : window.dsCesium.Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 8000.0)
          });
      }
    }
  }
}
</script>
<style lang="scss" scoped src="./leftSub.scss"></style>
