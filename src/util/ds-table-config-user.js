export default {
  style: {
    align: "center",
    fixed: false,
    width: 120
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
    { key:"deptName", value:"部门"},
    { key:"jobLabel", value:"工作岗位"},
    { key:"name", value:"姓名"},
    { key:"sexLabel", value:"性别",width:50},
    { key:"contact", value:"手机号"},
    { key:"email", value:"电子邮箱",width:140},
    { key:"", value:"操作", width: 120, operate:[  //返回点击事件operateHandle(row, type)
      { type:'edit', name:'修改' },
      { type:'del', name:'删除', style:{ color:"red" } }
    ]}
  ]
}