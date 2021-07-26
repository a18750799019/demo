export default {
  style: {
    align: "center",
    fixed: false,
    width: 220,
    stripe: false
  },
  paginationStyle:{
    "margin-top":"10px"
  },
  isNoIndex:false,
  isCheckbox: true,
  loading: true,
  title:"表单配置",
  total:0,
  currentPage:1,
  pageSize:10,
  noHeader: true,
  searchBtns:[ 
    { key:"name", value:"姓名", type: "input"},
    { key:"deptCode", value:"部门", type:"ddl", placeholder:"请选择部门"  ,DTEXT:"deptName",DVALUE:"id"}],
  searchBtnExp: true, //是否搜索事件外部处理
  noSearch:false, 
  noSearchClickBtn:false,
  // formStyle:{
  //   height:"422px"
  // },
  //左侧树配置项
  treeObj:{
    state: false,
    data:window.$areacode.province,
    nodeKey:"areacode",
    expandAll: false,
    defaultExpandedKeys:["350100"],
    props: {
      label:"name"
    }
  },
  optBtnsInSearch:[{
    name:"新增",
    type:"add",
    btnType:"primary",
    isExp:true
  },],
  optBtns: [{
    name:"新增",
    type:"add",
    btnType:"primary",
    isExp:true
  },{
    name:"导入",
    type:"import",
    btnType:"info",
    isExp:true
  },{
    name:"导出",
    type:"export",
    btnType:"info",
    isExp: true
  }],
  headerColumns:[
    { key:"deptCode", value:"部门", isReference: true ,type:"pagingGet" ,url:"/mock/dept.json",DTEXT:"deptName",DVALUE:"id"},
    { key:"job", value:"职位", isReference: true, data:[{id:"1",name:"救援人员"},{id:"2",name:"后勤人员"}],DTEXT:"name",DVALUE:"id"},
    { key:"name", value:"姓名"},
    { key:"sex", value:"性别",vhtml: true, formatter:(value)=>{
      if(value == 1) {
        return "<span style='color:#9615f7'>男</span>"
      }else {
        return "<span style='color:red'>女</span>"
      }
    }},
    { key:"contact", value:"手机号"},
    { key:"email", value:"电子邮箱"},
    { key:"", value:"操作", operate:[  //返回点击事件operateHandle(row, type)
      { type:'edit', name:'修改',isExp:true },
      { type:'del', name:'删除' ,isExp:true, style:{ color:"red" } }
    ]}
  ],
  //url:"http://192.168.1.234:31349/api/user/list?isDel=0&enable=0",
  url:"/mock/user.json",
  method: "pagingGet", //pagingGet(default) | pagingPost
  postData: {},
  initSuccessCallback:null,
  //初始化对象映射
  initMappingObj: {
    total: "records",
    list: "rows",
    pageSize: "pageSize",
    currentPage: "currentPage"
  }
}