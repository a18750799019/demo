<template>
  <div>
    <dialog-panel
    width="941px"
    :dialogVisible="dialogStatisObj.state"
    title="点击地图获取位置信息"
    @close="closeMapObj"
  >
    <div style="margin:5px;">
      <span>经度：{{lng}} &nbsp; &nbsp;&nbsp;&nbsp;纬度：{{lat}}  </span><br>
      <span class="inline-block" style="min-width:250px;margin-right:15px;">位置信息：{{address}}</span>
      <el-button size="mini" type="primary" @click="sure">确认</el-button>
    </div>
    <div style="height:500px;">
     <ds-map
            class="map"
            @init="initSubMap"
            :center="[119,26]"
            projection="EPSG:3857"
            :options="{ controls:{zoom: false}}"
            :zoom="6"
            providers="Tianditu.Normal"
          ></ds-map>
    </div>
    </dialog-panel>
  </div>
</template>
<script>
import dialogPanel from "@/_sys_components/dialog"
import dsMap from "@3d-space/ds-map";
import "@3d-space/ds-map/dist/dsMap.css";
import {businessApi} from "@/api"; 
export default {
  
  components:{dialogPanel},
  props:{
    dialogStatisObj: {
      default:()=>{
        return {
           state:false,
        title:"点击地图获取当前位置"
        }
      }
    }
  },
  data(){
    return{
      lng:"",
      lat:"",
      address:"",
      city:"",
      town:""
    }
  },
  methods:{
    sure(){
      this.$emit("mapClickInfo",{
          lng:this.lng,
          lat:this.lat,
          address:this.address,
          city:this.city,
          town:this.town
        })
        this.closeMapObj()
    },
    initSubMap(map){

      map.addLayerWmtsByXYZ("cva_c","http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=0b4ef5d9b6efb70331897fe81c6d1bfd",100);
      map.on("click",(evt)=>{
        let r =  map.projTransform(evt.coordinate,'EPSG:3857', 'EPSG:4326')
        this.lng = r[0].toFixed(2)
        this.lat = r[1].toFixed(2)
        businessApi.tiandituApi({
          url:this.$api.mapApi,
          params:{
            lat:this.lat,
            lon: this.lng
          }
        }).then(data=>{
          this.address = data.result.formatted_address
          this.city =data.result.addressComponent.city
          this.town =data.result.addressComponent.county
        })
      })
    },
    closeMapObj(){
      this.$emit("closeMapObj",true)
    },
  }
}
</script>