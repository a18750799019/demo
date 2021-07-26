<template>
  <div class="sysContainer">
    <div class="sysCont">
      <el-tabs v-model="activeName"  type="card">
        <el-tab-pane label="部门及联系人管理" name="first">
            <div class="depTree inline-block">
              <el-tree 
                :data="treeDeptData" 
                :props="defaultProps" 
                default-expand-all
                node-key="label"
                :check-on-click-node="true"
                :expand-on-click-node="false"
                :highlight-current="true"
                @node-click="handleNodeClick"></el-tree>
            </div>
            <div class="inline-block deptFrom" style="padding-top:5px;">
              <form-config 
                @operateHandle="deptOperateHandle"
                @handleSizePageChange="deptHandleSizePageChange"
                :tableData="depObj.list" :tableConf="depObj.tableConf">
                <div slot="search_after">
                  <el-input style="width:310px;" v-model="depObj.sInpit" placeholder="输入查询条件" class="searchCondition"  ></el-input>
                  &nbsp;&nbsp;<el-button class="searchButton" @click="deptOperateHandle(null,'search')">查询</el-button>
                  <el-button class="addSection" @click="deptOperateHandle(null,'addTop')">新增部门</el-button>
                </div>
              </form-config>
            </div>
            <div class="inline-block userForm" style="padding-top:5px;">
              <form-config 
                @operateHandle="userOperateHandle"
                @handleSizePageChange="userHandleSizePageChange"
                :tableData="userObj.list" :tableConf="userObj.tableConf">
                <div slot="search_after">
                  <el-select class="citySelect"  v-model="areacode.cityLabel" @change="changeProvind($event,'areacodeCity')" placeholder="所属市">
                  
                  <el-option
                    v-for="item in areacode.city"
                    :key="item.areacode"
                    :label="item.name"
                    :value="item.areacode">
                  </el-option>
                </el-select>
                <el-select class="countrySelect"  v-model="areacode.townLabel" placeholder="所属县区">
                  <el-option
                    v-for="item in areacode.town"
                    :key="item.areacode"
                    :label="item.name"
                    :value="item.areacode">
                  </el-option>
                </el-select>
                <el-select class="sectionSelect"  v-model="areacode.deptLabel"  placeholder="部门">
                  <el-option
                    v-for="item in areacode.dept"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select class="positionSelect"  v-model="areacode.jobsLabel" placeholder="岗位">
                 
                  <el-option
                    v-for="item in areacode.jobs"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input style="width:100px;" v-model="areacode.name" placeholder="输入姓名" class="nameInput"></el-input>
                &nbsp;&nbsp;
                <el-button class="search" @click="userOperateHandle(null,'search')">查询</el-button>
                </div>
              </form-config>
            </div>

        </el-tab-pane>
        <el-tab-pane label="系统用户" name="second">
          <div style="height:calc(100vh - 100px);">
            <form-config 
              @operateHandle="sysUserOperateHandle"
              @handleSizePageChange="sysUserHandleSizePageChange"
              :tableData="sysUserObj.list" :tableConf="sysUserObj.tableConf">
              <div slot="search_after">
                <el-input clearable=true placeholder="用户名" v-model="sysUserObj.sUsername" style="width:310px;height:30px;"  class="searchButton"></el-input>
                &nbsp;<el-button class="searchButton" @click="sysUserOperateHandle(null,'search')" >查询</el-button>
                <el-button @click="sysUserOperateHandle(null,'add')" class="addUser">新增用户</el-button>
              </div>
            </form-config>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 新增部门 -->
    <dialog-panel
    class="deptDialog"
    :dialogVisible="dialogDeptObj.state"
    :title="dialogDeptObj.title"
    :width="dialogDeptObj.width"
    @close="closeDeptObjReceive"
  >
    <el-form :model="dialogDeptObj" ref="dialogDeptObjForm"  :rules="dialogDeptObj.rules" style="padding:10px 10px 5px 0;" label-width="70px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属市">
          <el-select v-model="dialogDeptObj.areacode.cityLabel" @change="changeProvind($event,'dialogDeptObjCity')" placeholder="所属市">
            <el-option
              v-for="item in dialogDeptObj.areacode.city"
              :key="item.areacode"
              :label="item.name"
              :value="item.areacode">
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
            <el-form-item label="所属县">
              <el-select v-model="dialogDeptObj.areacode.townLabel" placeholder="所属县">
                <el-option
                  v-for="item in dialogDeptObj.areacode.town"
                  :key="item.areacode"
                  :label="item.name"
                  :value="item.areacode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
          <el-col :span="24">
            <el-form-item label="部门" prop="deptLabel">
            <el-input v-show="dialogDeptObj.opt=='add'" placeholder="部门名称" v-model="dialogDeptObj.areacode.deptLabel"></el-input>
            <el-select filterable default-first-option allow-create v-if="dialogDeptObj.opt=='edit'" v-model="dialogDeptObj.areacode.deptLabel"  placeholder="部门">
              <el-option
                v-for="item in dialogDeptObj.areacode.dept"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作岗位">
              <el-select v-model="dialogDeptObj.areacode.jobsLabel"  placeholder="选择岗位">
                <el-option
                  v-for="item in dialogDeptObj.areacode.jobs"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
    </el-form>
    <div style="text-align:center;">
      <el-button class="confirm" style="background:#0099FF;color:#fff;" type="primary" @click="addSubmitDept()">确认</el-button>&nbsp;&nbsp;
      <el-button class="cancel" style="background:#F8B551;color:#fff;" type="info" @click="closeDeptObjReceive()">取消</el-button>
    </div>
  </dialog-panel>
  <!-- 新增人员 -->
  <dialog-panel
    class="userDialog"
    :dialogVisible="dialogUserObj.state"
    :title="dialogUserObj.title"
    :width="dialogUserObj.width"
    @close="closeUserObjReceive"
  >
    <el-form 
    :rules="dialogUserObj.rules"
    :model="dialogUserObj"
    ref="dialogUserObjRuleForm"
    style="padding:10px 10px 5px 0;" label-width="70px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
          <el-input v-model="dialogUserObj.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" >
              <el-radio 
              v-for="item in $config.sexType"
              v-model="dialogUserObj.sex" :label="item.value">{{item.text}}</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属市">
          <el-select v-model="dialogUserObj.areacode.cityLabel" @change="changeProvind($event,'dialogUserObjCity')" placeholder="所属市">
            <el-option
              v-for="item in dialogUserObj.areacode.city"
              :key="item.areacode"
              :label="item.name"
              :value="item.areacode">
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属县">
            <el-select v-model="dialogUserObj.areacode.townLabel" placeholder="所属县">
              <el-option
                v-for="item in dialogUserObj.areacode.town"
                :key="item.areacode"
                :label="item.name"
                :value="item.areacode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门">
          <el-select v-model="dialogUserObj.areacode.deptLabel"  placeholder="部门">
            <el-option
              v-for="item in dialogUserObj.areacode.dept"
              :key="item.id"
              :label="item.name"
              :value="item.id+''">
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作岗位">
            <el-select v-model="dialogUserObj.areacode.jobsLabel" placeholder="岗位">
              <el-option
                v-for="item in dialogUserObj.areacode.jobs"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="dialogUserObj.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱"  prop="mail">
            <el-input auto-complete="off" v-model="dialogUserObj.mail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="启用用户">
            <el-radio v-model="dialogUserObj.useUser" label="0">是</el-radio>
            <el-radio v-model="dialogUserObj.useUser" label="1">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogUserObj.useUser =='0'">
          <el-form-item label="用户名">
            <el-input v-model="dialogUserObj.username"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row v-if="dialogUserObj.useUser =='0'">
        <el-col :span="12">
          <el-form-item label="密码">
            <el-input v-model="dialogUserObj.pwd"  type="password" style="position:fixed;bottom:-9999px;display:none;"></el-input>
            <el-input type="password" v-model="dialogUserObj.pwd"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重复密码">
            <el-input type="password" v-model="dialogUserObj.repwd"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:center;">
      <el-button class="confirm" style="background:#0099FF;color:#fff;" type="primary" @click="addSubmitUser()">确认</el-button>&nbsp;&nbsp;
      <el-button class="cancel" style="background:#F8B551;color:#fff;" type="info" @click="closeUserObjReceive()">取消</el-button>
    </div>
  </dialog-panel>
  <!-- 新增系统用户 -->
  <dialog-panel
      class="sysUserDialog"
      :dialogVisible="dialogSysUserObj.state"
      :title="dialogSysUserObj.title"
      :width="dialogSysUserObj.width"
      @close="closeSysUserObjReceive"
    >
    <el-form 
      :rules="dialogSysUserObj.rules"
      :model="dialogSysUserObj"
      ref="dialogSysUserObjRuleForm"
      style="padding:10px 10px 5px 0;" label-width="70px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
          <el-input v-model="dialogSysUserObj.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
          <el-input v-model="dialogSysUserObj.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio 
              v-for="item in $config.sexType"
              v-model="dialogSysUserObj.sex" :label="item.value">{{item.text}}</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户级别">
              <el-radio v-model="dialogSysUserObj.level" label="1">普通</el-radio>
              <el-radio v-model="dialogSysUserObj.level" label="0">最高</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属市">
          <el-select v-model="dialogSysUserObj.areacode.cityLabel" @change="changeProvind($event,'dialogSysUserObjCity')" placeholder="所属市">
            <el-option
              v-for="item in dialogSysUserObj.areacode.city"
              :key="item.areacode"
              :label="item.name"
              :value="item.areacode">
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属县">
            <el-select v-model="dialogSysUserObj.areacode.townLabel" placeholder="所属县">
              <el-option
                v-for="item in dialogSysUserObj.areacode.town"
                :key="item.areacode"
              :label="item.name"
              :value="item.areacode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门">
          <el-select v-model="dialogSysUserObj.areacode.deptLabel"  placeholder="部门">
            <el-option
              v-for="item in dialogSysUserObj.areacode.dept"
              :key="item.id"
              :label="item.name"
              :value="item.id+''">
            </el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位">
            <el-select v-model="dialogSysUserObj.areacode.jobsLabel"  placeholder="岗位">
              <el-option
                v-for="item in dialogSysUserObj.areacode.jobs"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="dialogSysUserObj.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="dialogSysUserObj.mail"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="dialogSysUserObj.pwd" type="password" style="position:fixed;bottom:-9999px;display:none;"></el-input>
            <el-input v-model="dialogSysUserObj.pwd" type="password" autocomplete="new-password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重复密码" prop="repwd">
            <el-input type="password" autocomplete="new-password" v-model="dialogSysUserObj.repwd" placeholder="请再次输入密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="text-align:center;">
      <el-button class="confirm" style="background:#0099FF;color:#fff;" type="primary" @click="addSubmitSysUser()">确认</el-button>&nbsp;&nbsp;
      <el-button class="cancel" style="background:#F8B551;color:#fff;" type="info" @click="closeSysUserObjReceive()">取消</el-button>
    </div>
  </dialog-panel>

  </div>
