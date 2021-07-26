// 创建弹窗对象的方法
var Popup = function(info, contentObj){
  this.constructor(info);
  this._contentObj = contentObj;
}
Popup.prototype.id=0;
Popup.prototype.constructor = function(info){
  var _this = this;
  _this.viewer = info.viewer;//弹窗创建的viewer
  _this.geometry = info.geometry;//弹窗挂载的位置
  this.ctn=document.createElement('div');
  this.ctn.className='ds-popup-ctn';
  this.ctn.id = "ds_popup_" +_this.__proto__.id++;
  _this.viewer.container.appendChild( _this.ctn);
  //测试弹窗内容
  var testConfig = Object.assign({
      header:"测试数据",
      content:"<div>测试窗口</div>",
  },_this._contentObj)
  _this.ctn.innerHTML= _this.createHtml(testConfig);

  document.getElementById("ds-popup-close-button").addEventListener("click",function(){
    _this.removePanel()
  })
  
  _this.render(_this.geometry);
  _this.eventListener = _this.viewer.clock.onTick.addEventListener(function(clock) {
      _this.render(_this.geometry);
  })
}

// 实时刷新
Popup.prototype.render = function(geometry){
  var _this = this;
  var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(_this.viewer.scene,geometry)
  _this.ctn.style.left = (position.x- _this.ctn.offsetWidth/2)  + "px";
  _this.ctn.style.top = (position.y- _this.ctn.offsetHeight/2 - 10) + "px";
}
// 动态生成内容
Popup.prototype.createHtml = function(contentObj){
      var html = `
        <div class="ds-popup-header-ctn">
          ${contentObj.header}
          <img id="ds-popup-close-button" src="/imgs/icon-popup-close.png" />
        </div>
        <div class="ds-popup-content-ctn">
         <div class="ds-popup-content" >
          ${contentObj.content}
         </div>
        </div>
        <div class="ds-popup-tip-container">
          <div class="ds-popup-tip" ></div>
        </div>
      `
  return html;
}
// 关闭弹窗按钮
Popup.prototype.removePanel=function(){
  var _this = this;
  _this.ctn.remove();
  _this.viewer.clock.onTick.removeEventListener( _this.eventListener );
}

Popup.prototype.close = function(){
  document.getElementById("ds-popup-close-button").click();
}

Popup.prototype.hidden = function(){
  var _this = this;
  _this.ctn.style.display ="none";
  _this.viewer.clock.onTick.removeEventListener( _this.eventListener );
}

Popup.prototype.show = function(){
  var _this = this;
  _this.ctn.style.display ="block";
  _this.eventListener = _this.viewer.clock.onTick.addEventListener(function(clock) {
    _this.render(_this.geometry);
})
}

export default Popup