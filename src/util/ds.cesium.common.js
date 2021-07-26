export const addEntityLayer = ({viewer,layerName,iconname, list, point=false, billboard=false }) =>{
  viewer = viewer? viewer: this;
  let Cesium = window.dsCesium.Cesium
  let dataSource = new Cesium.CustomDataSource(layerName);
  viewer.dataSources.add(dataSource);
  for (let i = 0; i < list.length; i++) {
    let element = list[i];
    if(!element.pixelOffset){
      element.pixelOffset = [-11,-4];
    }
    let _point =point? {point :{
      color:viewer.getCesiumColor({color:element.color}),
      outlineColor: viewer.getCesiumColor({color:"#fff"}),
      outlineWidth: 1,
      pixelSize: element.diameter
    }}:{}
    let _billboard = billboard?{billboard:{
      image: element.url,
      width: element.iconWidth||30,
      height:element.iconHeight||40
    }}:{}
  dataSource.entities.add(
    new Cesium.Entity({
      name: iconname||element.iconname|| layerName,
      position: Cesium.Cartesian3.fromDegrees(element.lng||element.lon, element.lat, element.height||0),//定位位置
      extInfo:{
      ...element
    },
    label : {
      text : element.index?element.index+"":(i+1)+"", //文本信息
      font : '12pt Source Han Sans CN',    //字体样式
      fillColor:Cesium.Color.WHITE,        //字体颜色
      backgroundColor:viewer.getCesiumColor({color:"rgba(255,0,155,0)"}),    //背景颜色
      showBackground:true,                //是否显示背景颜色
      style: Cesium.LabelStyle.FILL,        //label样式
      outlineWidth : 2,                    
      verticalOrigin : Cesium.VerticalOrigin.CENTER,//垂直位置
      horizontalOrigin :Cesium.HorizontalOrigin.LEFT,//水平位置
      pixelOffset:new Cesium.Cartesian2(element.pixelOffset[0],element.pixelOffset[1]),            //偏移
      scale: 1
    },
    ..._billboard,
    ..._point
  })
)
}
  if(viewer._entitiesLayers){
    viewer._entitiesLayers[layerName] = dataSource;
  }
  return dataSource;
}

const to_Radian = function(degree) {
        return degree * Math.PI / 180.0
    }

const to_Sm = function(B) {
        var AA, BB, CC, DD, EE;
        AA = 1 + (e1 * e1) * 3 / 4 + Math.pow(e1, 4.0) * 45 / 64 + Math.pow(e1, 6) * 175 / 256 + Math.pow(e1, 8) * 11025 / 16384;
        BB = Math.pow(e1, 2) * 3 / 4 + Math.pow(e1, 4) * 15 / 16 + Math.pow(e1, 6) * 525 / 512 + Math.pow(e1, 8) * 2205 / 2048;
        CC = Math.pow(e1, 4) * 15 / 64 + Math.pow(e1, 6) * 105 / 256 + Math.pow(e1, 8) * 2205 / 4096;
        DD = Math.pow(e1, 6) * 35 / 512 + Math.pow(e1, 8) * 315 / 2048;
        EE = Math.pow(e1, 8) * 315 / 16384;
        return aEarth * (1 - e1 * e1) * (AA * B - BB / 2 * Math.sin(2 * B) + CC / 4 * Math.sin(4 * B) - DD / 6 * Math.sin(6 * B) + EE / 8 * Math.sin(8 * B))
    }

const to_N = function(B) {
        var ans = (aEarth / Math.sqrt(1.00 - e1 * e1 * Math.sin(B) * Math.sin(B)));
        return ans
    }
