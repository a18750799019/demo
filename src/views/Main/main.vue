<template>
  <div class="mainC">
    <div class="container">
      <ds-cesium @init="initMap"
                 v-if="true"
                 :animation="false"
                 :orientation="$config.orientation"
                 :options="$config.mapInitOpts"
                 :center="$config.center"></ds-cesium>
    </div>
    <live-tabs ref="liveTabs"
               @itemClick="handleItemClick"
               @liveLine="handleLivelineClick"
               @changTab="closeFun"
               @ReportDialog="showReportDialog"></live-tabs>

    <left-sub ref="leftSub"
              :centerLng="leftSub.lng"
              :centerLat="leftSub.lat"
              :type="leftSub.type"
              :title="leftSub.title"
              :location="leftSub.location"
              :time="leftSub.time"
              :level="leftSub.level"
              :searchResult="leftSub.searchResult"
              @showMoveLiveLine="showMoveLiveLineRececeive"
              :liveDetails="leftSub.eaItemDetail"
              :close="colseSubPanel"
              @closeIshow="closeFun"></left-sub>

    <div>aaaaaaaaaaaaaaaaaaaa</div>

    <div class="bottomPanel">
      <bottom-tab></bottom-tab>

    </div>
    <dialog-panel :dialogVisible="report.state"
                  :title="report.title"
                  top="5vh"
                  @close="closeReceive">

      <div class="vertical-align-top inline-block"
           style="width:250px;height:85vh;">
        <div class="text-center"
             style="border-right:0.5px solid #999;height:inherit">
          <div style="padding:10px 0;">
            列表
            <el-upload class="upload-demo"
                       ref="elupload"
                       accept=".doc,.docx"
                       style="display:inline-block"
                       :action="$api.fileUpload"
                       :on-success="uploadsuccess"
                       :data="{quakesid:report.quakesid,type:report.title=='决策报告'?'adm':'hbr',userId:user.id}"
                       :limit="1">
              <el-button size="mini"
                         type="danger"
                         style="background:#e47629;border-color:#e47629"
                         class="margin-left-20">上传</el-button>
            </el-upload>

          </div>
          <span @click="changePdfShow(item)"
                class="cursor-pointer report-list-item position-relative"
                :class="{'onS':report.sel==item}"
                style="padding: 10px 0;border: 1px solid #e8e8e8;margin: 0 3px;display: block;"
                v-for="(item,i) in report.reports_list"
                :key="i">{{(item.admPath||item.hbrPath).slice(5,-4)}}<img @click.stop="downloadItem(item)"
                 class="float-right margin-right-10"
                 width="16px"
                 src="imgs/dl.png"
                 alt=""> <img @click.stop="deleteItem(item)"
                 v-if="user.id==item.userId"
                 class="float-right margin-right-10"
                 width="16px"
                 src="imgs/delete.png"
                 alt=""></span>

        </div>
      </div>
      <div class="inline-block"
           style="height:85vh; width:calc(100% - 250px); overflow: hidden;">
        <pdfBox :src="pdf.src"
                :isIfream="pdf.isIfream"></pdfBox>
      </div>
    </dialog-panel>

    <div class="popupContent"
         id="popupContent_ea"
         ref="popupContent_ea">
      <table>
        <tr>
          <td>发震时刻</td>
          <td>{{popupObj.seismicTime}}</td>
        </tr>
        <tr>
          <td>发震经纬度</td>
          <td>纬度:{{popupObj.lat}}°/ 经度:{{popupObj.lon}}°</td>
        </tr>
        <tr>
          <td>震源深度</td>
          <td>{{popupObj.depth?popupObj.depth+"Km":"-"}}</td>
        </tr>
        <tr>
          <td>震级</td>
          <td>{{popupObj.quakeLevel?popupObj.quakeLevel+"M":"-"}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import bottomTab from "@/components/bottomTab/bottomTab";
import liveTabs from "@/components/liveTabs/liveTabs";
import leftSub from "@/components/leftSub/leftSub";
import dsCesium from "@3d-space/ds-cesium"
import "@3d-space/ds-cesium/dist/dsCesium.css"
import { default as Popup } from "@/util/ds.cesium.popup"
import { businessApi, commonApi } from "@/api";
import dialogPanel from "@/_sys_components/dialog"
import pdfBox from "@/components/pdfBox"
import { filterAreacode, getLevel, localStorageSetting } from "@/util/ds.common.js"
import { loadMapInterfaceEvent, loadAreacodeLine } from "@/util/ds.cesium.common"
export default {
  components: {
    bottomTab,
    dsCesium,
    liveTabs,
    leftSub,
    dialogPanel,
    pdfBox
  },
  data () {
    return {
      user: {},
      liveLinePageSize: 1,
      liveLineSelectedData: {},
      mapListerTime: true,
      colseSubPanel: true,
      mapObj: {
        lat: "",
        lng: "",
        height: "",
        info: "",
        scale: "1:500000"
      },
      popupObj: {
        column1: "",
        column2: "",
        column3: "",
        column4: "",
        column5: "",
        column6: "",
      },
      leftSub: {
        type: "liveMode",
        title: "地震现场",
        searchResult: [],
        eaItemDetail: [],
        location: "",
        time: "",
        level: "",
        lng: '',
        lat: ''
      },
      areacode: {
        opt_province: [],
        opt_cities: [],
        opt_towns: [],
        province: '',
        city: '',
        town: '',
        mapProvince: "",
        mapCity: "",
        mapTown: "",
        mapLat: "",
        mapLng: ""
      },
      report: {
        data: [],
        quakesid: 0,
        state: false,
        title: "",
        reports_list: [],
        sel: null,
      },
      pdf: {
        currentPage: 0, // pdf文件页码
        pageCount: 0, // pdf文件总页数
        fileType: 'pdf', // 文件类型
        src: '', // pdf文件地址,
        isIfream: true
      },
      lnglatShowHide: true

    }
  },
  mounted () {
    this.user = localStorageSetting("userCount");
    this.areacode.opt_province = this.$areacode.province;
    this.areacode.province = this.areacode.opt_province[0].areacode
    this.changeAreacode(this.areacode.province, "province");
    this.addname()
  },
  methods: {
    addname () {
      let map = window.dsCesium.viewer;
      map.addIgyLayer4Provider({ provider: map.tdtCia(), layerName: "tdtCia" })
    },
    diyPointFlicker (data) {
      let viewer = window.dsCesium.viewer;
      let Cesium = window.dsCesium.Cesium

      // viewer.entities.removeById("PointFlicker")
      //debugger
      let r1 = data.minR, r2 = data.minR
      function changeR1 () {
        r1 = r1 + data.deviationR
        if (r1 >= data.maxR) {
          r1 = data.minR
        }
        return r1;
      }
      function changeR2 () {
        r2 = r2 + data.deviationR
        if (r2 >= data.maxR) {
          r2 = data.minR
        }
        return r2
      }
      viewer.entities.add({
        name: "",
        id: data.id[0],
        position: Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.height),
        ellipse: {
          semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
          semiMajorAxis: new Cesium.CallbackProperty(changeR1, false),
          height: data.height,
          material: new Cesium.ImageMaterialProperty({
            image: data.imageUrl,
            transparent: true,
            color: new Cesium.CallbackProperty(function () {
              return Cesium.Color.WHITE.withAlpha(1 - r1 / data.maxR)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
            }, false)
          })
        }
      })
    },
    addHighlight (data) {
      // let highLightObj = {
      //   "billboard": true,
      //   "layerName": "hilight",
      //   "list": []
      // }
      // highLightObj.list.push[data]
      /*
      let ary = []
      //data.url='https://gimg2.baidu.com/image_search/src=http%3A%2F%2F762204.s21i.faiusr.com%2F3%2FABUIABADGAAgi6iB2gUo3P3dpAcw7gU4uwM.gif&refer=http%3A%2F%2F762204.s21i.faiusr.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629508228&t=4bc92091da9b3059df44d1cdfa499719'
      data.iconHeight = 60
      data.iconWidth = 80
      data.color= "#CC6633"
      data.diameter=7
      ary.push(data)
      //debugger
      if (window.dsCesium.viewer) {
        window.dsCesium.viewer.removeEntityLayer({
          layerName: "highLight"
        });
        window.dsCesium.viewer.addEntityLayer({
          layerName: "highLight",
          list: ary,
          viewer: window.dsCesium.viewer,
          point: true
        })
      }       
    */
      //debugger
      let item = data
      item.lon = item.lng
      window.dsCesium.viewer.entities.removeById("PointFlickera")
      window.dsCesium.viewer.entities.removeById("PointFlickerb")
      this.diyPointFlicker({
        id: ['PointFlickera', 'PointFlickerb'],
        lon: item.lon,
        lat: item.lat,
        height: 0,
        maxR: item.livelineNum * 1000,
        minR: 0,//最好为0
        deviationR: 5,//差值 差值也大 速度越快
        eachInterval: 2000,
        imageUrl: "imgs/redCircle.png"
      })
    },
    toggleMapZoom (type) {
      window.dsCesium.viewer.toggleMapZoom(type);
    },
    handleItemClick (data) {
      //debugger
      this.leftSub.type = "liveMode";
      this.leftSub.title = "地震现场";
      this.colseSubPanel = false;
      this.$store.dispatch("changeCloseSubPanel", false);
      this.leftSub.location = data.address;
      this.leftSub.time = data.seismicTime;
      this.leftSub.level = data.quakeLevel;
      businessApi.getCollectionList({
        url: this.$api.collentionList,
        params: {
          quakeid: data.id
        }
      }).then(data => {
        this.leftSub.eaItemDetail = data.rows.filter(v => {
          v.selectedItem = 1;
          v.srcList = [];
          for (let i = 0; i < v.accessory.length; i++) {
            if (v.accessory[i].type == 0) {
              v.srcList.push(`${this.$config.relativePath}api/static/image/${v.accessory[i].fileName}`)
            } else {
              v.videoSrc = `${this.$config.relativePath}api/static/video/${v.accessory[i].fileName}`
            }
          }
          if (v.srcList.length > 0) {
            v.src = v.srcList[0]
          }
          return v;
        });
      })
    },
    showMoveLiveLineRececeive () {
      let data = this.liveLineSelectedData;
      this.liveLinePageSize++;
      businessApi.getLiveLineList({
        url: this.$api.lifeLine,
        params: {
          searchLon: data.lng,
          searchLat: data.lat,
          radius: data.livelineNum,
          page: this.liveLinePageSize,
          rows: 10
        }
      }).then(d => {
        let newRes = d.rows.filter((_, index) => {
          _.index = ((this.liveLinePageSize - 1) * 10) + index + 1;
          _.url = "/imgs/icon-liveLine.png";
          _.iconWidth = 25;
          _.iconHeight = 30;
          _.lng = _.lon;
          return _;
        });
        this.leftSub.searchResult = [...this.leftSub.searchResult, ...newRes]
        if (window.dsCesium.viewer) {
          window.dsCesium.viewer.removeEntityLayer({
            layerName: "liveline"
          });
          // this.
          window.dsCesium.viewer.addEntityLayer({
            layerName: "liveline",
            list: this.leftSub.searchResult,
            viewer: window.dsCesium.viewer,
            billboard: true
          })
        }
      })
    },
    handleLivelineClick (data) {
      //debugger
      this.addHighlight(data)
      this.liveLineSelectedData = data;
      this.leftSub.type = "addressMode";
      this.leftSub.title = "周边查询结果";
      this.leftSub.lng = data.lng;
      this.leftSub.lat = data.lat
      this.colseSubPanel = false;
      this.$store.dispatch("changeCloseSubPanel", false);
      //医院 学校 疏散场所
      // debugger
      businessApi.getLiveLineList({
        url: this.$api.lifeLine,
        params: {
          searchLon: data.lng,
          searchLat: data.lat,
          radius: data.livelineNum,
          page: 1,
          rows: 10
        }
        //`geoserver/fjseismgis/ows?service=WFS&request=GetFeature&version=1.0.0%20&typeName=fjseismgis:fjsmx_ehospital&maxFeatures=2000&outputFormat=json&filter=%3CFilter%20xmlns=%22http://www.opengis.net/ogc%22%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%20%3CIntersects%3E%20%3CPropertyName%3Ethe_geom%3C/PropertyName%3E%20%3Cgml:Point%3E%20%3Cgml:coordinates%3E118.1,24.53554%3C/gml:coordinates%3E%20%3C/gml:Point%3E%20%3C/Intersects%3E%20%3C/Filter%3E`
      }).then(d => {
        this.leftSub.searchResult = d.rows.filter((_, index) => {
          _.index = index + 1;
          _.url = "/imgs/icon-liveLine.png";
          _.iconWidth = 30;
          _.iconHeight = 30;
          _.lng = _.lon;
          // _.lat = _.lat
          return _;
        });
        //debugger
        console.log(this.leftSub.searchResult)
        if (window.dsCesium.viewer) {
          window.dsCesium.viewer.removeEntityLayer({
            layerName: "liveline"
          });
          window.dsCesium.viewer.addEntityLayer({
            layerName: "liveline",
            list: this.leftSub.searchResult,
            viewer: window.dsCesium.viewer,
            billboard: true
          })
        }
      })
    },
    initMap (viewer) {
      viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: 'http://data.marsgis.cn/terrain/',
        requestWaterMask: true,
        requestVertexNormals: true
      });

      window.dsCesium.viewer.addIgyLayer4Provider({
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
      loadMapInterfaceEvent(viewer, this)
      loadAreacodeLine(viewer, this);
      viewer.evPostRenderListener(() => {
        try {
          if (this.mapListerTime) {
            this.mapListerTime = false;
            setTimeout(() => {
              this.mapListerTime = true;
              let position = viewer.camera.position;
              var ellipsoid = viewer.scene.globe.ellipsoid;
              var cartesian3 = new Cesium.Cartesian3(position.x, position.y, position.z);
              var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
              var lat = Cesium.Math.toDegrees(cartographic.latitude);
              var lng = Cesium.Math.toDegrees(cartographic.longitude);
              if (lat !== this.areacode.mapLat || lng !== this.areacode.mapLng) {
                this.areacode.mapLng = lng;
                this.areacode.mapLat = lat;
                businessApi.tiandituApi({
                  url: this.$api.mapApi,
                  params: {
                    lat: lat,
                    lon: lng
                  }
                }).then(data => {
                  if (data.result.addressComponent.province !== "福建省") {
                    this.areacode.mapProvince = ""
                    this.areacode.province = "";
                    this.areacode.city = "";
                    this.areacode.town = "";
                    this.areacode.mapCity = ""
                    this.areacode.mapTown = ""
                    this.areacode.mapProvince = ""
                  } else {
                    this.areacode.mapProvince = data.result.addressComponent.province;
                    this.areacode.province = this.$areacode.province[0].areacode;
                    for (let i = 0; i < this.areacode.opt_cities.length; i++) {
                      if (this.areacode.opt_cities[i].name == data.result.addressComponent.city) {
                        this.areacode.city = this.areacode.opt_cities[i].areacode;
                        this.areacode.opt_towns = this.areacode.opt_cities[i].county;
                        this.areacode.mapCity = data.result.addressComponent.city
                        break;
                      }
                    }
                    this.areacode.town = "";
                    for (let i = 0; i < this.areacode.opt_towns.length; i++) {
                      if (this.areacode.opt_towns[i].name == data.result.addressComponent.county) {
                        this.areacode.town = this.areacode.opt_towns[i].areacode;
                        this.areacode.mapTown = data.result.addressComponent.county
                        break;
                      }
                    }
                  }
                  // this.areacode.mapCity =data.result.addressComponent.city
                  // this.areacode.mapTown =data.result.addressComponent.county
                  // this.areacode.mapProvince = data.result.addressComponent.province;
                })
              }
            }, 2000);
          }
        } catch (error) {
        }


        viewer.getMapScale(obj => {
          this.mapObj.scale = `1:${obj}`;
        });
      })
    },

    closeFun (data) {
      this.colseSubPanel = !data;
      this.$store.dispatch("changeCloseSubPanel", !data);
      window.dsCesium.viewer.removeEntityLayer({
        layerName: "dzxc"
      });
      window.dsCesium.viewer.removeEntityLayer({
        layerName: "liveline"
      });
    },
    changeAreacode (value, type) {
      //都要定位
      let item = filterAreacode(value, this);
      if (window.dsCesium.viewer) {
        window.dsCesium.viewer.camera.flyTo({
          destination: window.dsCesium.Cesium.Cartesian3.fromDegrees(item.center[0], item.center[1], item.height || 1500000.0)
        });
      }
      switch (type) {
        case "province":
          this.areacode.city = "";
          this.areacode.town = "";
          for (let i = 0; i < this.areacode.opt_province.length; i++) {
            if (this.areacode.opt_province[i].areacode == this.areacode.province) {
              this.areacode.opt_cities = this.areacode.opt_province[i].city;
              return;
            }
          }
          break;
        case "city":
          this.areacode.town = "";
          for (let i = 0; i < this.areacode.opt_cities.length; i++) {
            if (this.areacode.opt_cities[i].areacode == this.areacode.city) {
              this.areacode.opt_towns = this.areacode.opt_cities[i].county;
              return;
            }
          }
          break;
        case "town":

          break;
        default:
          break;
      }
    },
    closeReceive (state) {
      this.report.src = null;
      this.report.state = false;

    },

    changePdfShow (item) {
      this.report.sel = item;
      this.pdf = {
        isIfream: false,
        src: this.$config.apiFileUrl + item[this.report.title == "决策报告" ? "admPath" : "hbrPath"]
      }
    },
    uploadsuccess (res) {
      this.$refs.elupload.uploadFiles = [];
      this.showReportDialog({
        index: this.report.quakesid,
        type: this.report.title,
        state: true
      })
    },
    downloadItem (item) {
      //debugger
      window.open(this.$api.fileDownload + "?filePath=" + item[`${this.report.title == "决策报告" ? "adm" : "hbr"}AbsolutePath`])
    },
    deleteItem (item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commonApi.pagingGet4Res(this.$api.deleteZspdf, {
          ids: item.id,
          type: this.report.title == "决策报告" ? "adm" : "hbr"
        }).then(res => {
          this.showReportDialog({
            index: this.report.quakesid,
            type: this.report.title,
            state: true
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    //文件
    showReportDialog (data) {
      this.report.title = data.type;
      this.report.quakesid = data.index;
      //debugger
      //this.report.state = data.state;
      commonApi.pagingPost4Res(this.$api.getZspdf, {
        quakesid: data.index,
        type: data.type == "决策报告" ? "adm" : "hbr"
      }).then(dr => {
        console.log(this.report)
        this.report.state = data.state;
        this.report.reports_list = dr.objects;
        this.report.sel = dr.objects[0];
        if (dr.objects && dr.objects.length) {
          let src = this.$config.apiFileUrl + dr.objects[0][data.type == "决策报告" ? "admPath" : "hbrPath"];
          this.pdf = {
            isIfream: false,
            src: src, // pdf文件地址
          }
        } else {

          this.report.state = false;
          this.$message("文件正在生成中，请稍后再试")
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.mainC {
  height: calc(100% - #{$head-height});
  background: #ecf5ff;
  .container {
    height: 100%;
  }
}

.areacodePanel,
.bottomPanel {
  @include font_color($color-theme-default);
}
.areacodePanel {
  width: 336px;

  background: rgba(3, 13, 32, 0.8);
  border: 1px solid rgba(125, 125, 125, 1);
  border-radius: 6px;
  position: absolute;
  top: $head-height;
  left: 330px;
  margin-top: 8px;
  padding: 3px 0px;
  ::v-deep .el-input__inner {
    background-color: inherit;
    height: 26px;
    border: none;
    width: 90px;
    padding-left: 5px;
    color: #fff;
    border-right: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 0px;
  }
  ::v-deep .el-input__inner:last-child {
    border: none;
  }
  ::v-deep .el-input__icon {
    line-height: 26px;
  }
}
.legendPanel {
  // width:752px;
  // height:65px;
  width: 700px;
  height: 65px;
  background: url("/imgs/icon-legend.png");
  position: absolute;
  bottom: 25px;
  right: 0;
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.legendPanel2 {
  position: absolute;
  bottom: 90px;
  right: 227px;
}
.bottomPanel {
  width: 700px;
  height: 30px;
  font-size: 13px;
  text-align: center;
  line-height: 30px;
  background: rgba(3, 13, 32, 0.5);
  position: absolute;
  bottom: 275px;
  right: 530px;
  .optArea {
    .btnAdd,
    .btnSub,
    span {
      border: 1px solid rgba(112, 112, 112, 1);
      background: rgba(4, 14, 32, 0.8);
      color: #fff;
      height: 30px;
      display: inline-block;
      padding: 0 9px;
      font-size: 12px;
    }
  }
}

.mapInfo {
  color: #fff;
  text-align: left;
  margin: 0 20px 0 0;
  min-width: 220px;
  font-size: 13px;
  width: 250px;
}

::v-deep .el-tabs__header {
  @include bg_noselected_bg_color(
    $tab-unselected-background-color-theme-default
  );
  margin: 0;
  border: none;
  .el-tabs__nav {
    width: 100%;
    border: none;
    .el-tabs__item {
      width: 50%;
      @include font_color($color-theme-default);
      text-align: center;
      border: none;
      height: 36px;
    }
  }
}

.onS,
report-list-item:hover {
  background: #74c5fd;
}

::v-deep .el-tabs .is-active {
  background-color: #198afe !important;
}
::v-deep .el-dialog__body {
  background-color: #ffffff;
}
::v-deep .el-dialog__header {
  color: #333333;
}
</style>

<style lang="scss">
.el-icon-position {
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg); /* IE 9 */
  -webkit-transform: rotate(-45deg); /* Safari and Chrome */
}
.ds-popup-ctn {
  padding: 5px 5px;
  .ds-popup-header-ctn {
    background: #fff;
    font-size: 16px;
  }
  #ds-popup-close-button {
    margin: 13px 10px;
  }
  .popupTitle {
    color: #057fd2;
    font-weight: bold;
  }
  .popupContent {
    padding: 3px;
    font-size: 13px;
    table {
      border-collapse: collapse;
      td {
        height: 32px;
        line-height: 32px;
        border: 1px solid #c9c9c9;
      }
      td:first-child {
        background: rgba(201, 201, 201, 0.5);
        min-width: 60px;
        color: #666666;
        text-align: right;
        padding: 0 10px;
      }
      td:last-child {
        padding: 0 10px;
        color: #323333;
      }
    }
  }
}
</style>
