<template>

  <el-dialog
  
    v-dialog-drag
     :visible="dialogVisible"
    @close="close"
    width="80%">
    <span slot="title" class="head">{{title}}</span>
    <slot></slot>  
  </el-dialog>
  
</template>
<script>

import "@/util/ds-directives-dialog-drag";
export default {
  name:"Test",
  props: ["title","dialogVisible"],
  methods:{
    close(){
      this.$emit("close",true);
      
    }
  }
}
</script>
<style lang="scss" scoped>

   ::v-deep .el-dialog{
     border-radius: 7px;
     .el-dialog__header{
      background: #E4F1FF;
     border-radius: 7px 7px 0 0;
      color: #000000;
      height: 40px;
      line-height: 40px;
      padding:0 0 0 10px;
      text-align: left;
      border-bottom: 1px solid #A6E1FF;
      .el-dialog__headerbtn{
        top:13px;
        .el-dialog__close{
          color:#000000;
          top:10px;
        }
      }
    }
  }
  ::v-deep .el-dialog__wrapper{
  overflow: hidden;
}
</style>
