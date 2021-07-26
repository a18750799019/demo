<template>
  <div class="rightFunction" :class="{'toggleRightFunction':toggleRightFunction}">
    <div  id="toolTip" style="display:none;position:absolute;height:20px;width:127px;background: olive;top:0px;left:0px">
   </div>
    <div class="eyesPanel inline-block">
      <div class="funItem funItemCollapse" @click="toggleRightFunction=!toggleRightFunction"><img src="/imgs/icon-collapse.png"></div>
      <div class="funItem" 
        v-for="(item, i) in eyesList" 
        :class="{'funOn':item == selectedItem}"
        @click="toggleMenu(item)"
        :key="i">
        <div class="funname">{{item.name}}</div>
      </div>
    </div>
    <div class="funsPanel inline-block">
      <!-- 生命工程专题 -->
      <el-form ref="form" v-if="selectedItem.type =='smgczt'" label-width="20px">
        <el-form-item v-for="(item,i) in lifeProj" :key="i">
         <label class="funSubItem">
           <el-checkbox @change="toggleDzysf($event, item)"  v-model="item.select"></el-checkbox>
           <el-image class="funSUbImgs" :src="item.url"></el-image>
           <span>{{item.name}}</span>
         </label>
        </el-form-item>
      </el-form>
      <div class="mapType" v-if="selectedItem.type =='tool'">
        <div  @click="toggleMap(subItem.type)" :key="i"  v-for="(subItem,i) in eyesList[0].mapChildren">
          <img :src="subItem.icon"><span :class="{'on': mapSourceName==subItem.type}">{{subItem.name}}</span>
        </div>
  
        <el-form label-width="10px">
          <el-form-item label="">
            <el-checkbox v-model="mapNameLayer" style="font-weight:bold" label="地名" name="type"></el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div class="toolType" v-if="selectedItem.type =='tool'">
        <div @click="toggleTool(item)" :key="i" v-for="(item,i) in mapTools"><div class="toolImgDiv"><img :src="item.icon"></div><span>{{item.title}}</span></div>
      </div>
      <div class="dzysfType" v-if="selectedItem.type =='dzysf'">
        <div  :key="i" v-for="(item, i) in mapLayers">
          <div class="dzysfTitle">{{item.name}}</div>
          <div class="dzysfItem" :key="subItem.name" v-for="subItem in item.subs">
             <el-checkbox @change="toggleDzysf($event, subItem)" v-model="subItem.select">{{subItem.name}}</el-checkbox>
             
          </div>
        </div>
      </div>
      <el-form ref="form" v-if="selectedItem.type =='zs'" label-width="20px">
        <el-form-item v-for="(item,i) in mapCasualtyLossLayer" :key="i">
         <label class="funSubItem">
           <el-checkbox @change="toggleZs($event, item)"  v-model="item.checked"></el-checkbox>
           <el-image class="funSUbImgs" :src="item.url"></el-image>
           <span>{{item.name}}</span>
         </label>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="legend" v-if="casualtyItem" :style="`bottom:${colseSubPanel?'-6px':'40px'}`" style="position: absolute;bottom: -6px;right: 233px;white-space: nowrap;">
      <iframe :src="casualtyItem.legendurl" style="background:#fff;width:220px;height:200px;"   frameborder="0"></iframe>
    </div> -->
  </div>
