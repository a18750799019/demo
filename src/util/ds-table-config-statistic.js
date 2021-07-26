export default {
  style: {
    align: "center",
    fixed: false,
    width: 130
  },
  isIndex:true,
  isCheckbox: false,
  loading: false,
  title:"表单配置",
  total:0,
  currentPage:1,
  pageSize:10,
  noHeader: true,
  searchBtns:[],
  noSearchClickBtn:true,
  formStyle:{
    height:"422px"
  },
  treeObj:{
    state: false
  },
  optBtns: [{
    name:"新增",
    value:"add",
    type:"primary"
  },{
    name:"导入",
    value:"edit",
    type:"info"
  },{
    name:"导出",
    value:"edit",
    type:"info"
  }],
  headerColumns:[
    { key:"co1", value:"市"},
    { key:"co2", value:"县区"},
    { key:"co3", value:"街道乡镇"},
    { key:"ha01", value:"烈度",width:60, formatter:(value)=>{
      let _res ="";
      switch (value) {
        case 6:
          _res = "Ⅵ";
          break;
        case 7:
          _res = "Ⅶ";
          break;
        case 8:
        _res = "Ⅷ";
        break;
        case 9:
        _res = "Ⅸ";
        break;
        case 10:
        _res = "Ⅹ";
        break;
        case 11:
        _res = "Ⅺ";
        break;
        default:
        _res = "";
          break;
      }
      return _res;
    }},
    { key:"ha02", value:"死亡人数(人)"},
    { key:"ha03", value:"受伤人数(人)"},
    { key:"ha04", value:"房屋倒塌面积(m²)",width:"150"}
  ],
  postData: {},
  method: "pagingPost", 
  initSuccessCallback:null,
  //初始化对象映射
  initMappingObj: {
    total: "records",
    list: "rows",
    pageSize: "rows",
    currentPage: "page"
  }
}