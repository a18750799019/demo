export default {
  style: {
    align: "center",
    fixed: false,
    width: 180
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
    { key:"name", value:"部门"},
    { key:"jobLabel", value:"工作岗位"},
    { key:"num", value:"现有人员"},
    { key:"", value:"操作", width: 220, operate:[  //返回点击事件operateHandle(row, type)
      { type:'edit', name:'修改' },
      { type:'add', name:'新增人员' },
      { type:'show', name:'查看人员' },
      { type:'del', name:'删除', style:{ color:"red" } }
    ]}
  ]
}