</template>
<script>
export default {
  props:{
    collapse:{
      default:()=>{return false}
    }
  },
  data(){
    return {
      mapSourceName:"3w",
      toggleRightFunction:false,
      eyesList: this.$config.eyesList,
      lifeProj: this.$config.lifeProjSubject,
      selectedItem:{},
      mapNameLayer: false,
      mapTools:[],
      mapLayers:[],
      casualtyItem:null,
      mapCasualtyLossLayer:[], //灾损
      colseSubPanel:true,
    }
  },
  mounted(){
    this.toggleMenu(this.eyesList[0]);
    let v = setInterval(()=>{
      let map = window.dsCesium.viewer;
      if(map){
        clearInterval(v);
        this.mapNameLayer = true;
      }
    },300)
  },
  watch:{
    '$store.state.colseSubPanel'(val){ 
      this.colseSubPanel=val;
    },
    collapse(val){
      this.toggleRightFunction = val;
    },
    mapNameLayer(val){
      let map = window.dsCesium.viewer;
      if(val){
        map.addIgyLayer4Provider({provider:map.tdtCia(), layerName:"tdtCia"});//注记图
      }else {
        map.removeIgyLayer({
          layerName: "tdtCia"
        })
      }
    }
  },
  methods:{
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
    toggleMap(type){
      //debugger
      let map = window.dsCesium.viewer; 
      if(this.mapSourceName == type){
        map.toggleMapMode({type:2});
        this.mapSourceName = "2w"
        return;
      }
      this.mapSourceName = type;
      map.removeIgyLayer({
          layerName: "fujian"
        })
      switch(type){
        case "3w":
          map.toggleMapMode({type:3});
        break;
        case "sl":
          map.addIgyLayer4Provider({ provider: map.tdtVec(), layerName:"tdtVec" }); 
          if(this.mapNameLayer){
            this.mapNameLayer = false;
          }
        break;
        case "yx":
          map.addIgyLayer4Provider({ provider: map.tdtImg(), layerName:"tdtImg" });
          if(this.mapNameLayer){
            this.mapNameLayer = false;
          }
        break;
      }
      map.addIgyLayer4Provider({
          provider: new Cesium.WebMapServiceImageryProvider({
            url: this.$config.geoFujianUrl,
            layers: "fujian",
            parameters: {
                service: 'WMS',
                format: 'image/png',
                transparent: true
            }
          }),
          layerName: "fujian"
        })
    },
    toggleMenu(item){
      this.selectedItem = item;
      this.eyesList = this.eyesList.filter(v=>{
        v.selected = v.name == item.name;
        return v;
      })
      if(item.type =="tool" && this.mapTools.length==0){
        this.mapTools = item.children;
      }

      if(item.type=="dzysf" && this.mapLayers.length==0){
        this.mapLayers = item.children;
      }
      if(item.type=="zs" && this.mapCasualtyLossLayer.length==0){
        this.mapCasualtyLossLayer = item.children;
      }
    },
    //切换工具
    toggleTool(item){
      //debug地图工具
      //debugger
      let Cesium = window.dsCesium.Cesium;
      let _height = window.dsCesium.viewer.getCeisumHeight({viewer:window.dsCesium.viewer});
      switch (item.type) {
        case "fd":
          window.dsCesium.viewer.camera.moveForward(_height/10)
          break;
       case "sx":
          window.dsCesium.viewer.camera.moveBackward(_height/10)
        break;
        case "py":
          //每次向左平移0.001
          window.dsCesium.viewer.camera.rotateLeft(Cesium.Math.toDegrees(0.001).toFixed(2));
        break;
        case "zb":
          // window.dsCesium.viewer.camera.heading = 0;
          window.dsCesium.viewer.camera.setView({
            destination: dsCesium.viewer.camera.position,
            orientation: {
                heading : 0, 
                pitch : dsCesium.viewer.camera.pitch,    
                roll : dsCesium.viewer.camera.roll,
            }
          })
        break;
        case "tz":
          let scene = window.dsCesium.viewer.scene;
          if(scene.screenSpaceCameraController.enableRotate) {
            scene.screenSpaceCameraController.enableRotate = false;
            scene.screenSpaceCameraController.enableTranslate = false;
            scene.screenSpaceCameraController.enableZoom = false;
            scene.screenSpaceCameraController.enableTilt = false;
            scene.screenSpaceCameraController.enableLook = false;
          } else{
            scene.screenSpaceCameraController.enableRotate = true;
            scene.screenSpaceCameraController.enableTranslate = true;
            scene.screenSpaceCameraController.enableZoom = true;
            scene.screenSpaceCameraController.enableTilt = true;
            scene.screenSpaceCameraController.enableLook = true;
          }
        break;
        case "cljl":
          window.dsCesium.viewer.measureDistance(window.dsCesium.viewer);
        break;
        case "clgd":
          window.dsCesium.viewer.measureHeight(window.dsCesium.viewer);
        break;
        case "clmj":
          window.dsCesium.viewer.measureArea(window.dsCesium.viewer);
        break;
        case "jwdxs":
          this.$store.commit('SET_LNGLAT_SHOWHIDE')
        break;
      }
    },
    toggleDzysf(value,item){
      console.log(item)
      //debugger
      item.layer="fjseismgis:fjsmx_ebusstation"
      if(item.select && item.layer !== ""){
        window.dsCesium.viewer.addIgyLayer4Provider({
          provider: new Cesium.WebMapServiceImageryProvider({
            url: this.$config.geoServerUrl,
            layers: item.layer,
            parameters: {
                service: 'WMS',
                format: 'image/png',
                transparent: true
            }
          }),
          layerName: item.layer
        })
      }else{
          window.dsCesium.viewer.removeIgyLayer({
          layerName:item.layer
        });
      }
    }
  }
}
</script>
<style lang="scss" scoped src="./right.scss"></style>