;
const Gauss_to_XY = function(L, B, middleL2) {
        var t = 0
            , yita = 0;
        var nn = 0;
        var n = 0;
        var middleL = to_Radian(middleL2);
        B = to_Radian(B);
        L = to_Radian(L);
        var dL = L - middleL;
        var cosB = Math.cos(B);
        n = to_N(B);
        nn = n * Math.cos(B);
        t = Math.tan(B);
        yita = e2 * cosB;
        var pow_t2 = Math.pow(t, 2);
        var pow_t4 = Math.pow(t, 4);
        var pow_yita2 = Math.pow(yita, 2);
        var pow_yita4 = Math.pow(yita, 4);
        var pow_cosB3 = Math.pow(cosB, 3);
        var pow_cosB5 = Math.pow(cosB, 5);
        var tY = to_Sm(B) + Math.pow(dL, 2) / 2 * nn * cosB * t + Math.pow(dL, 4) / 24 * t * nn * pow_cosB3 * (5.0 - pow_t2 + 9.0 * pow_yita2 + 4 * pow_yita4) + Math.pow(dL, 6) / 720 * t * nn * pow_cosB5 * (61.0 - 58.0 * t * t + pow_t4 + 270 * pow_yita2 - 330 * t * t * pow_yita2);
        var tX = dL * n * cosB + Math.pow(dL, 3) / 6.0 * n * pow_cosB3 * (1 - t * t + yita * yita) + Math.pow(dL, 5) / 120.0 * n * pow_cosB5 * (5 - 18 * t * t + pow_t4 + 14.0 * pow_yita2 - 58.0 * pow_yita2 * pow_t2);
        return new Cesium.Cartesian2(tX,tY)
    }
;
const Sm_to_B = function(Sm) {
        var B;
        var B2, B4, B6, B8, fai;
        var AA, BB, CC, DD, EE;
        var A2, A4, A6, A8;
        AA = 1 + (e1 * e1) * 3 / 4 + Math.pow(e1, 4.0) * 45 / 64 + Math.pow(e1, 6) * 175 / 256 + Math.pow(e1, 8) * 11025 / 16384;
        BB = Math.pow(e1, 2) * 3 / 4 + Math.pow(e1, 4) * 15 / 16 + Math.pow(e1, 6) * 525 / 512 + Math.pow(e1, 8) * 2205 / 2048;
        CC = Math.pow(e1, 4) * 15 / 64 + Math.pow(e1, 6) * 105 / 256 + Math.pow(e1, 8) * 2205 / 4096;
        DD = Math.pow(e1, 6) * 35 / 512 + Math.pow(e1, 8) * 315 / 2048;
        EE = Math.pow(e1, 8) * 315 / 16384;
        fai = Sm / (aEarth * (1 - e1 * e1) * AA);
        A2 = BB / AA / 2;
        A4 = -CC / AA / 4;
        A6 = DD / AA / 6;
        A8 = -EE / AA / 8;
        B2 = A2 - A2 * A4 - A4 * A6 - 0.5 * Math.pow(A2, 3) - A2 * Math.pow(A4, 2) + 0.5 * Math.pow(A2, 2) * A6 - 18.3 * Math.pow(A2, 3) * A4;
        B4 = A4 + Math.pow(A2, 2) - A2 * A6 * 2 - 4 * A2 * A2 * A4 - 1.3 * Math.pow(A2, 4);
        B6 = A6 + 3 * A2 * A4 - 3 * A2 * A8 + 1.5 * Math.pow(A2, 3) - 4.5 * A2 * A4 * A4 - 9 * A2 * A2 * A6 - 12.5 * Math.pow(A2, 3) * A4;
        B8 = A8 + 2 * A4 * A4 + 4 * A2 * A6 + 8 * A2 * A2 * A4 + 2.7 * Math.pow(A2, 4);
        B = fai + B2 * Math.sin(2 * fai) + B4 * Math.sin(4 * fai) + B6 * Math.sin(6 * fai) + B8 * Math.sin(8 * fai);
        return B
    }
;
const Gauss_to_BL = function(x, y, m_fL0) {
        var bf;
        var n, t, yita;
        bf = Sm_to_B(y);
        n = to_N(bf);
        t = Math.tan(bf);
        yita = e2 * Math.cos(bf);
        var B = bf + t * (-1 - yita * yita) * x * x / (2.0 * Math.pow(n, 2)) + t * (5 + 3 * Math.pow(t, 2) + 6.0 * Math.pow(yita, 2) - 6.0 * Math.pow(t, 2) * Math.pow(yita, 2) - 3.0 * Math.pow(yita, 4) - 9.0 * Math.pow(t, 2) * Math.pow(yita, 4)) * Math.pow(x, 4) / (24.0 * Math.pow(n, 4)) + t * (-61.0 - 90.0 * Math.pow(t, 2) - 45.0 * Math.pow(t, 4) - 107 * Math.pow(yita, 2) + 162 * Math.pow(t, 2) * Math.pow(yita, 2) + 45 * Math.pow(t, 4) * Math.pow(yita, 2)) * Math.pow(x, 6) / (720.0 * Math.pow(n, 6));
        var L = x / (n * Math.cos(bf)) + (-1 - 2 * Math.pow(t, 2) - Math.pow(yita, 2)) * Math.pow(x, 3) / (6 * Math.pow(n, 3) * Math.cos(bf)) + (5 + 28 * Math.pow(t, 2) + 24 * Math.pow(t, 4) + 6 * Math.pow(yita, 2) + 8 * Math.pow(t, 2) * Math.pow(yita, 2)) * Math.pow(x, 5) / (120 * Math.pow(n, 5) * Math.cos(bf));
        return new Cesium.Cartographic(L + m_fL0,B / Math.PI * 180)
    }
