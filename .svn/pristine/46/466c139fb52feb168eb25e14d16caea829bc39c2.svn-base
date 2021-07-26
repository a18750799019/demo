<template>
  <div class="login login-light">
    <kinesis-container class="height100 bg">
      <div class="head">
        <img src="/imgs/login-logo.png">
      </div>
      <div class="content">
        <kinesis-element class="c_position c_bg"></kinesis-element>
        <div class="c_position c_form">
          <div class="h">用户登录</div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="0px"
            class="demo-ruleForm"
          >
            <el-form-item prop="username">
              <input type='text' style="display: none"></input>
              <el-input auto-complete="off" ref="username" v-model="ruleForm.username" placeholder="账号">
                <i slot="prepend">
                  <img src="/imgs/icon-login-user2.png"/>
                </i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <input type='password' style="display: none"></input>
              <el-input ref="password" auto-complete="new-password" type="password" placeholder="密码" v-model="ruleForm.showpwd">
                <i slot="prepend">
                  <img src="/imgs/icon-login-pwd2.png"/>
                </i>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" class="form-item">
              <el-row :span="24">
                <el-col :span="14">
                  <el-input
                    ref="code"
                    v-model="ruleForm.code"
                    autocomplete="off"
                    placeholder="请输入验证码"
                    size
                    @keyup.enter.native="submitForm('ruleForm')"
                  >
                   <i slot="prepend">
                      <img src="/imgs/icon-login-valid2.png"/>
                    </i>
                  </el-input>
                </el-col>
                <el-col :span="10">
                  <div class="login-code" @click="refreshCode">
                    <!--验证码组件-->
                    <s-identify :identifyCode="identifyCode"></s-identify>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="form-item-valid form-item">
              <el-checkbox v-model="isRememberPwd">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
              <div class="login-btn">
                <el-button type="primary" class="sub-btn" @click="submitForm()">登录</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="login-light-footer">
        <!-- <div>@三维时空版权所有</div> -->
      </div>
    </kinesis-container>
  </div>
</template>
<script>
import NProgress from 'nprogress'
import { KinesisContainer, KinesisElement } from "vue-kinesis";
import SIdentify from "@/_sys_components/validCode";
import { localStorageSetting,pwdEncrypt } from "@/util/ds.common";
import { userApi } from "@/api"
export default {
  components: {
    KinesisContainer,
    KinesisElement,
    SIdentify
  },
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        showpwd:"",
        code: ""
      },
      isRememberPwd: false,
      identifyCode: "",
      identifyCodes: "123456789",
      rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          showpwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm=>{ 
      let remObj = localStorageSetting("REMERBERPWD");
      if(remObj){
        vm.ruleForm.username = remObj.username;
        vm.ruleForm.password = remObj.password;
        vm.ruleForm.showpwd = remObj.password.slice(0,18);
        vm.isRememberPwd = remObj.isRememberPwd;
      }
      vm.refreshCode(); 
    })
  },
  methods: {
    submitForm(){
      this.ruleForm.password = pwdEncrypt(this.ruleForm.showpwd,this.ruleForm.password)
      if (this.ruleForm.username.trim() == "") {
         this.$message.error(this.rules.username[0].message);
         this.$refs.username.focus();
         return;
      }
      if (this.ruleForm.password.trim() == "") {
         this.$message.error(this.rules.password[0].message);
         this.$refs.password.focus();
         return;
      }
      if (this.ruleForm.code.trim() == "") {
         this.$message.error(this.rules.code[0].message);
         return;
      }
      if ( this.identifyCode !== this.ruleForm.code) {
         this.$message.error("验证码错误");
         this.$refs.code.focus();
         this.$refs.code.select();
         this.refreshCode();
         return;
      }
      NProgress.start();
      let loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      userApi.loginValid({
        url:this.$api.login,
        params:{
          userName:this.ruleForm.username.trim(),
          password:this.ruleForm.password.trim()
        }
      }).then(res=>{
        if(res.code==200){
           if(this.isRememberPwd){
             localStorageSetting("REMERBERPWD",{
              isRememberPwd: this.isRememberPwd,
              username:this.ruleForm.username.trim(),
              password:this.ruleForm.password.trim()
            })
          } else {
             localStorageSetting("REMERBERPWD", "remove")
          }
          localStorage.setItem("userid",this.ruleForm.username.trim());
          this.$store.dispatch("userCount",res.data);
          localStorageSetting("userCount",res.data)
          this.$router.push("/home");
        }else{
          this.$message.error(res.msg);
        }
      }).finally(res=>{
        loading.close();
        NProgress.done()

      })
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  min-width: 1200px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("/imgs/login-bg.png") no-repeat center;
  background-size: 100% 100%;
  .head {
    position: absolute;
    top: 80px;
    left: calc(50% - 165px);
    font-family: Microsoft YaHei;
  }
  .content {
    .c_position {
      position: absolute;
      width: 375px;
      height: 364px;
      left: calc(50% - 140px);
      top: 280px;
      background: url("/imgs/login-form.png") no-repeat;
    }
    .c_bg {
      background: url("/images/icon-bg.png") no-repeat;
      z-index: 10px;
    }
    .c_form {
      margin-top: 20px;
      .h {
        color: #05327B;
        font-size: 21.34px;
        text-align: center;
        font-weight: Bold;
        margin-bottom: 14px;
        margin-top: 25px;
      }
      .demo-ruleForm {
        width: 300px;
        margin: 0 auto;
      }
    }
    .sub-btn{
      width: 100%;
    }
  }
  .login-light-footer {
    width: calc(100% - 40px);
    overflow: hidden;
    display: block;
    position: absolute;
    padding: 20px;
    color: #929292;
    bottom: 0;
    left: 0;
  }
}

.form-item{
  margin-bottom: 0;
}
.form-item-valid{
  margin-top: 5px;
  margin-bottom: 5px;
}


.height100 {
  height: 100%;
}

 ::v-deep .el-input-group__prepend {
  background: #008EFF;
  border-color:#008EFF;
  padding:0 12px;
  line-height: 10px;
}

::v-deep .el-input__inner{
  height: 38px;
  line-height: 38px;
}
</style>
