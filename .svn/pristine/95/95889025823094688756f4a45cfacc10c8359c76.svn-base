
export default {
  dialogObj: {
    state: false,
    title: "新增",
    width: "650px",
    type: "add"
  },
  elForm: {
    url:"/mock/addUser.json",
    params:{},
    type:"pagingGet",
    submitError:"您有一个或多个字段数据未通过验证!!!",
    style:{"text-align":"left"},
    labelWidth: "80px",
    column: [
      //缺： 省市县下拉级联
      { key:"deptCode", value:"部门", 
      wholeLine:false,
      style:{"width":"calc(100% - 10px)"},
      type:"ddl", 
      placeholder:"请选择部门" , 
      rtype:"pagingGet" ,url:"/mock/dept.json" ,
      DTEXT:"deptName",DVALUE:"id"},
      { key:"job", value:"职位", type: "ddl", 
      data:[{id:"1",name:"后勤保障部"},{id:"2",name:"安全部门"}],
      DTEXT:"name",DVALUE:"id"},
      { key:"name", value:"姓名", type: "input"},
      { key:"sex", value:"性别", type: "radio", 
      default: 1, data:[{id:"1",name:"男"},{id:"2",name:"女"}],
      DTEXT:"name",DVALUE:"id"},
      { key:"contact", value:"手机号", type:"input", state:false},
      { key:"email", value:"电子邮箱", type:"input", state:false},
      { key: "createDate", value:"创建时间", type: "datetime"},
      { key: "product", value:"生产日期", type: "datetime"},
      { key: "cityCode", value:"省市",default:"350000",
      data:window.$areacode.province, 
      type:"tree",callback:(v,obj)=>{
        // console.log(v)
      }},
      // { key: "year", value:"年度", type: "checkbox",  data:[{id:1,name:"2017"},{id:2,name:"2018"}],DTEXT:"name",DVALUE:"id"},
      { key: "-",value:"-", type: "divider", style:{'border-bottom-color':'red'}},
      { key: "isuse", value:"启用",default: false, type: "switch", callback:(v,obj)=>{
        if(v){
          obj.state.contact = true;
          obj.state.email = true;
        } else {
          obj.state.contact = false;
          obj.state.email = false;
        }
      }},
      // { key: "file", value:"文件", type: "uploadfile", default: []},
      // { key: "img", value:"图片", type: "uploadimg", wholeLine:true},
      { key: "remark", value:"备注", type: "textarea", wholeLine:false, style:{"width":"calc(100% - 30px)"}},
      { key:"", value:"操作", operate:[  
        { type:'submit',btnType:"primary", name:'确认', isExp:true },
        { type:'clear', name:'重置'},
        { type:'cancel', name:'取消' }
      ]}
    ],
    rules:{
      name: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ],
      contact: [
        { required: true, message: '请选择活动区域', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请选择日期', trigger: 'blur' }
      ],
    }
  }
}