;
const to_Degree = function(radian) {
        return radian / Math.PI * 180.0
    }
;
var aEarth = 6378137;
var bEarth = 6356752.3142;
var e1 = Math.sqrt(aEarth * aEarth - bEarth * bEarth) / aEarth;
var e2 = Math.sqrt(aEarth * aEarth - bEarth * bEarth) / bEarth;

const CreatePolygon = (function() {
    function _(positons,cesium) {
        if (!Cesium.defined(positons)) {
            throw new Cesium.DeveloperError('positions is required!');
        }
        if (positons.length < 3) {
            throw new Cesium.DeveloperError('positions 的长度必须大于等于3');
        }
        this.options = {
            polygon : {
                show : true,
                hierarchy : undefined,
                outline:true,
                outlineColor:Cesium.Color.WHITE,
                outlineWidth:2,
                material : Cesium.Color.YELLOW.withAlpha(0.4)
            }
        };
        this.path = positons;

        this._init(cesium);
    }

    _.prototype._init = function(cesium) {
        var that = this;
        var positionCBP = function() {
            return that.path;
        };
        this.options.polygon.hierarchy = new Cesium.CallbackProperty(positionCBP, false);
        this.polygonEntity=cesium.entities.add(this.options);
    };

    return _;
})();
//测量面积
export const measureArea=function(cesium){
    var isDraw = true;
    var polygonPath = [];
    var polygon = undefined;
    var scene=cesium.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var entities=[];
    var billboards = new Cesium.BillboardCollection();
    scene.primitives.add(billboards);
    var billboard=undefined;
    var tooltip = document.createElement("div");
    tooltip.style = "display:none;background-color:rgba(0,0,0,0.8);position:absolute;font-size:12px;color:#fff;padding:5px";
    document.body.appendChild(tooltip);
    tooltip.innerHTML='<span>单击开始,双击结束</span>';

    //隐藏选中容器标识
    var wrapperEles = document.getElementsByClassName("cesium-selection-wrapper");
    if(wrapperEles && wrapperEles.length){
        wrapperEles[0].style.display = "none";
    }
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    var tempLabelCollection = new Cesium.LabelCollection();
    var measureDisplayLabel=tempLabelCollection.add({
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        font : '13px sans-serif',
        verticalOrigin: Cesium.VerticalOrigin.TOP
    });
    scene.primitives.add(tempLabelCollection);
    handler.setInputAction(function(movement) {
        //新增部分
        var position1;
        var cartographic;
        var ray = cesium.scene.camera.getPickRay(movement.endPosition);
        if(ray)
            position1 = cesium.scene.globe.pick(ray,cesium.scene);
        if(position1)
            cartographic= Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
        if(cartographic){
            //海拔
            var height = cesium.scene.globe.getHeight(cartographic);
            var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180,cartographic.latitude / Math.PI * 180,height);
            if (isDraw) {
                tooltip.style.left = movement.endPosition.x + 10 + "px";
                tooltip.style.top = movement.endPosition.y + 20 + "px";
                tooltip.style.display = "block";

                if (polygonPath.length < 2) {
                    return;
                }
                if (!Cesium.defined(polygon)) {
                    polygonPath.push(point);
                    polygon = new CreatePolygon(polygonPath,cesium);
                } else {
                    polygon.path.pop();
                    polygon.path.push(point);
                }
                if(polygonPath.length>=2){
                    var label = String(countAreaInCartesian3(polygon.path));
                    label = label.substr(0, label.indexOf(".", 0));
                    var text;
                    if (label.length < 6)
                        text = label + "平方米";
                    else {
                        label = String(label / 1000000);
                        label = label.substr(0, label.indexOf(".", 0) + 3);
                        text = label + "平方公里"
                    }
                    measureDisplayLabel.text=text;
                    measureDisplayLabel.position = countCenter(polygon.path);
                    tooltip.innerHTML='<p>双击确定终点</p>';
                }
            }
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction(function(movement) {
        var position1;
        var cartographic;
        var ray = cesium.scene.camera.getPickRay(movement.position);
        if(ray)
            position1 = cesium.scene.globe.pick(ray,cesium.scene);
        if(position1)
            cartographic= Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
        if(cartographic){
            //海拔
            var height = cesium.scene.globe.getHeight(cartographic);
            var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180,cartographic.latitude / Math.PI * 180,height);
            if (isDraw) {
                polygonPath.push(point);
                entities.push(cesium.entities.add({
                    position: point,
                    point: {
                        show: true,
                        color: Cesium.Color.SKYBLUE,
                        pixelSize: 3,
                        outlineColor: Cesium.Color.YELLOW,
                        outlineWidth: 1
                    },
                }));
            }
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction(function() {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        cesium.trackedEntity = undefined;
        isDraw = false;
        billboard=billboards.add({
            show : true,
            id:"measureTool",
            position : polygonPath[polygonPath.length-1],
            pixelOffset : new Cesium.Cartesian2(0.0, 20),
            eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
            horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
            verticalOrigin : Cesium.VerticalOrigin.CENTER,
            scale : 1.0,
            image: '/imgs/icon-measure-close.png',
            color : new Cesium.Color(1.0, 1.0, 1.0, 1.0),
        });
        //关闭按钮执行事件
        handler.setInputAction(function(movement){
            var pickedObjects ={};
            pickedObjects=scene.drillPick(movement.position);
            if (Cesium.defined(pickedObjects)) {
                for (var i = 0; i < pickedObjects.length; i++)
                    if (pickedObjects[i].primitive == billboard){
                        cesium.entities.remove(polygon.polygonEntity);
                        for(var j=0;j<entities.length;j++){
                            cesium.entities.remove(entities[j]);
                        }
                        entities=[];
                        billboards.remove(billboard);
                        tempLabelCollection.remove(measureDisplayLabel);
                        polygonPath = [];
                        polygon = undefined;
                        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
        tooltip.style.display='none';
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    var countCenter=function(ps) {
        var x = 0,
        y = 0,
        z = 0;
        for (var j = 0; j < ps.length; j++) {
            x += ps[j].x;
            y += ps[j].y;
            z += ps[j].z
        }
        let center = new Cesium.Cartesian3(x / ps.length,y / ps.length,z / ps.length);
        return center
    };
    var countAreaInCartesian3=function(pointsold) {
        var points = new Array(pointsold.length);
        for (let i = 0; i < pointsold.length; i++) {
            points[i] = PItoDU(ellipsoid.cartesianToCartographic(pointsold[i]))
        }
        var center = 0;
        for (let i = 0; i < points.length; i++)
            center += points[i].longitude;
        center = center / points.length;
        for (let i = 0; i < points.length; i++) {
            points[i] = Gauss_to_XY(points[i].longitude, points[i].latitude, center)
        }
        return Math.abs(countArea(points))
    };
    var PItoDU=function(location) {
        location.longitude = location.longitude / Math.PI * 180;
        location.latitude = location.latitude / Math.PI * 180;
        return location;
    };
    var countArea=function(ps) {
        var s = 0;
        for (let i = 0; i < ps.length; i++) {
            var p1 = ps[i];
            var p2;
            if (i < ps.length - 1)
                p2 = ps[i + 1];
            else
                p2 = ps[0];
            s += p1.x * p2.y - p2.x * p1.y
        }
        return s / 2
    }
};


var CreatePolyline = (function() {
    function _(positons,cesium) {
        if (!Cesium.defined(positons)) {
            throw new Cesium.DeveloperError('positions is required!');
        }
        if (positons.length < 2) {
            throw new Cesium.DeveloperError('positions 的长度必须大于等于2');
        }
        var material = Cesium.Material.fromType(Cesium.Material.ColorType);
        material.uniforms.color = new Cesium.Color(1.0, 1.0, 0.0, 0.5);
        this.options = {
            polyline : {
                show : true,
                width : 4,
                material : new Cesium.PolylineOutlineMaterialProperty({
                    color : Cesium.Color.ORANGE.withAlpha(0.5),
                    outlineWidth : 1,
                    outlineColor : Cesium.Color.ORANGE
                }),
                depthFailMaterial : new Cesium.PolylineOutlineMaterialProperty({
                    color : Cesium.Color.RED,
                    outlineWidth : 1,
                    outlineColor : Cesium.Color.RED
                }),
                followSurface : true
            }
        };
        this.path = positons;

        this._init(cesium);
    }

    _.prototype._init = function(cesium) {
        var that = this;
        var positionCBP = function() {
            return that.path;
        };
        this.options.polyline.positions = new Cesium.CallbackProperty(positionCBP, false);
        this.lineEntity=cesium.entities.add(this.options);
    };

    return _;
})();
//测量距离
export const measureDistance=function(cesium){
    var isDraw = false;
    var polylinePath = [];
    var polylineCartographic = [];//弧度数组,地表插值用
    var polyline = undefined;
    var scene=cesium.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var billboards = new Cesium.BillboardCollection();
    scene.primitives.add(billboards);
    var WebMercatorProjection = new Cesium.WebMercatorProjection();
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    var tooltip = document.createElement("div");
    tooltip.style = "display:none;background-color:#000;position:absolute;font-size:12px;color:#fff;padding:5px";
    document.body.appendChild(tooltip);
    tooltip.innerHTML='<span>单击开始,双击结束</span>';
    var entities = [];
    var billboard=undefined;
    //隐藏选中容器标识
    var wrapperEles = document.getElementsByClassName("cesium-selection-wrapper");
    if(wrapperEles && wrapperEles.length){
        wrapperEles[0].style.display = "none";
    }
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    isDraw=true;
    handler.setInputAction(function(movement) {
        //新增部分
        var position1;
        var cartographic;
        var ray = cesium.scene.camera.getPickRay(movement.endPosition);
        if(ray)
            position1 = cesium.scene.globe.pick(ray,cesium.scene);
        if(position1)
            cartographic= Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
        if(cartographic) {
            //海拔
            var height = cesium.scene.globe.getHeight(cartographic);
            //地理坐标（弧度）转经纬度坐标
            var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
            //var point = Cesium.Cartesian3.fromDegrees(currentLon, currentLat, height);
            if (isDraw) {
                tooltip.style.left = movement.endPosition.x + 10 + "px";
                tooltip.style.top = movement.endPosition.y + 20 + "px";
                tooltip.style.display = "block";
                if (polylinePath.length < 1) {
                    return;
                }
                if (!Cesium.defined(polyline)) {
                    polylinePath.push(point);
                    polyline = new CreatePolyline(polylinePath,cesium);
                } else {
                    polyline.path.pop();
                    polyline.path.push(point);
                }
                if(polylinePath.length>=1){
                    if(polyline && polyline.path){
                        var distance=getDistance(polyline.path);
                        tooltip.innerHTML='<p>长度：'+distance+'</p><p>双击确定终点</p>';
                    }
                }
            }
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //线段之间地表插值
    var SurfaceLine=function(cartographic){
        polylineCartographic.push(cartographic);
        var terrainSamplePositions = [];
        if (polylineCartographic.length > 1) {
            var p1 = polylineCartographic[polylineCartographic.length - 2];
            var p2 = polylineCartographic[polylineCartographic.length - 1];
            var a = Math.abs(p1.longitude - p2.longitude) * 10000000;
            var b = Math.abs(p1.latitude - p2.latitude) * 10000000;
            if (a > b) b = a;
            var length = parseInt(b / 10);
            if (length > 1000) length = 1000;
            if (length < 2) length = 2;
            for (let i = 0; i < length; ++i) {
                terrainSamplePositions.push(
                    new Cesium.Cartographic(
                        Cesium.Math.lerp(p1.longitude, p2.longitude, i / (length - 1)),
                        Cesium.Math.lerp(p1.latitude, p2.latitude, i / (length - 1))
                    )
                );
            }

        }
        else {
            terrainSamplePositions = polylineCartographic;
        }
        if(terrainSamplePositions.length>0){
            for(let j=0;j<terrainSamplePositions.length;j++){
                //地理坐标（弧度）转经纬度坐标
                var cartographic = terrainSamplePositions[j];
                var height = cesium.scene.globe.getHeight(cartographic);
                var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
                polylinePath.push(point);
                //console.log(point);
            }
        }
    };

    handler.setInputAction(function(movement) {
        var position1;
        var cartographic;
        var ray = cesium.scene.camera.getPickRay(movement.position);
        if(ray)
            position1 = cesium.scene.globe.pick(ray,cesium.scene);
        if(position1)
            cartographic= Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
        if(cartographic){
            //海拔
            var height = cesium.scene.globe.getHeight(cartographic);
            //地理坐标（弧度）转经纬度坐标
            var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180,cartographic.latitude / Math.PI * 180,height);
            if (isDraw) {
                if(polyline)
                    polyline.path.pop();
                SurfaceLine(cartographic);
                let text="起点";
                if(polyline){
                    text=getDistance(polyline.path);
                }
                entities.push(cesium.entities.add({
                    position: point,
                    point: {
                        heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                        show: true,
                        color: Cesium.Color.SKYBLUE,
                        pixelSize: 3,
                        outlineColor: Cesium.Color.YELLOW,
                        outlineWidth: 1
                    },
                    label: {
                        text: text,
                        font: '12px sans-serif',
                        style : Cesium.LabelStyle.FILL,
                        outlineWidth : 1,
                        fillColor:Cesium.Color.WHITE,
                        showBackground:false,
                        backgroundColor:Cesium.Color.ORANGE.withAlpha(0.6),
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        pixelOffset: new Cesium.Cartesian2(5.0,-20.0),
                    }
                }));
            }
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function() {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        cesium.trackedEntity = undefined;
        isDraw = false;
        let pt = polylinePath[polylinePath.length-1];
        billboard=billboards.add({
            show : true,
            id:"measureTool",
            position : pt,
            pixelOffset : new Cesium.Cartesian2(0.0, 20),
            eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0),
            horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
            verticalOrigin : Cesium.VerticalOrigin.CENTER,
            scale : 1.0,
            image: '/imgs/icon-measure-close.png',
            color : new Cesium.Color(1.0, 1.0, 1.0, 1.0),
        });

        tooltip.style.display = "none";
        //关闭按钮执行事件
        handler.setInputAction(function(movement){
            var pickedObjects ={};
            pickedObjects=scene.drillPick(movement.position);
            if (Cesium.defined(pickedObjects)) {
                for (var i = 0; i < pickedObjects.length; i++)
                    if (pickedObjects[i].primitive == billboard){
                        cesium.entities.remove(polyline.lineEntity);
                        for(var j=0;j<entities.length;j++){
                            cesium.entities.remove(entities[j]);
                        }
                        entities=[];
                        billboards.remove(billboard);
                        polylinePath = [];
                        polyline = undefined;
                        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    }
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    //}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    //获取线段距离
    var getDistance=function(path){
        var Len = 0;
        var distance=0+'米';
        var cg, cs, x1, y1, x2, y2;
        for (let i = 0; i < path.length-1; i += 1) {
            cg = ellipsoid.cartesianToCartographic(path[i]);
            cs = WebMercatorProjection.project(cg);
            x1 = cs.x;
            y1 = cs.y;
            cg = ellipsoid.cartesianToCartographic(path[i+1]);
            cs = WebMercatorProjection.project(cg);
            x2 = cs.x;
            y2 = cs.y;
            Len = Len + Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
        }
        if(Len>0){
            distance=Len.toFixed(2)+'米'
        }
        if(Len/1000>=1){
            distance=(Len/1000).toFixed(2)+'公里';
        }
        return distance;
    }

};



//========================================================================
//========================================================================
//========================================================================
//========================================================================


//测量面积
export const measureArea2 = function (viewer) {
  let AllEnities = [];
  var tooltip = document.createElement("div");
  tooltip.style = "display:none;background-color:#000;position:absolute;font-size:12px;color:#fff;padding:5px";
  document.body.appendChild(tooltip);
  var isDraw = false;
  var polygonPath = [];
  var polygon = null;
  var handler = viewer.screenSpaceEventHandler;
  handler.setInputAction(function (movement) {

      //新增部分
      var position1;
      var cartographic;
      var ray = viewer.scene.camera.getPickRay(movement.endPosition);
      if (ray)
          position1 = viewer.scene.globe.pick(ray, viewer.scene);
      if (position1)
          cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
      if (cartographic) {
          //海拔
          var height = viewer.scene.globe.getHeight(cartographic);
          var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
          if (isDraw) {
              tooltip.style.left = movement.endPosition.x + 10 + "px";
              tooltip.style.top = movement.endPosition.y + 20 + "px";
              tooltip.style.display = "block";

              if (polygonPath.length < 2) {
                  return;
              }
              if (!Cesium.defined(polygon)) {
                  polygonPath.push(point);
                  polygon = new CreatePolygon(polygonPath, Cesium);
                  AllEnities.push(polygon);
              } else {
                  polygon.path.pop();
                  polygon.path.push(point);
                  AllEnities.push(polygon);
              }
              if (polygonPath.length >= 2) {
                  tooltip.innerHTML = '<p>双击确定终点</p>';
              }
          }
      }

  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(function (movement) {
      isDraw = true;
      //新增部分
      var position1;
      var cartographic;
      var ray = viewer.scene.camera.getPickRay(movement.position);
      if (ray)
          position1 = viewer.scene.globe.pick(ray, viewer.scene);
      if (position1)
          cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
      if (cartographic) {
          //海拔
          var height = viewer.scene.globe.getHeight(cartographic);
          var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
          if (isDraw) {
              polygonPath.push(point);
              var tmep = viewer.entities.add({
                  position: point,
                  point: {
                      show: true,
                      color: Cesium.Color.SKYBLUE,
                      pixelSize: 3,
                      outlineColor: Cesium.Color.YELLOW,
                      outlineWidth: 1
                  },
              });

              AllEnities.push(tmep);
          }
      }


  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function () {
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      if (polygonPath.length >= 2) {
          var label = String(countAreaInCartesian3(polygon.path));
          label = label.substr(0, label.indexOf(".", 0));
          var text;
          if (label.length < 6)
              text = label + "平方米";
          else {
              label = String(label / 1000000);
              label = label.substr(0, label.indexOf(".", 0) + 3);
              text = label + "平方公里"
          }

          var textArea = text;
          var lastpoint = viewer.entities.add({
              name: '多边形面积',
              position: polygon.path[polygon.path.length - 1],
              point: {
                  pixelSize: 5,
                  color: Cesium.Color.RED,
                  outlineColor: Cesium.Color.WHITE,
                  outlineWidth: 2,
                  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
              },
              label: {
                  text: textArea,
                  font: '18px sans-serif',
                  fillColor: Cesium.Color.GOLD,
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  pixelOffset: new Cesium.Cartesian2(20, -40)
              }
          });

          AllEnities.push(lastpoint);

      }

      viewer.trackedEntity = undefined;
      isDraw = false;
      tooltip.style.display = 'none';

  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  var CreatePolygon = (function () {
      function _(positions, cesium) {
          if (!Cesium.defined(positions)) {
              throw new Cesium.DeveloperError('positions is required!');
          }
          if (positions.length < 3) {
              throw new Cesium.DeveloperError('positions 的长度必须大于等于3');
          }

          this.options = {
              polygon: {
                  show: true,
                  hierarchy: undefined,
                  outline: true,
                  outlineColor: Cesium.Color.WHITE,
                  outlineWidth: 2,
                  material: Cesium.Color.YELLOW.withAlpha(0.4)
              }
          };
          this.path = positions;
          this.hierarchy = positions;
          this._init();
      }

      _.prototype._init = function () {
          var _self = this;
          var _update = function () {
              return _self.hierarchy;
          };
          //实时更新polygon.hierarchy
          this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
          var oo = viewer.entities.add(this.options);
          AllEnities.push(oo);
      };

      return _;
  })();

  //微元法求面积
  var countAreaInCartesian3 = function (ps) {
      var s = 0;
      for (var i = 0; i < ps.length; i++) {
          var p1 = ps[i];
          var p2;
          if (i < ps.length - 1)
              p2 = ps[i + 1];
          else
              p2 = ps[0];
          s += p1.x * p2.y - p2.x * p1.y;
      }
      return Math.abs(s / 2);
  }
}

export const PointFlicker = (data) => {
  let viewer = window.dsCesium.viewer;
  let Cesium = window.dsCesium.Cesium
  
  // viewer.entities.removeById("PointFlicker")
  //debugger
  let r1 = data.minR, r2=data.minR
        function changeR1() {
            r1 = r1 + data.deviationR
            if(r1 >= data.maxR){
                r1 = data.minR
            }
            return r1;
        }
        function changeR2() {
            r2 = r2 + data.deviationR
            if(r2 >= data.maxR){
                r2 = data.minR
            }
            return r2
        }
        viewer.entities.add({
            name: "",
            id: data.id[0],
            position: Cesium.Cartesian3.fromDegrees(data.lon,data.lat,data.height),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(changeR1,false),
                semiMajorAxis: new Cesium.CallbackProperty(changeR1,false),
                height: data.height,
                material: new Cesium.ImageMaterialProperty({
                    image: data.imageUrl,
                    repeat: new Cesium.Cartesian2(1.0, 1.0),
                    transparent: true,
                    color: new Cesium.CallbackProperty(function () {
                        return Cesium.Color.WHITE.withAlpha(1-r1/data.maxR)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
                    },false)
                })
            }
        })
        setTimeout(() => {
            viewer.entities.add( {
                name: "",
                id: data.id[1],
                position: Cesium.Cartesian3.fromDegrees(data.lon,data.lat,data.height),
                ellipse: {
                    semiMinorAxis: new Cesium.CallbackProperty(changeR2,false),
                    semiMajorAxis: new Cesium.CallbackProperty(changeR2,false),
                    height: data.height,
                    material: new Cesium.ImageMaterialProperty({
                        image: data.imageUrl,
                        repeat: new Cesium.Cartesian2(1.0, 1.0),
                        transparent: true,
                        color: new Cesium.CallbackProperty(function () {
                            return Cesium.Color.WHITE.withAlpha(1-r1/data.maxR)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
                        },false)
                    })
                }
            })
        },data.eachInterval)
}

import { getLevel } from "@/util/ds.common.js"
export const loadMapInterfaceEvent =(viewer,vm) =>{
  viewer.getActualMapInfo((obj=>{
    vm.mapObj.info = `${obj.lng}   ${obj.lat}   ${obj.height}`;
    //{viewerHeight: "视角海拔高度:2156219.39米", height: "海拔:-34.81米", lng: "经度:103.868429", lat: "纬度:42.586148"}
  }))
// 左键按钮点击
viewer.evLeftDown({isPick:true},(position, entity, pick)=>{
  const ray = viewer.camera.getPickRay(position);
  const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  if (cartesian) {
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    if (cartographic) {
      var xy = new Cesium.Cartesian2();
      var alti = viewer.camera.positionCartographic.height;
      var level = getLevel(alti);
        for(let x=0, res= Object.values(viewer._layer); x < res.length; x++) {
          let provider = res[x].imageryProvider;
          if(provider.ready){
          xy = provider.tilingScheme.positionToTileXY(cartographic, level, xy);
          let promise = provider.pickFeatures(xy.x, xy.y, level, cartographic.longitude, cartographic.latitude);
          Cesium.when(promise, (data)=> {
            if(data && data.length>0 && data[0].properties && data[0].properties.NAME){
              viewer._popupLayer.show(position,{
              title:`<span class='popupTitle'> &nbsp;</span>`,
              content:`
                <div class="popupContent" id="popupContent_ea" ref="popupContent_ea">
                  <table>
                    <tr><td>名称</td><td>${data[0].properties.NAME}</td></tr>
                    <tr><td>地址</td><td>${data[0].properties.ADDRESS}</td></tr>
                  </table>
                </div>
              `
            })
            }
          });
        }
        }
    }
  }

  if(entity && entity.extInfo){
    vm.popupObj = entity.extInfo;
    vm.$nextTick(()=>{
      viewer._popupLayer.show(position,{
        title:`<span class='popupTitle'>${entity.extInfo.address}</span>`,
        content:vm.$refs.popupContent_ea.outerHTML
      })
    })
  }else {
      viewer._popupLayer.hidden()
  }
})
}

export const loadAreacodeLine =  function(viewer,vm){
    //加载省界地图
    //Cesium.GeoJsonDataSource.load('../www/data/guangxi.geojson').then(function (dataSource) {
    //    viewer.dataSources.add(dataSource);
        // viewer.zoomTo(dataSource, {
        //     heading: Cesium.Math.toRadians(0.0), //旋转角度
        //     pitch: Cesium.Math.toRadians(-70.0), //倾斜角度
        //     range: 2000000.0 //距离中心的距离
        // });
        // var entities = dataSource.entities.values;
        // for (var i = 0; i < entities.length; i++) {
        //     var entity = entities[i];
        //     entity.polygon.outline = true;
        //     entity.polygon.outlineWidth = 2.0;
        //     entity.polygon.material = true;
        //     entity.polygon.outlineColor = Cesium.Color.YELLOW.withAlpha(0.8);
        //     entity.polygon.fill = false;
        //     entity.polygon.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
        //     entity.options.camera = that.viewer.scene.camera;
        //     entity.options.canvas = that.viewer.scene.canvas;
        //     entity.options.clampToGround = true;
        //     entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        // }
    //});
}