</template>
<script>
import { businessApi } from "@/api";
import formConfig from "@/_sys_components/formConfig"
import depTableConf from "@/util/ds-table-config-dept.js"
import userTableConf from "@/util/ds-table-config-user.js"
import sysUserTableConf from "@/util/ds-table-config-sysUser.js"
import dialogPanel from "@/_sys_components/dialog"
import { pwdEncrypt } from "@/util/ds.common";
export default {
  components:{
    formConfig,
    dialogPanel
  },
  data(){
    return {
      activeName:"first",
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeDeptData:[],
      dialogDeptObj:{
        state: false,
        title:"新增部门",
        width:"350px",
        editId:0,
        opt:"add",
        pageIndex:1,
        pageSize:10,
        areacode:{
          city:[],
          cityLabel:"",
          town:[],
          townLabel:"",
          dept:[],
          deptLabel:"",
          deptLabel2:"",
          jobs:[],
          jobsLabel:""
        },
        rules: {
          deptLabel: [ {  }]
        }
      },
      dialogUserObj:{
        rules:{
          name:[{required: true, message: '姓名不允许为空', trigger: 'blur'}],
          phone:[{validator:(rule, value,callback)=>{
            if(value!==""){
              if(!(/^1[3456789]\d{9}$/.test(value))){
                callback(new Error('请输入正确的11位手机号码'))
              }
            }else{
              callback()
            }
          }, trigger: ['blur', 'change']}],
          mail:[{type:"email", message: '填写正确的邮箱格式', trigger: 'blur'}],
          pwd: [
            { validator: (rule, value, callback)=>{
              if(this.dialogUserObj.useUser==0){
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                } else if (value !== this.dialogUserObj.pwd) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
              }
              
            }, trigger: 'blur' }],
          repwd: [
            { validator: (rule, value, callback)=>{
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (value !== this.dialogUserObj.pwd) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            }, trigger: 'blur' }
          ],
        },
        state: false,
        title:"新增人员",
        width:"650px",
        editId:0,
        opt:"add",
        pageIndex:1,
        pageSize:10,
        areacode:{
          city:[],
          cityLabel:"",
          town:[],
          townLabel:"",
          dept:[],
          deptLabel:"",
          jobs:[],
          jobsLabel:""
        },
        username:"",
        sex:"1",
        name:"",
        phone:"",
        mail:"",
        pwd:"",
        repwd:"",
        useUser: "1"
      },
      dialogSysUserObj:{
        rules:{
          username:[{required: true, message: '用户名不允许为空', trigger: 'blur'}],
          name:[{required: true, message: '姓名不允许为空', trigger: 'blur'}],
          phone:[{validator:(rule, value,callback)=>{
            if(value!==""){
              if(!(/^1[3456789]\d{9}$/.test(value))){
                callback(new Error('请输入正确的11位手机号码'))
              }
            }else{
              callback()
            }
          }, trigger: ['blur', 'change']}],
          mail:[{type:"email", message: '填写正确的邮箱格式', trigger: 'blur'}],
          pwd:[{required: true, message: '密码不能为空', trigger: 'blur'}],          
          repwd: [
            { validator: (rule, value, callback)=>{
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (value !== this.dialogUserObj.pwd) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            }, trigger: 'blur' }
          ],
        },
        state: false,
        title:"新增系统用户",
        width:"650px",
        editId:0,
        opt:"add",
        pageIndex:1,
        pageSize:10,
        areacode:{
          city:[],
          cityLabel:"",
          town:[],
          townLabel:"",
          dept:[],
          deptLabel:"",
          jobs:[],
          jobsLabel:""
        },
        name:"",
        username:"",
        level:"1",
        sex:"1",
        phone:"",
        mail:"",
        pwd:"",
        repwd:"",
      },
      depObj:{
        list:[],
        tableConf:depTableConf,
        sInpit:""
      },
      userObj:{
        list:[],
        tableConf:userTableConf
      },
      sysUserObj:{
        list:[],
        tableConf:sysUserTableConf,
        sUsername:""
      },
      areacode:{
        city:[],
        cityLabel:"",
        town:[],
        townLabel:"",
        dept:[],
        deptLabel:"",
        jobs:[],
        jobsLabel:"",
        name:""
      }
    }
  },
  mounted(){
    this.dialogDeptObj.areacode.city = this.$areacode.province[0].city;
    this.dialogUserObj.areacode.city = this.$areacode.province[0].city;
    this.dialogSysUserObj.areacode.city = this.$areacode.province[0].city;
    this.areacode.city = this.$areacode.province[0].city;

  this.areacode.jobs = this.$config.jobsType;
  this.dialogDeptObj.areacode.jobs = this.$config.jobsType;
  this.dialogUserObj.areacode.jobs = this.$config.jobsType;
  this.dialogSysUserObj.areacode.jobs = this.$config.jobsType;

  this.bindDept(data=>{
    this.areacode.dept = data.rows;
    this.areacode.deptLabel = data.name;
    this.dialogUserObj.areacode.dept = data.rows;
    this.dialogSysUserObj.areacode.dept = data.rows;
    this.dealDeptTree(data.rows);
  })
    this.getDeptUser();
    this.getUser();
    this.getSysUser();
  },
  methods:{
    handleClear(){
      this.areacode.cityLabel=''
      this.areacode.townLabel=''
      this.areacode.deptLabel=''
      this.areacode.jobsLabel=''
      this.areacode.name=''
    },
    handleNodeClick(data,node){
      if(data.areacode){
         this.getDeptUser({
          page:this.dialogDeptObj.pageIndex,
          rows:this.dialogDeptObj.pageSize,
          cityCode: data.areacode
        })
        this.getUser({
          cityCode: data.areacode,
          page: this.dialogUserObj.pageIndex,
          rows:this.dialogUserObj.pageSize
        })
        return;
      }
      this.getUser({
        deptCode: node.data.pid,
        page: this.dialogUserObj.pageIndex,
        rows:this.dialogUserObj.pageSize
      })
      this.getDeptUser({
          page:this.dialogDeptObj.pageIndex,
          rows:this.dialogDeptObj.pageSize
        })
    },
    changeProvind(value,type){
      switch (type) {
        case "areacodeCity":
          this.areacode.townLabel ="";
          for(let i=0;i<this.areacode.city.length;i++){
            if(this.areacode.city[i].areacode==this.areacode.cityLabel){
                this.areacode.town= this.areacode.city[i].county;
                return;
            }
          }
          break;
        case "dialogDeptObjCity":
          this.dialogDeptObj.areacode.townLabel ="";
          for(let i=0;i<this.dialogDeptObj.areacode.city.length;i++){
            if(this.dialogDeptObj.areacode.city[i].areacode==this.dialogDeptObj.areacode.cityLabel){
                this.dialogDeptObj.areacode.town= this.dialogDeptObj.areacode.city[i].county;
                return;
            }
          }
          break;
        case "dialogUserObjCity":
          this.dialogUserObj.areacode.townLabel ="";
          for(let i=0;i<this.dialogUserObj.areacode.city.length;i++){
            if(this.dialogUserObj.areacode.city[i].areacode==this.dialogUserObj.areacode.cityLabel){
                this.dialogUserObj.areacode.town= this.dialogUserObj.areacode.city[i].county;
                return;
            }
          }
          break;
        case "dialogSysUserObjCity":
          this.dialogSysUserObj.areacode.townLabel ="";
          for(let i=0;i<this.dialogSysUserObj.areacode.city.length;i++){
            if(this.dialogSysUserObj.areacode.city[i].areacode==this.dialogSysUserObj.areacode.cityLabel){
                this.dialogSysUserObj.areacode.town= this.dialogSysUserObj.areacode.city[i].county;
                return;
            }
          }
          break;
      }
    },
    getDeptUser(params){
      businessApi.getDeptUserList({
        url:this.$api.depUser,
        params
      }).then(data=>{
        this.depObj.list = data.rows.filter(_=>{
          let jobLabels = this.$config.jobsType.find(x=>_.job==x.value);
          _.jobLabel = jobLabels? jobLabels.text: _.job;
          return _;
        });
        this.depObj.tableConf.total=data.records;
      })
    },
    getUser(params){
      businessApi.getUserList({
        url:this.$api.user,
        params
      }).then(data=>{
        this.userObj.list = data.rows.filter(_=>{
          //绑定部门
         this.bindDept(data=>{
           let _res = data.rows.find(x=>x.id == _.deptCode);
           _.deptName = _res?_res.name:_.deptCode;
         })
         //绑定性别
         let _sex = this.$config.sexType.find(x=>x.value==_.sex);
         _.sexLabel = _sex?_sex.text: _.sex;
        //绑定工作岗位
         let _job = this.$config.jobsType.find(x=>x.value==_.job);
         _.jobLabel = _job?_job.text: _.job;

         return _;
        });
        this.userObj.tableConf.total=data.records;
      })
    },
    getSysUser(params){
      businessApi.getSysUserList({
        url:this.$api.sysUser,
        params
      }).then(data=>{
        this.sysUserObj.list = data.rows.filter(_=>{
           //绑定部门
         this.bindDept(data=>{
           let _res = data.rows.find(x=>x.id == _.deptCode);
           _.deptName = _res?_res.name:_.deptCode;
         })
         //绑定性别
         let _sex = this.$config.sexType.find(x=>x.value==_.sex);
         _.sexLabel = _sex?_sex.text: _.sex;
        //绑定工作岗位
         let _job = this.$config.jobsType.find(x=>x.value==_.job);
         _.jobLabel = _job?_job.text: _.job;

         for(let i=0;i<this.dialogSysUserObj.areacode.city.length;i++){
            if(this.dialogSysUserObj.areacode.city[i].areacode==_.cityCode){
                _.cityLabel = this.dialogSysUserObj.areacode.city[i].name;
                for (let j = 0; j < this.dialogSysUserObj.areacode.city[i].county.length; j++) {
                  if(this.dialogSysUserObj.areacode.city[i].county[j].areacode == _.countyCode){
                    _.countyLabel = this.dialogSysUserObj.areacode.city[i].county[j].name;
                    break;
                  }
                }
            }
          }
          return _;
        });
        this.sysUserObj.tableConf.total=data.records;
      })
    },
    deptHandleSizePageChange(page, rows){
      //部门切换页面
      this.dialogDeptObj.pageIndex = page;
      this.dialogDeptObj.pageSize = rows;
      this.getDeptUser({
        page:this.dialogDeptObj.pageIndex,
        rows:this.dialogDeptObj.pageSize
      })
    },
    userHandleSizePageChange(page,rows){
      this.dialogUserObj.pageIndex = page;
      this.dialogUserObj.pageSize = rows;
      this.getUser({
        page:this.dialogUserObj.pageIndex,
        rows:this.dialogUserObj.pageSize
      })
    },
    sysUserHandleSizePageChange(page,rows){
      this.dialogSysUserObj.pageIndex = page;
      this.dialogSysUserObj.pageSize = rows;
      this.getSysUser({
        page:this.dialogSysUserObj.pageIndex,
        rows:this.dialogSysUserObj.pageSize
      })
    },
    deptOperateHandle(row, type){
      switch (type) {
        case "addTop":
          this.dialogDeptObj.title = "新增部门"
          this.dialogDeptObj.state = true;
          this.dialogDeptObj.opt = "add";
          break;
        case "add":
          this.userOperateHandle(null, type);
          this.dialogUserObj.areacode.cityLabel = row.cityCode;
          this.changeProvind(row.cityCode, "dialogUserObjCity")
          this.dialogUserObj.areacode.townLabel = row.countyCode;
          this.dialogUserObj.areacode.deptLabel = row.id+"";
          this.dialogUserObj.areacode.jobsLabel = row.job;
        break;
        case "del":
           this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(()=>{
            businessApi.delDept({
              url:this.$api.delDepUser,
              params:{
                ids:row.id
              }
            }).then(res=>{
              this.getDeptUser();
              this.bindDept(data=>{
                this.dealDeptTree(data.rows);
              })
              this.$message.success("删除成功")
            })
          });
        break;
        case "edit": 
          this.dialogDeptObj.title = "修改部门"
          this.dialogDeptObj.state = true;
          this.dialogDeptObj.opt = "edit";
          this.dialogDeptObj.editId = row.id;
          this.dialogDeptObj.areacode.cityLabel = row.cityCode
          this.dialogDeptObj.areacode.cityLabel2 = row.cityCode
          this.changeProvind(row.cityCode, "dialogDeptObjCity")
          this.dialogDeptObj.areacode.townLabel = row.countyCode;
          this.dialogDeptObj.areacode.jobsLabel = row.jobLabel;
          this.bindDept(data=>{
            this.dialogDeptObj.areacode.dept = data.rows;
            this.dialogDeptObj.areacode.deptLabel = row.name;
            this.dealDeptTree(data.rows)
          })
        break;
        case "show": 
          this.dialogDeptObj.editId = row.id;
          this.getUser({
            deptCode: this.dialogDeptObj.editId,
            page: this.dialogUserObj.pageIndex,
            rows:this.dialogUserObj.pageSize
          })
        break;
        case "search":
          this.getDeptUser({
            page: this.dialogDeptObj.pageIndex,
            rows: this.dialogDeptObj.pageSize,
            name: this.depObj.sInpit
          })
        break;
        default:
          break;
      }
    },
    /**
     * 绑定部门
     */
    bindDept(cb){
      businessApi.DeptDic({
        url:this.$api.allDeptList
      }).then(data=>{
        cb?cb(data):"";
      })
    },
    dealDeptTree(data){
      let _arr = [];
      let parent = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
         if(!parent.includes(element.cityCode)) {
           parent.push(element.cityCode);
           _arr.push({
             label:this.$areacode.province[0].city.find(x=>x.areacode ==element.cityCode).name,
             areacode:element.cityCode,
             children:[{label:element.name, pid:element.id}]
           })
         } else {
          for (let j = 0; j < _arr.length; j++) {
            if (_arr[j].areacode == element.cityCode){
              _arr[j].children.push({label:element.name, pid:element.id});
            }
            
          }
         }
      }

    this.treeDeptData = _arr;
    },
    bindJob(value){
     return this.$config.jobsType.find(x=>x.value == value)
    },
    userOperateHandle(row, type){
      this.dialogUserObj.job = this.$config.jobsType
      switch(type){
        case "add": 
          this.dialogUserObj.title = "新增人员"
          this.dialogUserObj.state=true;
          this.dialogUserObj.opt="add";
        break;
        case "edit": 
          this.dialogUserObj.title = "修改人员"
          this.dialogUserObj.opt="edit";
          this.dialogUserObj.state=true;
          this.dialogUserObj.editId=row.id
          this.dialogUserObj.areacode.cityLabel = row.cityCode 
          this.changeProvind(row.cityCode, "dialogUserObjCity")
          this.dialogUserObj.areacode.townLabel = row.countyCode 
          this.dialogUserObj.areacode.jobsLabel = row.job 
          
          this.bindDept(data=>{
            this.dialogUserObj.areacode.dept = data.rows;
            this.dialogUserObj.areacode.deptLabel = row.deptCode;
          })
          this.dialogUserObj.username = row.account;
          this.dialogUserObj.name = row.name;
          this.dialogUserObj.sex = row.sex;
          this.dialogUserObj.phone = row.contact;
          this.dialogUserObj.mail = row.email;
          this.dialogUserObj.pwd = row.password;
          this.dialogUserObj.useUser = row.enable;
        break;
        case "del":
          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(()=>{
            businessApi.delUser({
              url:this.$api.delUser,
              params:{
                ids:row.id
              }
            }).then(res=>{
              this.getUser({
                page: this.dialogUserObj.pageIndex,
                rows: this.dialogUserObj.pageSize
              });
              this.getSysUser({
                page:this.dialogSysUserObj.pageIndex,
                rows:this.dialogSysUserObj.pageSize
              })
              this.$message.success("删除成功")
            })
          });
        break;
        case "search":
          this.getUser({
            page: this.dialogUserObj.pageIndex,
            rows: this.dialogUserObj.pageSize,
            cityCode:this.areacode.cityLabel,
            countyCode:this.areacode.townLabel,
            deptCode:this.areacode.deptLabel,
            job:this.areacode.jobsLabel,
            name:this.areacode.name
          })
        break;
      }
    },
    sysUserOperateHandle(row, type){
     switch(type){
        case "add": 
          this.dialogSysUserObj.state=true;
          this.dialogSysUserObj.opt="add";
          this.dialogSysUserObj.title ="新增系统用户";
          
          this.bindDept(data=>{
            this.dialogSysUserObj.areacode.dept = data.rows;
          })
        break;
        case "edit": 
          this.dialogSysUserObj.state=true;
          this.dialogSysUserObj.opt="edit";
          this.dialogSysUserObj.title ="修改系统用户";
          this.dialogSysUserObj.editId = row.id;
          this.dialogSysUserObj.name = row.name;
          this.dialogSysUserObj.sex = row.sex;
          this.dialogSysUserObj.phone = row.contact;
          this.dialogSysUserObj.mail = row.email;
          this.dialogSysUserObj.username = row.account;
          this.dialogSysUserObj.level =row.accountType;
          this.dialogSysUserObj.areacode.cityLabel = row.cityCode;
          this.changeProvind(row.cityCode,"dialogSysUserObjCity")
          this.dialogSysUserObj.areacode.townLabel = row.countyCode;
       
          this.bindDept(data=>{
            this.dialogSysUserObj.areacode.dept = data.rows;
            this.dialogSysUserObj.areacode.deptLabel = row.deptCode;
          })
          this.dialogSysUserObj.areacode.jobsLabel = row.job;
        break;
        case "del":
          this.$confirm('确认删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(()=>{
            businessApi.delUser({
              url:this.$api.delUser,
              params:{
                ids:row.id
              }
            }).then(res=>{
              this.getUser({
                page: this.dialogUserObj.pageIndex,
                rows: this.dialogUserObj.pageSize
              });
              this.getSysUser({
                page: this.dialogSysUserObj.pageIndex,
                rows: this.dialogSysUserObj.pageSize
              });
              this.$message.success("删除成功")
            })
          });
        break;
        case "search":
          this.getSysUser({
            page: this.dialogUserObj.pageIndex,
            rows: this.dialogUserObj.pageSize,
            account: this.sysUserObj.sUsername
          })
        break;
      }
    },
    closeDeptObjReceive(){
      this.$refs.dialogDeptObjForm.resetFields()
      this.dialogDeptObj.state=false;
      this.dialogDeptObj.areacode.cityLabel=""
      this.dialogDeptObj.areacode.townLabel=""
      this.dialogDeptObj.areacode.deptLabel=""
      this.dialogDeptObj.areacode.jobsLabel=""
    },
    closeUserObjReceive(){
      this.$refs.dialogUserObjRuleForm.resetFields()
      this.dialogUserObj.state=false;
      this.dialogUserObj.username = ""
      this.dialogUserObj.pwd = ""
      this.dialogUserObj.repwd = ""
      this.dialogUserObj.name = ""
      this.dialogUserObj.sex = "1"
      this.dialogUserObj.areacode.cityLabel = ""
      this.dialogUserObj.areacode.townLabel = ""
      this.dialogUserObj.areacode.deptLabel = ""
      this.dialogUserObj.areacode.jobsLabel = ""
      this.dialogUserObj.phone= ""
      this.dialogUserObj.mail= ""
      this.dialogUserObj.useUser = "0"
    },
    closeSysUserObjReceive(){
      this.$refs.dialogSysUserObjRuleForm.resetFields()
      this.dialogSysUserObj.state=false;
      this.dialogSysUserObj.name =""
      this.dialogSysUserObj.username =""
      this.dialogSysUserObj.sex ="1"
      this.dialogSysUserObj.level ="1"
      this.dialogSysUserObj.phone =""
      this.dialogSysUserObj.mail =""
      this.dialogSysUserObj.pwd =""
      this.dialogSysUserObj.repwd =""
      this.dialogSysUserObj.areacode.cityLabel =""
      this.dialogSysUserObj.areacode.townLabel =""
      this.dialogSysUserObj.areacode.deptLabel =""
      this.dialogSysUserObj.areacode.jobsLabel =""
    },
    addSubmitDept(){
      this.$refs.dialogDeptObjForm.validate((valid) => {
        if (!valid) {
          this.$message.error("您有一项或多项内容验证失败");
          return false;
        }
        if(this.dialogDeptObj.opt =="add"){
          businessApi.addDept({
            url:this.$api.addDept,
            params: {
              cityCode: this.dialogDeptObj.areacode.cityLabel,
              countyCode: this.dialogDeptObj.areacode.townLabel,
              name: this.dialogDeptObj.areacode.deptLabel,
              job: this.dialogDeptObj.areacode.jobsLabel
            }
          }).then(()=>{
            this.$message.success("新增成功");
            this.closeDeptObjReceive()
            this.getDeptUser({
              page:this.dialogDeptObj.pageIndex,
              rows:this.dialogDeptObj.pageSize
            })
            this.bindDept(data=>{
              this.dealDeptTree(data.rows)
            })
          }) 
        } else if (this.dialogDeptObj.opt == "edit" ) {
          businessApi.editDept({
            url:this.$api.editDepUser,
            params:{
              id: this.dialogDeptObj.editId,
              cityCode: this.dialogDeptObj.areacode.cityLabel,
              countyCode: this.dialogDeptObj.areacode.townLabel,
              name: this.dialogDeptObj.areacode.deptLabel,
              job: this.dialogDeptObj.areacode.jobsLabel
            }
          }).then(data=>{
            this.$message.success("修改成功")
            this.closeDeptObjReceive()
            this.bindDept(data=>{
              this.dealDeptTree(data.rows)
            })
            this.getDeptUser({
              page:this.dialogDeptObj.pageIndex,
              rows:this.dialogDeptObj.pageSize
            })
          })
        }
      });
    },
    addSubmitUser(){
      this.$refs.dialogUserObjRuleForm.validate((valid) => {
        if (!valid) {
          this.$message.error("您有一项或多项内容验证失败");
          return false;
        }
        let _pwd={}
        if(this.dialogUserObj.pwd != ""){
          _pwd = {password:pwdEncrypt(this.dialogUserObj.pwd,this.dialogUserObj.pwd.slice(0,18))}
        }
        if(this.dialogUserObj.useUser==0){
          if(this.dialogUserObj.pwd==""){
            this.$message.error("用户名不允许为空");
            return;
          } else if(this.dialogUserObj.pwd==""){
            this.$message.error("密码不允许为空");
            return;
          }else if(this.dialogUserObj.pwd!== this.dialogUserObj.repwd){
            this.$message.error("两次密码不一致");
            return
          }
        }
        if(this.dialogUserObj.opt =="add"){
          
          businessApi.addUser({
            url:this.$api.addUser,
            params: {
              name: this.dialogUserObj.name,
              sex: this.dialogUserObj.sex,
              cityCode: this.dialogUserObj.areacode.cityLabel,
              countyCode: this.dialogUserObj.areacode.townLabel,
              deptCode: this.dialogUserObj.areacode.deptLabel,
              job: this.dialogUserObj.areacode.jobsLabel,
              contact:this.dialogUserObj.phone,
              email:this.dialogUserObj.mail,
              account:this.dialogUserObj.username,
              ..._pwd,
              enable: this.dialogUserObj.useUser,
              accountType: 1
            }
          }).then(()=>{
            this.$message.success("新增成功")
            this.closeUserObjReceive()
            this.getUser({
              page:this.dialogUserObj.pageIndex,
              rows:this.dialogUserObj.pageSize
            })
            this.getSysUser({
              page: this.dialogSysUserObj.pageIndex,
              rows: this.dialogSysUserObj.pageSize
            });
          }) 
        }else if(this.dialogUserObj.opt =="edit"){
          businessApi.editUser({
            url:this.$api.editUser,
            params: {
              id: this.dialogUserObj.editId,
              name: this.dialogUserObj.name,
              sex: this.dialogUserObj.sex,
              cityCode: this.dialogUserObj.areacode.cityLabel,
              countyCode: this.dialogUserObj.areacode.townLabel,
              deptCode: this.dialogUserObj.areacode.deptLabel,
              job: this.dialogUserObj.areacode.jobsLabel,
              contact:this.dialogUserObj.phone,
              email:this.dialogUserObj.mail,
              account:this.dialogUserObj.username,
              ..._pwd,
              enable: this.dialogUserObj.useUser
            }
          }).then(()=>{
            this.$message.success("新增成功")
            this.closeUserObjReceive()
            this.getUser({
              page:this.dialogUserObj.pageIndex,
              rows:this.dialogUserObj.pageSize
            })
            this.getSysUser({
              page: this.dialogSysUserObj.pageIndex,
              rows: this.dialogSysUserObj.pageSize
            });
          }) 
        }
        });
    },
    addSubmitSysUser(){
      this.$refs.dialogSysUserObjRuleForm.validate((valid) => {
        if (!valid) {
          this.$message.error("您有一项或多项内容验证失败");
          return false;
        }
        let _pwd={}
        if(this.dialogUserObj.pwd != ""){
          _pwd = {password:pwdEncrypt(this.dialogUserObj.pwd,this.dialogUserObj.pwd.slice(0,18))}
        }
        if(this.dialogSysUserObj.opt =="add"){
          businessApi.addUser({
            url:this.$api.addUser,
            params: {
              name: this.dialogSysUserObj.name,
              sex: this.dialogSysUserObj.sex,
              cityCode: this.dialogSysUserObj.areacode.cityLabel,
              countyCode: this.dialogSysUserObj.areacode.townLabel,
              deptCode: this.dialogSysUserObj.areacode.deptLabel,
              job: this.dialogSysUserObj.areacode.jobsLabel,
              contact:this.dialogSysUserObj.phone,
              email:this.dialogSysUserObj.mail,
              account:this.dialogSysUserObj.username,
              ..._pwd,
              enable: 0,
              accountType: this.dialogSysUserObj.level
            }
          }).then(()=>{
            this.$message.success("新增成功")
            this.closeSysUserObjReceive()
            this.getUser({
              page:this.dialogUserObj.pageIndex,
              rows:this.dialogUserObj.pageSize
            })
            this.getSysUser({
              page:this.dialogUserObj.pageIndex,
              rows:this.dialogUserObj.pageSize
            })
          }) 
        }else if(this.dialogSysUserObj.opt =="edit"){
          businessApi.editUser({
            url:this.$api.editUser,
            params: {
              id: this.dialogSysUserObj.editId,
              name: this.dialogSysUserObj.name,
              sex: this.dialogSysUserObj.sex,
              cityCode: this.dialogSysUserObj.areacode.cityLabel,
              countyCode: this.dialogSysUserObj.areacode.townLabel,
              deptCode: this.dialogSysUserObj.areacode.deptLabel,
              job: this.dialogSysUserObj.areacode.jobsLabel,
              contact:this.dialogSysUserObj.phone,
              email:this.dialogSysUserObj.mail,
              account:this.dialogSysUserObj.username,
              ..._pwd,
              enable: 0,
              accountType: this.dialogSysUserObj.level
            }
          }).then(()=>{
            this.$message.success("新增成功")
            this.closeSysUserObjReceive()
            this.getUser({
              page:this.dialogUserObj.pageIndex,
              rows:this.dialogUserObj.pageSize
            })
            this.getSysUser({
              page:this.dialogUserObj.pageIndex,
              rows:this.dialogUserObj.pageSize
            })
          }) 
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped src="./sysconf.scss"></style>
