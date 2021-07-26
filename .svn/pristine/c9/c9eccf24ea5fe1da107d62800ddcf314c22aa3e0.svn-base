export default {
  style: {
    align: "center",
    fixed: false,
    width: 188
  },
  paginationStyle:{
    "margin-top":"15px"
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
  // formStyle:{
  //   height:"422px"
  // },
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
    { key:"account", value:"用户名"},
    { key:"name", value:"姓名"},
    { key:"sexLabel", value:"性别",width:50},
    { key:"cityLabel", value:"所属市"},
    { key:"countyLabel", value:"所属县区"},
    { key:"deptName", value:"所属部门"},
    { key:"jobLabel", value:"工作岗位"},
    { key:"contact", value:"手机号"},
    { key:"email", value:"邮箱"},
    { key:"updateDate", value:"更新时间"},
    { key:"", value:"操作", width: 120, operate:[  //返回点击事件operateHandle(row, type)
      { type:'edit', name:'修改' },
      { type:'del', name:'删除', style:{ color:"red" } }
    ]}
  ]
}